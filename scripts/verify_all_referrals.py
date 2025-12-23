"""
Final verification of all referrals
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

def verify_all():
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    print("="*80)
    print("FINAL VERIFICATION - ALL RESERVATIONS")
    print("="*80 + "\n")
    
    cursor.execute(
        '''
        SELECT 
            r.id,
            r."patientName",
            r."patientEmail",
            r."patientPhone",
            r.status,
            r."finalPrice",
            r."referredBy",
            r."commissionAmount",
            r."commissionPaid",
            r."createdAt",
            u."firstName" as booker_first,
            u."lastName" as booker_last,
            u."affiliateCode" as booker_code,
            ref."firstName" as referrer_first,
            ref."lastName" as referrer_last,
            ref."affiliateCode" as referrer_code
        FROM reservations r
        JOIN users u ON r."userId" = u.id
        LEFT JOIN users ref ON r."referrerId" = ref.id
        ORDER BY r."createdAt" DESC
        LIMIT 10
        '''
    )
    
    results = cursor.fetchall()
    
    for i, res in enumerate(results, 1):
        print(f"{i}. {res['patientName']} - {res['status'].upper()}")
        print(f"   Phone: {res['patientPhone']}")
        print(f"   Price: Rp {float(res['finalPrice']):,.0f}")
        print(f"   Booked by: {res['booker_first']} {res['booker_last']} ({res['booker_code']})")
        
        if res['referredBy']:
            print(f"   ✅ Referrer: {res['referrer_first']} {res['referrer_last']} ({res['referrer_code']})")
            print(f"   ✅ Commission: Rp {float(res['commissionAmount']):,.0f}")
            print(f"   ✅ Paid: {'YES' if res['commissionPaid'] else 'NO'}")
        else:
            print(f"   ❌ NO REFERRER")
        
        print(f"   Created: {res['createdAt']}")
        print()
    
    # Count stats
    cursor.execute(
        '''
        SELECT 
            COUNT(*) as total,
            COUNT(r."referrerId") as with_referrer,
            COUNT(*) - COUNT(r."referrerId") as without_referrer,
            COUNT(CASE WHEN r.status = 'completed' AND r."commissionPaid" = true THEN 1 END) as paid_commissions
        FROM reservations r
        '''
    )
    
    stats = cursor.fetchone()
    
    print("="*80)
    print("STATISTICS")
    print("="*80)
    print(f"Total Reservations: {stats['total']}")
    print(f"With Referrer: {stats['with_referrer']}")
    print(f"Without Referrer: {stats['without_referrer']}")
    print(f"Paid Commissions: {stats['paid_commissions']}")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    verify_all()
