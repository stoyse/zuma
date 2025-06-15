import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def connect_to_db():
    try:
        # Connection parameters from .env
        connection = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "your_database_name"),
            user=os.getenv("DB_USER", "your_username"),
            password=os.getenv("DB_PASSWORD", "your_password"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
        print("Connection to PostgreSQL database successful")
        return connection
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL database: {e}")
        return None

def close_connection(connection):
    if connection:
        connection.close()
        print("Database connection closed")

def insert_connection(userid):
    """
    Fügt einen neuen Eintrag in die Tabelle 'connections' ein.
    :param userid: Die ID des Benutzers (int)
    """
    connection = connect_to_db()
    if not connection:
        print("Keine Datenbankverbindung möglich.")
        return False
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO connections (userid) VALUES (%s);",
                (userid,)
            )
            connection.commit()
            print(f"Neue Verbindung für userid={userid} gespeichert.")
            return True
    except psycopg2.Error as e:
        print(f"Fehler beim Einfügen der Verbindung: {e}")
        return False
    finally:
        close_connection(connection)

# Example usage
if __name__ == "__main__":
    conn = connect_to_db()
    if conn:
        # Perform database operations here
        close_connection(conn)