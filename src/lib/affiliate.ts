/**
 * Generate a 5-digit affiliate code from user's name
 * Format: 2 letters from first name + 3 random alphanumeric
 * Example: "John Doe" -> "JO5X9"
 */
export function generateAffiliateCode(firstName: string = '', lastName: string = ''): string {
  // Get first 2 letters from first name, uppercase
  const firstPart = firstName.slice(0, 2).toUpperCase() || 'XX';
  
  // Generate 3 random alphanumeric characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 3; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return firstPart + randomPart;
}

/**
 * Check if affiliate code is unique in database
 */
export async function ensureUniqueAffiliateCode(
  firstName: string, 
  lastName: string,
  checkUnique: (code: string) => Promise<boolean>
): Promise<string> {
  let code = generateAffiliateCode(firstName, lastName);
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const isUnique = await checkUnique(code);
    if (isUnique) {
      return code;
    }
    code = generateAffiliateCode(firstName, lastName);
    attempts++;
  }
  
  // Fallback: generate completely random code
  return 'AF' + Math.random().toString(36).substring(2, 5).toUpperCase();
}

/**
 * Calculate commission based on treatment price
 * Default: 10% commission
 */
export function calculateCommission(price: number, rate: number = 0.10): number {
  return Math.round(price * rate * 100) / 100;
}

/**
 * Calculate loyalty points earned from transaction
 * Every Rp 1,000 = 1 point
 */
export function calculateLoyaltyPoints(amount: number): number {
  return Math.floor(amount / 1000);
}

/**
 * Determine loyalty level based on total points
 */
export function getLoyaltyLevel(points: number): string {
  if (points >= 10000) return 'Platinum';
  if (points >= 5000) return 'Gold';
  if (points >= 2000) return 'Silver';
  return 'Bronze';
}

/**
 * Generate unique voucher redemption code
 */
export function generateVoucherCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VC-${timestamp}-${random}`;
}
