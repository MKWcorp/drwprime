"""
Script to add specific referrals to reservations
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
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

def add_referrer(patient_name, affiliate_code):
    """Add referrer to a reservation by patient name"""
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Find reservation by patient name
        cursor.execute(
            '''
            SELECT r.id, r."userId", r."finalPrice", r.status, r."patientName"
            FROM reservations r
            WHERE LOWER(r."patientName") = LOWER(%s)
            AND r."referrerId" IS NULL
            ORDER BY r."createdAt" DESC
            LIMIT 1
            ''',
            (patient_name,)
        )
        reservation = cursor.fetchone()
        
        if not reservation:
            print(f"❌ Reservation for {patient_name} not found or already has referrer")
            return False
        
        # Get referrer by affiliate code
        cursor.execute(
            'SELECT id, "firstName", "lastName" FROM users WHERE "affiliateCode" = %s',
            (affiliate_code.upper(),)
        )
        referrer = cursor.fetchone()
        
        if not referrer:
            print(f"❌ Affiliate code {affiliate_code} not found")
            return False
        
        # Check if user trying to use their own code
        if reservation['userId'] == referrer['id']:
            print(f"❌ Cannot use own affiliate code")
            return False
        
        # Calculate commission
        commission_rate = 0.10
        commission_amount = float(reservation['finalPrice']) * commission_rate
        
        print(f"\n📝 Processing: {patient_name}")
        print(f"   Reservation ID: {reservation['id'][:12]}...")
        print(f"   Status: {reservation['status']}")
        print(f"   Price: Rp {float(reservation['finalPrice']):,.0f}")
        print(f"   Commission: Rp {commission_amount:,.0f}")
        print(f"   Referrer: {referrer['firstName']} {referrer['lastName']} ({affiliate_code})")
        
        # Update reservation
        cursor.execute(
            '''
            UPDATE reservations 
            SET "referredBy" = %s, 
                "referrerId" = %s,
                "commissionAmount" = %s
            WHERE id = %s
            ''',
            (affiliate_code.upper(), referrer['id'], commission_amount, reservation['id'])
        )
        
        # If reservation is completed, pay commission immediately
        if reservation['status'] == 'completed':
            print(f"   💰 Paying commission (status: completed)...")
            
            # Update referrer earnings
            cursor.execute(
                '''
                UPDATE users 
                SET "totalEarnings" = "totalEarnings" + %s,
                    "totalReferrals" = "totalReferrals" + 1,
                    points = points + %s
                WHERE id = %s
                ''',
                (commission_amount, int(commission_amount / 100), referrer['id'])
            )
            
            # Create transaction
            cursor.execute(
                '''
                INSERT INTO transactions 
                    ("userId", type, amount, points, description, "referenceId", "createdAt")
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                ''',
                (
                    referrer['id'], 
                    'commission', 
                    commission_amount,
                    int(commission_amount / 100),
                    f"Commission from referral: {patient_name}",
                    reservation['id']
                )
            )
            
            # Mark commission as paid
            cursor.execute(
                'UPDATE reservations SET "commissionPaid" = true WHERE id = %s',
                (reservation['id'],)
            )
            
            print(f"   ✅ Commission paid!")
        else:
            print(f"   ⏳ Commission will be paid when completed")
        
        conn.commit()
        print(f"   ✅ Referrer added successfully!\n")
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def verify_referrals():
    """Verify all referrals are added correctly"""
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    print("\n" + "="*80)
    print("VERIFYING REFERRALS")
    print("="*80 + "\n")
    
    patients = ["wildan arif", "Ajeng Disna Wiherdaning", "FIKA"]
    
    for patient in patients:
        cursor.execute(
            '''
            SELECT 
                r."patientName",
                r.status,
                r."finalPrice",
                r."referredBy",
                r."commissionAmount",
                r."commissionPaid",
                u."firstName" as referrer_first,
                u."lastName" as referrer_last,
                u."affiliateCode" as referrer_code
            FROM reservations r
            LEFT JOIN users u ON r."referrerId" = u.id
            WHERE LOWER(r."patientName") = LOWER(%s)
            ORDER BY r."createdAt" DESC
            LIMIT 1
            ''',
            (patient,)
        )
        
        result = cursor.fetchone()
        
        if result:
            print(f"✅ {result['patientName']}")
            print(f"   Status: {result['status']}")
            print(f"   Price: Rp {float(result['finalPrice']):,.0f}")
            if result['referredBy']:
                print(f"   Referrer: {result['referrer_first']} {result['referrer_last']}")
                print(f"   Affiliate Code: {result['referrer_code']}")
                print(f"   Commission: Rp {float(result['commissionAmount']):,.0f}")
                print(f"   Commission Paid: {'Yes' if result['commissionPaid'] else 'No'}")
            else:
                print(f"   ⚠️  NO REFERRER DATA!")
            print()
    
    cursor.close()
    conn.close()

def main():
    print("="*80)
    print("ADDING REFERRALS TO RESERVATIONS")
    print("="*80)
    
    # Add referrals
    referrals = [
        ("wildan arif", "WIQGM"),
        ("Ajeng Disna Wiherdaning", "DRWPR"),
        ("FIKA", "UT2O8")
    ]
    
    success_count = 0
    for patient_name, affiliate_code in referrals:
        if add_referrer(patient_name, affiliate_code):
            success_count += 1
    
    print("="*80)
    print(f"SUMMARY: {success_count}/{len(referrals)} referrals added successfully")
    print("="*80)
    
    # Verify
    verify_referrals()

if __name__ == "__main__":
    main()
