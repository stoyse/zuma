import psycopg2
from typing import Optional, Dict, Any
from .user_handler import connect_to_db, close_connection

def get_promo_code_details(code: str) -> Optional[Dict[str, Any]]:
    """Ruft die Details eines Promo-Codes aus der Datenbank ab, einschließlich seiner Stripe Coupon ID."""
    conn = None
    try:
        conn = connect_to_db()
        if not conn:
            print("Database connection failed in get_promo_code_details.")
            return None
        
        cursor = conn.cursor()
        cursor.execute(
            "SELECT code, discount_percentage, stripe_coupon_id, is_active FROM promo_codes WHERE code = %s AND is_active = TRUE;", 
            (code,)
        )
        promo_code_data = cursor.fetchone()
        
        if promo_code_data:
            return {
                "code": promo_code_data[0],
                "discount_percentage": promo_code_data[1],
                "stripe_coupon_id": promo_code_data[2],
                "is_active": promo_code_data[3]
            }
        return None
    except Exception as e:
        print(f"Error fetching promo code '{code}': {e}")
        return None
    finally:
        if conn:
            close_connection(conn)

def add_promo_code(code: str, discount_percentage: float, stripe_coupon_id: str, description: Optional[str] = None, is_active: bool = True) -> Dict[str, Any]:
    """Fügt einen neuen Promo-Code zur Datenbank hinzu."""
    conn = None
    try:
        conn = connect_to_db()
        if not conn:
            return {"status": "failure", "message": "Database connection failed."}
        
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO promo_codes (code, discount_percentage, stripe_coupon_id, description, is_active) VALUES (%s, %s, %s, %s, %s) RETURNING id;",
            (code, discount_percentage, stripe_coupon_id, description, is_active)
        )
        promo_code_id = cursor.fetchone()[0]
        conn.commit()
        return {"status": "success", "message": "Promo code added successfully.", "promo_code_id": promo_code_id}
    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        if "promo_codes_code_key" in str(e):
            return {"status": "failure", "message": f"Promo code '{code}' already exists."}
        return {"status": "failure", "message": f"Database integrity error: {e}"}
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error adding promo code '{code}': {e}")
        return {"status": "failure", "message": f"An unexpected error occurred: {str(e)}"}
    finally:
        if conn:
            close_connection(conn)
