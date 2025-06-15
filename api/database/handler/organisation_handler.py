import psycopg2
from typing import Optional, Dict, Any
import re # Import für reguläre Ausdrücke
# Importiere die Verbindungsfunktionen aus user_handler.py
# Angenommen, user_handler.py befindet sich im selben Paket (directory)
from .user_handler import connect_to_db, close_connection, createUser # createUser importieren

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
    try:
        conn = connect_to_db() 
        if not conn:
            return {"status": "failure", "message": "Database connection failed for organisation creation."}
            
        cursor = conn.cursor()
        
        user_id_to_use = None 
    
        # Benutzerprüfung und -erstellung (wie zuvor)
        temp_conn_for_check = connect_to_db()
        if not temp_conn_for_check:
             return {"status": "failure", "message": "Database connection failed for user check."}
        temp_cursor = temp_conn_for_check.cursor()
        temp_cursor.execute("SELECT userid FROM users WHERE email = %s;", (email,))
        user_row = temp_cursor.fetchone()
        temp_cursor.close()
        close_connection(temp_conn_for_check)

        if user_row:
            user_id_to_use = user_row[0]
        else:
            user_name_part = email.split('@')[0]
            created_user_id = createUser(email=email, name=user_name_part, organisation=name)
            if created_user_id:
                user_id_to_use = created_user_id
            else:
                return {"status": "failure", "message": "Failed to create new user."}

        # Generiere name_slug
        # Entfernt alles außer a-z, 0-9 und wandelt in Kleinbuchstaben um
        base_slug = re.sub(r'[^a-z0-9]', '', name.lower())
        current_slug = base_slug
        counter = 0
        while True:
            # Überprüfe, ob der current_slug bereits existiert
            # Eine neue temporäre Verbindung/Cursor für diese Prüfung ist sauberer, 
            # um den Transaktionsstatus des Hauptcursors nicht zu beeinflussen,
            # oder stelle sicher, dass diese Prüfung vor anderen Schreibvorgängen im Hauptcursor erfolgt.
            # Hier verwenden wir den Hauptcursor, da es eine einfache SELECT-Abfrage ist.
            cursor.execute("SELECT 1 FROM organisation WHERE name_slug = %s;", (current_slug,))
            if not cursor.fetchone():
                break # Eindeutiger Slug gefunden
            counter += 1
            current_slug = f"{base_slug}{counter}"

        # Organisation erstellen - owner_id bezieht sich auf users.userid
        cursor.execute("""
            INSERT INTO organisation (name, email, plan, owner_id, phone, address, website, payment_method, name_slug)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
        """, (name, email, plan, user_id_to_use, phone, address, website, payment_method, current_slug))
        
        organisation_id_tuple = cursor.fetchone()
        organisation_id = None
        if organisation_id_tuple:
            organisation_id = organisation_id_tuple[0]
        else:
            conn.rollback() 
            raise Exception("Organisation creation failed, ID not retrieved.")

        conn.commit()
        
        return {
            "status": "success",
            "message": "Organisation and user created/verified successfully.",
            "organisation_id": organisation_id,
            "user_id": user_id_to_use,
            "name_slug": current_slug
        }

    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        # ... (bestehende Fehlerbehandlung für E-Mail-Konflikte etc.)
        if "organisation_name_slug_key" in str(e).lower(): # Prüfe auf Slug-Konflikt, falls die Schleife versagt
             return {"status": "failure", "message": f"Organisation name slug generation conflict: {e}"}
        if "users_email_key" in str(e) or ("users" in str(e) and "email" in str(e) and "unique" in str(e).lower()): 
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
        print(f"Error in create_organisation: {e}") 
        return {"status": "failure", "message": f"An unexpected error occurred: {str(e)}"}
    
    finally:
        if conn: 
            close_connection(conn)

