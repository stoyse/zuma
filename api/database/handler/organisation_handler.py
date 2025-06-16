import psycopg2
from typing import Optional, Dict, Any
import re  # Import für reguläre Ausdrücke
# Importiere die Verbindungsfunktionen aus user_handler.py
# Angenommen, user_handler.py befindet sich im selben Paket (directory)
from .user_handler import connect_to_db, close_connection, createUser, delete_user # createUser und delete_user importieren

def create_organisation(
    name: str, 
    email: str,  # E-Mail des Besitzers, wird auch als E-Mail der Organisation verwendet
    plan: str,
    phone: Optional[str] = None,
    address: Optional[str] = None,
    website: Optional[str] = None,
    payment_method: Optional[str] = None 
) -> Dict[str, Any]:

    conn = None
    created_user_id_for_cleanup = None # Hält die ID eines neu erstellten Benutzers für den Fall eines Rollbacks
    try:
        conn = connect_to_db() 
        if not conn:
            return {"status": "failure", "message": "Database connection failed for organisation creation."}
            
        cursor = conn.cursor()
        
        user_id_to_use = None 
    
        # Benutzerprüfung und -erstellung
        # Es ist effizienter, die bestehende Verbindung 'conn' zu nutzen, anstatt eine neue aufzubauen.
        cursor.execute("SELECT userid FROM users WHERE email = %s;", (email,))
        user_row = cursor.fetchone()

        if user_row:
            user_id_to_use = user_row[0]
        else:
            user_name_part = email.split('@')[0]
            company_slug = re.sub(r'[^a-z0-9]', '', name.lower())
            # createUser verwendet seine eigene Verbindung, was in Ordnung ist.
            # Wir speichern die ID, falls wir den Benutzer später löschen müssen.
            created_user_id_for_cleanup = createUser(email=email, name=user_name_part, organisation_slug=company_slug)
            if created_user_id_for_cleanup:
                user_id_to_use = created_user_id_for_cleanup
            else:
                # createUser ist fehlgeschlagen, kein Benutzer zum Löschen, da er nicht erstellt wurde.
                return {"status": "failure", "message": "Failed to create new user."}

        # Generiere organisation_slug
        base_slug = re.sub(r'[^a-z0-9]', '', name.lower())
        current_slug = base_slug
        counter = 0
        while True:
            cursor.execute("SELECT 1 FROM organisation WHERE organisation_slug = %s;", (current_slug,))
            if not cursor.fetchone():
                break 
            counter += 1
            current_slug = f"{base_slug}{counter}"

        cursor.execute("""
            INSERT INTO organisation (name, email, plan, owner_id, phone, address, website, payment_method, organisation_slug)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
        """, (name, email, plan, user_id_to_use, phone, address, website, payment_method, current_slug))
        
        organisation_id_tuple = cursor.fetchone()
        organisation_id = None
        if organisation_id_tuple:
            organisation_id = organisation_id_tuple[0]
        else:
            conn.rollback() 
            # Wenn die Organisation nicht erstellt werden konnte und ein neuer Benutzer erstellt wurde, diesen löschen.
            if created_user_id_for_cleanup:
                delete_user(created_user_id_for_cleanup)
            raise Exception("Organisation creation failed, ID not retrieved.")

        conn.commit()
        
        return {
            "status": "success",
            "message": "Organisation and user created/verified successfully.",
            "organisation_id": organisation_id,
            "user_id": user_id_to_use,
            "organisation_slug": current_slug
        }

    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        if created_user_id_for_cleanup: # Wenn ein neuer Benutzer erstellt wurde
            delete_user(created_user_id_for_cleanup)
            created_user_id_for_cleanup = None # Zurücksetzen, um doppeltes Löschen zu vermeiden
        
        if "organisation_organisation_slug_key" in str(e).lower():
            return {"status": "failure", "message": f"Organisation name slug generation conflict: {e}"}
        if "users_email_key" in str(e) or ("users" in str(e) and "email" in str(e) and "unique" in str(e).lower()): 
            # Dieser Fall sollte durch die vorherige Benutzerprüfung eigentlich nicht auftreten,
            # es sei denn, es gibt eine Race Condition oder der Benutzer wurde zwischen Prüfung und Erstellung angelegt.
            return {
                "status": "failure",
                "message": f"A user with email '{email}' already exists but an error occurred during transaction."
            }
        elif "organisation_email_key" in str(e) or ("organisation" in str(e) and "email" in str(e) and "unique" in str(e).lower()): 
            return {
                "status": "failure", 
                "message": f"An organisation with email '{email}' already exists."
            }
        return {"status": "failure", "message": f"Database integrity error: {e}"}
    
    except Exception as e:
        if conn:
            conn.rollback()
        if created_user_id_for_cleanup: # Wenn ein neuer Benutzer erstellt wurde
            delete_user(created_user_id_for_cleanup)
            created_user_id_for_cleanup = None # Zurücksetzen
        print(f"Error in create_organisation: {e}") 
        return {"status": "failure", "message": f"An unexpected error occurred: {str(e)}"}
    
    finally:
        if conn: 
            close_connection(conn)


def get_organisation_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    conn = None
    try:
        conn = connect_to_db()
        if not conn:
            return {"status": "failure", "message": "Database connection failed."}
        
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM organisation WHERE organisation_slug = %s;", (slug,))
        organisation_row = cursor.fetchone()
        
        if organisation_row:
            # Fetch column names from cursor description
            columns = [desc[0] for desc in cursor.description]
            organisation_data = dict(zip(columns, organisation_row))
            return {"status": "success", "organisation": organisation_data}
        else:
            return {"status": "failure", "message": "Organisation not found."}
    
    except Exception as e:
        print(f"Error in get_organisation_by_slug: {e}")
        return {"status": "failure", "message": f"An unexpected error occurred: {str(e)}"}
    
    finally:
        if conn:
            close_connection(conn)
