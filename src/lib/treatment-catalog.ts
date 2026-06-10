import rawMenu from '../data/drw-menu-source.json';

type RawMenuItem = {
  nama?: string;
  name?: string;
  harga?: string;
  price?: string;
  deskripsi?: string | null;
  description?: string | null;
};

type RawMenuCategory = {
  kategori?: string;
  category?: string;
  items: RawMenuItem[];
};

type RawMenuData = {
  informasi_klinik?: {
    nama: string;
    alamat: string;
    kontak: string;
  };
  clinic_info?: {
    name: string;
    address: string;
    contact: string;
  };
  menu: RawMenuCategory[];
};

export interface CatalogTreatment {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  duration: number | null;
  benefits: string[];
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  treatments: CatalogTreatment[];
}

interface CategorySeed {
  slug: string;
  name: string;
  description: string;
  items: RawMenuItem[];
}

const SOURCE = rawMenu as RawMenuData;
const citationPattern = /\s*\[cite:\s*[^\]]+\]/gi;

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'facial-basic': 'Perawatan facial dasar untuk membersihkan dan merelaksasi kulit wajah.',
  'facial-prime': 'Perawatan facial premium dengan serum tambahan untuk hasil yang lebih maksimal.',
  'chemical-peeling': 'Eksfoliasi kulit dengan bahan aktif untuk membantu regenerasi dan mencerahkan kulit.',
  'ipl': 'Perawatan dengan intense pulsed light untuk berbagai masalah kulit dan rambut.',
  'pico-laser': 'Perawatan laser picosecond non-ablatif untuk rejuvenasi, pigmentasi, dan area khusus.',
  cauter: 'Tindakan elektrokauter untuk menangani lesi atau jaringan kulit tertentu.',
  'dermapen-epn': 'Microneedling dengan teknologi EPN untuk regenerasi kulit yang lebih intensif.',
  'hifu-ultraformer-mpt': 'Perawatan HIFU non-invasif untuk lifting, tightening, dan contouring.',
  botox: 'Pilihan botulinum toxin untuk membantu mengurangi garis halus dan membentuk area wajah tertentu.',
  'skin-booster': 'Injectable skin booster untuk hidrasi, perbaikan tekstur, dan regenerasi kulit.',
  injection: 'Beragam treatment injeksi untuk jerawat, keloid, PRP, dan body contouring.',
  infusion: 'Pilihan infus vitamin dan booster untuk kebutuhan kecantikan dan kebugaran.',
  'add-on': 'Layanan tambahan untuk melengkapi hasil treatment utama.',
  'body-treatment': 'Perawatan tubuh dan spa untuk relaksasi, sirkulasi, dan body wellness.',
  'hair-treatment': 'Perawatan rambut dan styling untuk kebersihan, nutrisi, dan penataan rambut.',
  'anti-dandruff': 'Perawatan khusus kulit kepala untuk membantu mengurangi ketombe dan iritasi.',
  'collagen-nano-spray': 'Perawatan rambut dengan teknologi nano spray untuk hidrasi dan perbaikan struktur rambut.',
  'anti-hair-fall': 'Perawatan penguat akar rambut untuk membantu mengurangi kerontokan.',
  'hand-spa': 'Perawatan spa untuk tangan dan kaki agar lebih halus, bersih, dan rileks.',
  'nail-treatment': 'Pilihan nail art, nail gel, dan nail extension untuk tampilan kuku yang rapi dan menarik.',
  'eyelash-extension': 'Pilihan eyelash extension dan lash care untuk tampilan mata yang lebih tegas.',
  'menicure-pedicure': 'Perawatan kuku tangan dan kaki untuk kebersihan, relaksasi, dan tampilan yang rapi.',
  'slimming-treatment': 'Paket slimming treatment bertahap untuk program penurunan berat badan.'
};

export const homeTreatmentCategorySlugs = [
  'facial-basic',
  'facial-prime',
  'chemical-peeling',
  'infusion',
  'body-treatment',
  'hair-treatment',
  'hand-spa',
  'nail-treatment',
  'eyelash-extension',
  'menicure-pedicure'
];

function cleanText(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return value.replace(citationPattern, '').replace(/\s+/g, ' ').trim();
}

function slugify(value: string): string {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePrice(price: string): number {
  const digits = cleanText(price).replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function itemName(item: RawMenuItem): string {
  return cleanText(item.nama ?? item.name);
}

function itemPrice(item: RawMenuItem): string {
  return cleanText(item.harga ?? item.price);
}

function itemDescription(item: RawMenuItem): string {
  return cleanText(item.deskripsi ?? item.description);
}

function categoryName(category: RawMenuCategory): string {
  return cleanText(category.kategori ?? category.category);
}

function buildCategorySeeds(menu: RawMenuCategory[]): CategorySeed[] {
  return menu.flatMap((category) => {
    const categoryNameUpper = categoryName(category).toUpperCase();
    const items = category.items;

    if (categoryNameUpper === 'FACIAL BASIC & PRIME') {
      return [
        {
          slug: 'facial-basic',
          name: 'Facial Basic',
          description: CATEGORY_DESCRIPTIONS['facial-basic'],
          items: items.filter((item) =>
            ['Acne Facial', 'Glow Facial'].includes(itemName(item))
          )
        },
        {
          slug: 'facial-prime',
          name: 'Facial Prime',
          description: CATEGORY_DESCRIPTIONS['facial-prime'],
          items: items.filter(
            (item) => !['Acne Facial', 'Glow Facial'].includes(itemName(item))
          )
        }
      ];
    }

    if (categoryNameUpper === 'PICO LASER & CAUTER') {
      return [
        {
          slug: 'pico-laser',
          name: 'Pico Laser',
          description: CATEGORY_DESCRIPTIONS['pico-laser'],
          items: items.filter((item) => itemName(item).toLowerCase().startsWith('pico '))
        },
        {
          slug: 'cauter',
          name: 'Cauter',
          description: CATEGORY_DESCRIPTIONS.cauter,
          items: items.filter((item) => itemName(item).toLowerCase() === 'cauter')
        }
      ];
    }

    if (categoryNameUpper === 'TREATMENT HAND SPA & NAIL' || categoryNameUpper === 'NAIL & SPA') {
      return [
        {
          slug: 'hand-spa',
          name: 'Hand Spa',
          description: CATEGORY_DESCRIPTIONS['hand-spa'],
          items: items.filter((item) => {
            const name = itemName(item).toLowerCase();
            return name === 'hand spa' || name === 'foot spa';
          })
        },
        {
          slug: 'nail-treatment',
          name: 'Nail Treatment',
          description: CATEGORY_DESCRIPTIONS['nail-treatment'],
          items: items.filter((item) => {
            const name = itemName(item).toLowerCase();
            return name !== 'hand spa' && name !== 'foot spa';
          })
        }
      ];
    }

    if (categoryNameUpper === 'INJECTION, INFUSION & ADD ON') {
      return [
        {
          slug: 'injection',
          name: 'Injection',
          description: CATEGORY_DESCRIPTIONS.injection,
          items: items.filter((item) => {
            const name = itemName(item).toLowerCase();
            return name.includes('injection') || name.includes('meso ');
          })
        },
        {
          slug: 'infusion',
          name: 'Infusion',
          description: CATEGORY_DESCRIPTIONS.infusion,
          items: items.filter((item) => {
            const name = itemName(item).toLowerCase();
            return name.includes('vitamin') || name.includes('purely vitamin c');
          })
        },
        {
          slug: 'add-on',
          name: 'Add On',
          description: CATEGORY_DESCRIPTIONS['add-on'],
          items: items.filter((item) => {
            const name = itemName(item).toLowerCase();
            return !name.includes('injection') && !name.includes('meso ') && !name.includes('vitamin') && !name.includes('purely vitamin c');
          })
        }
      ];
    }

    if (categoryNameUpper === 'ANTI DANDRUFF & HAIR TREATMENTS') {
      return [
        {
          slug: 'anti-dandruff',
          name: 'Anti Dandruff',
          description: CATEGORY_DESCRIPTIONS['anti-dandruff'],
          items: items.filter((item) => itemName(item).toLowerCase().includes('anti dandruff'))
        },
        {
          slug: 'collagen-nano-spray',
          name: 'Collagen Nano Spray',
          description: CATEGORY_DESCRIPTIONS['collagen-nano-spray'],
          items: items.filter((item) => itemName(item).toLowerCase().includes('collagen nano spray'))
        },
        {
          slug: 'anti-hair-fall',
          name: 'Anti Hair Fall',
          description: CATEGORY_DESCRIPTIONS['anti-hair-fall'],
          items: items.filter((item) => itemName(item).toLowerCase().includes('anti hair fall'))
        }
      ];
    }

    const categoryMap: Record<string, { slug: string; name: string }> = {
      'CHEMICAL PEELING': { slug: 'chemical-peeling', name: 'Chemical Peeling' },
      'IPL (INTENSE PULSED LIGHT)': { slug: 'ipl', name: 'IPL (Intense Pulsed Light)' },
      'DERMAPEN EPN': { slug: 'dermapen-epn', name: 'Dermapen EPN' },
      'HIFU ULTRAFORMER MPT': { slug: 'hifu-ultraformer-mpt', name: 'HIFU Ultraformer MPT' },
      BOTOX: { slug: 'botox', name: 'Botox' },
      'SKIN BOOSTER': { slug: 'skin-booster', name: 'Skin Booster' },
      INJECTION: { slug: 'injection', name: 'Injection' },
      INFUSION: { slug: 'infusion', name: 'Infusion' },
      'ADD ON': { slug: 'add-on', name: 'Add On' },
      BODY: { slug: 'body-treatment', name: 'Body Treatment' },
      'BODY SPA & MASSAGE': { slug: 'body-treatment', name: 'Body Treatment' },
      HAIR: { slug: 'hair-treatment', name: 'Hair Treatment' },
      'HAIR CARE': { slug: 'hair-treatment', name: 'Hair Treatment' },
      'ANTI DANDRUFF': { slug: 'anti-dandruff', name: 'Anti Dandruff' },
      'COLLAGEN NANO SPRAY': { slug: 'collagen-nano-spray', name: 'Collagen Nano Spray' },
      'ANTI HAIR FALL': { slug: 'anti-hair-fall', name: 'Anti Hair Fall' },
      'EYELASH EXTENSION': { slug: 'eyelash-extension', name: 'Eyelash Extension' },
      'EYELASH EXTENSIONS': { slug: 'eyelash-extension', name: 'Eyelash Extension' },
      'MENICURE PEDICURE': { slug: 'menicure-pedicure', name: 'Menicure Pedicure' },
      'MENICURE & PEDICURE': { slug: 'menicure-pedicure', name: 'Menicure Pedicure' },
      'PAKET SLIMMING TREATMENT': { slug: 'slimming-treatment', name: 'Paket Slimming Treatment' }
    };

    const mapped = categoryMap[categoryNameUpper] ?? {
      slug: slugify(categoryNameUpper),
      name: categoryName(category)
    };

    return [
      {
        slug: mapped.slug,
        name: mapped.name,
        description: CATEGORY_DESCRIPTIONS[mapped.slug] ?? `Pilihan treatment ${mapped.name} dari DRW Primé.`,
        items
      }
    ];
  });
}

const clinic = SOURCE.informasi_klinik ?? {
  nama: SOURCE.clinic_info?.name ?? '',
  alamat: SOURCE.clinic_info?.address ?? '',
  kontak: SOURCE.clinic_info?.contact ?? ''
};

export const clinicInfo = {
  name: cleanText(clinic.nama),
  address: cleanText(clinic.alamat),
  contact: cleanText(clinic.kontak)
};

export const catalogCategories: CatalogCategory[] = buildCategorySeeds(SOURCE.menu)
  .filter((category) => category.items.length > 0)
  .map((category) => ({
    id: category.slug,
    slug: category.slug,
    name: category.name,
    description: category.description,
    treatments: category.items.map((item) => {
      const name = itemName(item);

      return {
        id: slugify(name),
        slug: slugify(name),
        name,
        description: itemDescription(item),
        price: parsePrice(itemPrice(item)),
        duration: null,
        benefits: []
      };
    })
  }));

export function getCatalogTreatmentBySlug(slug: string) {
  for (const category of catalogCategories) {
    const treatment = category.treatments.find((item) => item.slug === slug);
    if (treatment) {
      return { category, treatment };
    }
  }

  return null;
}