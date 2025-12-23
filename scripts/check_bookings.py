"""
Check who booked the reservations
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def connect_db():
    database_url = os.getenv('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    return conn

def check_bookings():
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    patients = ["wildan arif", "Ajeng Disna Wiherdaning", "FIKA"]
    
    print("="*80)
    print("CHECKING WHO BOOKED THESE RESERVATIONS")
    print("="*80 + "\n")
    
    for patient in patients:
        cursor.execute(
            '''
            SELECT 
                r."patientName",
                r.status,
                u.id as user_id,
                u."firstName" as user_first,
                u."lastName" as user_last,
                u.email as user_email,
                u."affiliateCode" as user_code
            FROM reservations r
            JOIN users u ON r."userId" = u.id
            WHERE LOWER(r."patientName") = LOWER(%s)
            AND r."referrerId" IS NULL
            ORDER BY r."createdAt" DESC
            LIMIT 1
            ''',
            (patient,)
        )
        
        result = cursor.fetchone()
        
        if result:
            print(f"📋 {result['patientName']} ({result['status']})")
            print(f"   Booked by: {result['user_first']} {result['user_last']}")
            print(f"   Email: {result['user_email']}")
            print(f"   Their affiliate code: {result['user_code']}")
            print()
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    check_bookings()
