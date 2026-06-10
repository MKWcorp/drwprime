import { prisma } from '../src/lib/prisma';
import { catalogCategories } from '../src/lib/treatment-catalog';

async function main() {
  console.log(`Syncing ${catalogCategories.length} treatment categories from source menu...`);

  const syncedCategorySlugs = new Set<string>();
  const syncedTreatmentSlugs = new Set<string>();

  for (const [categoryIndex, category] of catalogCategories.entries()) {
    syncedCategorySlugs.add(category.slug);

    const savedCategory = await prisma.treatmentCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        order: categoryIndex + 1,
        active: true
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        order: categoryIndex + 1,
        active: true
      }
    });

    for (const treatment of category.treatments) {
      syncedTreatmentSlugs.add(treatment.slug);

      await prisma.treatment.upsert({
        where: { slug: treatment.slug },
        update: {
          categoryId: savedCategory.id,
          name: treatment.name,
          description: treatment.description || null,
          price: treatment.price,
          duration: treatment.duration,
          benefits: treatment.benefits,
          active: true
        },
        create: {
          categoryId: savedCategory.id,
          name: treatment.name,
          slug: treatment.slug,
          description: treatment.description || null,
          price: treatment.price,
          duration: treatment.duration,
          benefits: treatment.benefits,
          active: true
        }
      });
    }
  }

  await prisma.treatment.updateMany({
    where: {
      slug: {
        notIn: Array.from(syncedTreatmentSlugs)
      }
    },
    data: {
      active: false
    }
  });

  await prisma.treatmentCategory.updateMany({
    where: {
      slug: {
        notIn: Array.from(syncedCategorySlugs)
      }
    },
    data: {
      active: false
    }
  });

  console.log(`Synced ${syncedCategorySlugs.size} categories and ${syncedTreatmentSlugs.size} treatments.`);
}

main()
  .catch((error) => {
    console.error('Treatment sync failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });