import Link from 'next/link';
import { catalogCategories } from '@/lib/treatment-catalog';

export default function Treatments() {
  const featuredCategories = [
    'hifu-ultraformer-mpt',
    'facial-prime',
    'skin-booster',
    'body-treatment'
  ]
    .map((slug) => catalogCategories.find((category) => category.slug === slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <section id="treatments" className="py-20 px-5 bg-dark/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          TREATMENT PREMIUM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <div 
              key={category.slug} 
              className="bg-black/50 border border-primary/20 p-6 rounded-lg hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-primary mb-3 font-playfair">
                {category.name.toUpperCase()}
              </h3>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                {category.description}
              </p>
              <Link 
                href={`/treatments?category=${category.slug}`} 
                className="inline-block text-sm text-primary hover:text-primary-light transition-colors duration-300 font-semibold"
              >
                Discover More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
