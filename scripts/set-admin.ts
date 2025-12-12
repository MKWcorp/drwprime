import { prisma } from '../src/lib/prisma';

async function setAdminUsers() {
  console.log('🔐 Setting admin privileges...');

  const adminUserIds = [
    'user_36gdG2sWQfY5wdGby1gGgML4ziC',
    'user_36jTRE55RsrJHmYbYOaG2yK5MPf'
  ];

  for (const clerkUserId of adminUserIds) {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { clerkUserId }
      });

      if (user) {
        // Update existing user to admin
        await prisma.user.update({
          where: { clerkUserId },
          data: { isAdmin: true }
        });
        console.log(`✅ Updated ${clerkUserId} to admin`);
      } else {
        console.log(`⚠️  User ${clerkUserId} not found in database (will be set as admin on first login)`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${clerkUserId}:`, error);
    }
  }

  console.log('🎉 Admin privileges set successfully!');
}

setAdminUsers()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
