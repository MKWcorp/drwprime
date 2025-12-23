"""
Script to check and update missing referrals in reservations
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def connect_db():
    """Connect to PostgreSQL database"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL not found in environment variables")
    
    conn = psycopg2.connect(database_url)
    return conn

def get_reservations_without_referrer():
    """Get all reservations that don't have a referrer"""
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = """
        SELECT 
            r.id,
            r."patientName",
            r."patientEmail",
            r."patientPhone",
            r.status,
            r."reservationDate",
            r."reservationTime",
            r."finalPrice",
            r."referredBy",
            r."referrerId",
            r."createdAt",
            t.name as treatment_name,
            u."firstName" as user_first_name,
            u."lastName" as user_last_name,
            u.email as user_email
        FROM reservations r
        JOIN treatments t ON r."treatmentId" = t.id
        JOIN users u ON r."userId" = u.id
        WHERE r."referrerId" IS NULL
        ORDER BY r."createdAt" DESC
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return results

def get_all_affiliate_codes():
    """Get all valid affiliate codes from users"""
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = """
        SELECT 
            id,
            "affiliateCode",
            "firstName",
            "lastName",
            email
        FROM users
        ORDER BY "affiliateCode"
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return results

def add_referrer_to_reservation(reservation_id, affiliate_code):
    """Add referrer to a specific reservation"""
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Get referrer by affiliate code
        cursor.execute(
            'SELECT id FROM users WHERE "affiliateCode" = %s',
            (affiliate_code.upper(),)
        )
        referrer = cursor.fetchone()
        
        if not referrer:
            print(f"❌ Affiliate code {affiliate_code} not found")
            return False
        
        referrer_id = referrer['id']
        
        # Get reservation to calculate commission
        cursor.execute(
            'SELECT "finalPrice", status, "userId" FROM reservations WHERE id = %s',
            (reservation_id,)
        )
        reservation = cursor.fetchone()
        
        if not reservation:
            print(f"❌ Reservation {reservation_id} not found")
            return False
        
        # Check if user trying to use their own code
        if reservation['userId'] == referrer_id:
            print(f"❌ Cannot use own affiliate code")
            return False
        
        # Calculate commission
        commission_rate = 0.10
        commission_amount = float(reservation['finalPrice']) * commission_rate
        
        # Update reservation
        cursor.execute(
            '''
            UPDATE reservations 
            SET "referredBy" = %s, 
                "referrerId" = %s,
                "commissionAmount" = %s
            WHERE id = %s
            ''',
            (affiliate_code.upper(), referrer_id, commission_amount, reservation_id)
        )
        
        # If reservation is completed, pay commission immediately
        if reservation['status'] == 'completed':
            # Update referrer earnings
            cursor.execute(
                '''
                UPDATE users 
                SET "totalEarnings" = "totalEarnings" + %s,
                    "totalReferrals" = "totalReferrals" + 1,
                    points = points + %s
                WHERE id = %s
                ''',
                (commission_amount, int(commission_amount / 100), referrer_id)
            )
            
            # Get reservation patient name for transaction
            cursor.execute(
                'SELECT "patientName" FROM reservations WHERE id = %s',
                (reservation_id,)
            )
            patient = cursor.fetchone()
            
            # Create transaction
            cursor.execute(
                '''
                INSERT INTO transactions 
                    ("userId", type, amount, points, description, "referenceId", "createdAt")
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                ''',
                (
                    referrer_id, 
                    'commission', 
                    commission_amount,
                    int(commission_amount / 100),
                    f"Commission from referral: {patient['patientName']}",
                    reservation_id
                )
            )
            
            # Mark commission as paid
            cursor.execute(
                'UPDATE reservations SET "commissionPaid" = true WHERE id = %s',
                (reservation_id,)
            )
            
            print(f"✅ Commission paid: Rp {commission_amount:,.0f}")
        
        conn.commit()
        print(f"✅ Referrer added successfully!")
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def main():
    print("=" * 80)
    print("CHECKING RESERVATIONS WITHOUT REFERRER")
    print("=" * 80)
    
    # Get reservations without referrer
    reservations = get_reservations_without_referrer()
    
    if not reservations:
        print("\n✅ All reservations have referrers!")
        return
    
    print(f"\n📋 Found {len(reservations)} reservations without referrer:\n")
    
    for i, res in enumerate(reservations, 1):
        print(f"{i}. ID: {res['id'][:8]}...")
        print(f"   Patient: {res['patientName']}")
        print(f"   Email: {res['patientEmail']}")
        print(f"   Phone: {res['patientPhone']}")
        print(f"   Treatment: {res['treatment_name']}")
        print(f"   Status: {res['status']}")
        print(f"   Date: {res['reservationDate']} {res['reservationTime']}")
        print(f"   Price: Rp {float(res['finalPrice']):,.0f}")
        print(f"   Booked by: {res['user_first_name']} {res['user_last_name']} ({res['user_email']})")
        print(f"   Created: {res['createdAt']}")
        print()
    
    print("\n" + "=" * 80)
    print("AVAILABLE AFFILIATE CODES")
    print("=" * 80)
    
    affiliates = get_all_affiliate_codes()
    print(f"\n📋 {len(affiliates)} affiliate codes available:\n")
    
    for aff in affiliates:
        print(f"  {aff['affiliateCode']:10s} - {aff['firstName']} {aff['lastName']} ({aff['email']})")
    
    print("\n" + "=" * 80)
    print("ADD REFERRER TO RESERVATIONS")
    print("=" * 80)
    
    while True:
        print("\nOptions:")
        print("1. Add referrer to specific reservation")
        print("2. Exit")
        
        choice = input("\nChoose option (1-2): ").strip()
        
        if choice == '2':
            print("\n👋 Bye!")
            break
        elif choice == '1':
            res_id = input("Enter reservation ID (or first 8 chars): ").strip()
            
            # Find matching reservation
            matching = [r for r in reservations if r['id'].startswith(res_id)]
            
            if not matching:
                print("❌ Reservation not found")
                continue
            
            if len(matching) > 1:
                print("⚠️ Multiple matches found, please be more specific")
                continue
            
            reservation = matching[0]
            print(f"\n📝 Selected: {reservation['patientName']} - {reservation['treatment_name']}")
            print(f"   Status: {reservation['status']}")
            print(f"   Price: Rp {float(reservation['finalPrice']):,.0f}")
            
            affiliate_code = input("\nEnter affiliate code: ").strip().upper()
            
            confirm = input(f"\nAdd affiliate {affiliate_code} to this reservation? (y/n): ").strip().lower()
            
            if confirm == 'y':
                success = add_referrer_to_reservation(reservation['id'], affiliate_code)
                if success:
                    # Refresh data
                    reservations = get_reservations_without_referrer()
                    if not reservations:
                        print("\n✅ All reservations now have referrers!")
                        break
        else:
            print("❌ Invalid option")

if __name__ == "__main__":
    main()
