import psycopg2
from typing import Optional, Dict, Any
from .user_handler import connect_to_db, close_connection # Annahme: user_handler.py existiert und hat diese Funktionen

def create_enterprise_lead(
    organisation_name: str,
    contact_email: str,
    phone: Optional[str] = None,
    address: Optional[str] = None,
    website: Optional[str] = None,
    notes: Optional[str] = None
) -> Dict[str, Any]:
    """Erstellt einen neuen Enterprise-Lead in der Datenbank."""
    conn = None
    try:
        conn = connect_to_db()
        if not conn:
            return {"status": "failure", "message": "Database connection failed."}
        
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO enterprise_leads (organisation_name, contact_email, phone, address, website, notes)
               VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;""",
            (organisation_name, contact_email, phone, address, website, notes)
        )
        lead_id = cursor.fetchone()[0]
        conn.commit()
        return {
            "status": "success", 
            "message": "Enterprise lead created successfully.", 
            "lead_id": lead_id
        }
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        print(f"Database error creating enterprise lead: {e}")
        return {"status": "failure", "message": f"Database error: {e}"}
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Unexpected error creating enterprise lead: {e}")
        return {"status": "failure", "message": f"An unexpected error occurred: {str(e)}"}
    finally:
        if conn:
            close_connection(conn)
