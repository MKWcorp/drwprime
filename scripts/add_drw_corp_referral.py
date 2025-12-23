"""
Add DRW Corp referral to wildan arif reservation
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import secrets
import time

load_dotenv()

def generate_cuid():
    """Generate a simple CUID-like ID"""
    timestamp = hex(int(time.time() * 1000))[2:]
    random_part = secrets.token_hex(8)
    return f"cm{timestamp}{random_part}"[:25]

def connect_db():
    database_url = os.getenv('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    return conn

def add_drw_corp_referral():
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        print("="*80)
        print("ADDING DRW CORP REFERRAL TO WILDAN ARIF")
        print("="*80 + "\n")
        
        # Get wildan arif reservation
        cursor.execute(
            '''
            SELECT id, "userId", "finalPrice", status, "patientName", "patientEmail"
            FROM reservations
            WHERE LOWER("patientName") = LOWER('wildan arif')
            AND "referrerId" IS NULL
            ORDER BY "createdAt" DESC
            LIMIT 1
            '''
        )
        reservation = cursor.fetchone()
        
        if not reservation:
            print("❌ Reservation not found")
            return False
        
        # Get DRW Corp user
        cursor.execute(
            'SELECT id, "firstName", "lastName", "affiliateCode" FROM users WHERE "affiliateCode" = %s',
            ('DRJJ9',)
        )
        referrer = cursor.fetchone()
        
        if not referrer:
            print("❌ DRW Corp not found")
            return False
        
        print(f"📝 Reservation Details:")
        print(f"   Patient: {reservation['patientName']}")
        print(f"   Email: {reservation['patientEmail']}")
        print(f"   Status: {reservation['status']}")
        print(f"   Price: Rp {float(reservation['finalPrice']):,.0f}")
        print()
        
        # Calculate commission
        commission_rate = 0.10
        commission_amount = float(reservation['finalPrice']) * commission_rate
        
        print(f"💰 Commission Calculation:")
        print(f"   Rate: 10%")
        print(f"   Amount: Rp {commission_amount:,.0f}")
        print(f"   Points: {int(commission_amount / 100)}")
        print()
        
        print(f"👤 Referrer: {referrer['firstName']} {referrer['lastName']} ({referrer['affiliateCode']})")
        print()
        
        # Update reservation with referrer
        print("📝 Updating reservation...")
        cursor.execute(
            '''
            UPDATE reservations 
            SET "referredBy" = %s, 
                "referrerId" = %s,
                "commissionAmount" = %s
            WHERE id = %s
            RETURNING id
            ''',
            (referrer['affiliateCode'], referrer['id'], commission_amount, reservation['id'])
        )
        
        updated = cursor.fetchone()
        if not updated:
            print("❌ Failed to update reservation")
            conn.rollback()
            return False
        
        print("✅ Reservation updated!")
        print()
        
        # Pay commission since status is completed
        if reservation['status'] == 'completed':
            print("💰 Paying commission (status: completed)...")
            
            # Update referrer earnings
            cursor.execute(
                '''
                UPDATE users 
                SET "totalEarnings" = "totalEarnings" + %s,
                    "totalReferrals" = "totalReferrals" + 1,
                    points = points + %s
                WHERE id = %s
                RETURNING "totalEarnings", "totalReferrals", points
                ''',
                (commission_amount, int(commission_amount / 100), referrer['id'])
            )
            
            updated_user = cursor.fetchone()
            print(f"✅ Updated DRW Corp earnings:")
            print(f"   Total Earnings: Rp {float(updated_user['totalEarnings']):,.0f}")
            print(f"   Total Referrals: {updated_user['totalReferrals']}")
            print(f"   Points: {updated_user['points']}")
            print()
            
            # Create transaction
            transaction_id = generate_cuid()
            cursor.execute(
                '''
                INSERT INTO transactions 
                    (id, "userId", type, amount, points, description, "referenceId", "createdAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
                ''',
                (
                    transaction_id,
                    referrer['id'], 
                    'commission', 
                    commission_amount,
                    int(commission_amount / 100),
                    f"Commission from referral: {reservation['patientName']}",
                    reservation['id']
                )
            )
            
            transaction = cursor.fetchone()
            print(f"✅ Transaction created: {transaction['id'][:12]}...")
            print()
            
            # Mark commission as paid
            cursor.execute(
                'UPDATE reservations SET "commissionPaid" = true WHERE id = %s',
                (reservation['id'],)
            )
            
            print("✅ Commission marked as paid!")
        
        conn.commit()
        print()
        print("="*80)
        print("SUCCESS! ALL DATA SAVED TO DATABASE")
        print("="*80)
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        cursor.close()
        conn.close()

def verify_result():
    conn = connect_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    print("\n" + "="*80)
    print("VERIFICATION - CHECKING DATABASE")
    print("="*80 + "\n")
    
    # Check wildan arif reservation
    cursor.execute(
        '''
        SELECT 
            r."patientName",
            r.status,
            r."finalPrice",
            r."referredBy",
            r."commissionAmount",
            r."commissionPaid",
            ref."firstName" as referrer_first,
            ref."lastName" as referrer_last,
            ref."affiliateCode" as referrer_code
        FROM reservations r
        LEFT JOIN users ref ON r."referrerId" = ref.id
        WHERE LOWER(r."patientName") = LOWER('wildan arif')
        ORDER BY r."createdAt" DESC
        LIMIT 1
        '''
    )
    
    result = cursor.fetchone()
    
    if result:
        print(f"✅ RESERVATION: {result['patientName']}")
        print(f"   Status: {result['status']}")
        print(f"   Price: Rp {float(result['finalPrice']):,.0f}")
        
        if result['referredBy']:
            print(f"   ✅ Referrer: {result['referrer_first']} {result['referrer_last']}")
            print(f"   ✅ Affiliate Code: {result['referrer_code']}")
            print(f"   ✅ Commission Amount: Rp {float(result['commissionAmount']):,.0f}")
            print(f"   ✅ Commission Paid: {'YES ✅' if result['commissionPaid'] else 'NO ❌'}")
        else:
            print(f"   ❌ NO REFERRER DATA IN DATABASE!")
    else:
        print("❌ Reservation not found!")
    
    print()
    
    # Check DRW Corp user
    cursor.execute(
        '''
        SELECT 
            "firstName",
            "lastName",
            "affiliateCode",
            "totalEarnings",
            "totalReferrals",
            points
        FROM users
        WHERE "affiliateCode" = 'DRJJ9'
        '''
    )
    
    drw = cursor.fetchone()
    
    if drw:
        print(f"✅ DRW CORP ACCOUNT:")
        print(f"   Name: {drw['firstName']} {drw['lastName']}")
        print(f"   Code: {drw['affiliateCode']}")
        print(f"   Total Earnings: Rp {float(drw['totalEarnings']):,.0f}")
        print(f"   Total Referrals: {drw['totalReferrals']}")
        print(f"   Points: {drw['points']}")
    
    print()
    
    # Check transactions
    cursor.execute(
        '''
        SELECT 
            type,
            amount,
            points,
            description,
            "createdAt"
        FROM transactions
        WHERE "userId" = (SELECT id FROM users WHERE "affiliateCode" = 'DRJJ9')
        ORDER BY "createdAt" DESC
        LIMIT 5
        '''
    )
    
    transactions = cursor.fetchall()
    
    if transactions:
        print(f"✅ RECENT TRANSACTIONS (DRW CORP):")
        for i, tx in enumerate(transactions, 1):
            print(f"   {i}. {tx['type'].upper()}: Rp {float(tx['amount']):,.0f}")
            print(f"      {tx['description']}")
            print(f"      {tx['createdAt']}")
            print()
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    success = add_drw_corp_referral()
    if success:
        verify_result()
