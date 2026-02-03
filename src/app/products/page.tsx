'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  image: string;
  category: string;
}

const products: Product[] = [
  // Acne Specialized Series
  {
    id: 'acne-cleanser',
    name: 'Specialized Acne Control Cleanser',
    description: 'Pembersih wajah untuk membersihkan kotoran, debu, dan sisa makeup pada wajah. Diformulasikan khusus untuk kulit berjerawat dan berminyak sehingga kulit tampak bersih, bebas jerawat dan minyak berlebih.',
    price: 95000,
    size: '100 ml',
    image: '/products/individual/acne-cleanser.webp',
    category: 'Acne Specialized Series'
  },
  {
    id: 'acne-moisturizer',
    name: 'Specialized Acne Soothing Moisturizer',
    description: 'Diformulasikan khusus untuk wajah berjerawat membantu mengurangi jerawat dan peradangan pada kulit wajah dan membantu melembabkan kulit wajah.',
    price: 125000,
    size: '30 gr',
    image: '/products/individual/acne-moisturizer.webp',
    category: 'Acne Specialized Series'
  },
  {
    id: 'acne-uv-protect',
    name: 'Specialized Acne Shield UV Protect',
    description: 'Membantu melindungi kulit dari sinar matahari langsung yang dapat menyebabkan kerusakan kulit dan membantu merawat kulit wajah yang berjerawat serta membantu membuat kulit lebih cerah dan lembab.',
    price: 120000,
    size: '30 gr',
    image: '/products/individual/acne-uv-protect.webp',
    category: 'Acne Specialized Series'
  },
  {
    id: 'acne-glow-cream',
    name: 'Specialized Acne Glow Bright Cream',
    description: 'Cream yang dapat berfungsi untuk merawat kulit berjerawat, menjaga kelembapan kulit, dan membantu menyamarkan noda noda hitam dikulit wajah.',
    price: 120000,
    size: '20 gr',
    image: '/products/individual/acne-glow-cream.webp',
    category: 'Acne Specialized Series'
  },
  // Lumièra Series
  {
    id: 'lumiera-cleanser',
    name: 'Lumièra Gentle Cleansing Gel',
    description: 'Pembersih wajah yang membantu membersihkan kotora, debu dan sisa makeup pada wajah. Diformulasikan khusus dengan kandungan niacinamide membantu mencerahkan dan melembabkan. sehingga kulit tampak lebih cerah,lembab dan lembut.',
    price: 95000,
    size: '100 ml',
    image: '/products/individual/lumiera-cleanser.webp',
    category: 'Lumièra Series'
  },
  {
    id: 'lumiera-moisturizer',
    name: 'Lumièra Bright Moist Crème',
    description: 'Moisturizer dengan kandungan 7x Ceramide dan Niacinamide membantu melembabkan, menghidrasi, dan mencerahkan kulit wajah. Sehingga kulit tampak lebih lembut, kenyal dan cerah.',
    price: 125000,
    size: '30 ml',
    image: '/products/individual/lumiera-moisturizer.webp',
    category: 'Lumièra Series'
  },
  {
    id: 'lumiera-uv-defense',
    name: 'Lumièra UV Defense Creme',
    description: 'Membantu melindungi kulit dari paparan sinar matahari langsung, membantu mencerahkan dan melembabkan kulit wajah. Sehingga tampak lebih flawless.',
    price: 120000,
    size: '30 gr',
    image: '/products/individual/lumiera-uv-defense.webp',
    category: 'Lumièra Series'
  },
  {
    id: 'lumiera-glow-serum',
    name: 'Lumièra Glow Serum',
    description: 'Serum dengan kandungan Vitamin C membantu mencerahkan, melembabkan kulit wajah. Sehingga tampak lebih lembut dan cerah.',
    price: 120000,
    size: '30 ml',
    image: '/products/individual/lumiera-glow-serum.webp',
    category: 'Lumièra Series'
  },
  // Anti Aging Series
  {
    id: 'antiaging-facial-wash',
    name: 'Gentle Brightening Facial Wash',
    description: 'Gentle Brightening Facial Wash merupakan Low pH Cleanser yang mengandung Panthenol, 10X Amino Acid, Jeju Centella dan Niacinamide yang bermanfaat untuk membantu memaksimalkan proses pembersihan kulit tanpa meninggalkan efek kulit kering serta menjaga kelembapan dan membantu mencerahkan kulit.',
    price: 85000,
    size: '100 ml',
    image: '/products/individual/antiaging-facial-wash.webp',
    category: 'Anti Aging Series'
  },
  {
    id: 'antiaging-moisturizer',
    name: 'Brightening Moisturizer With Tranexamic Acid & Jewelry Complex',
    description: 'Brightening Moisturizer ini merupakan moisturizer water based dengan tekstur gel ringan dan mudah menyerap. mengandung Niacinamide, Tranexamic Acid, a-arbutin, Hexyl Resorcinol, Marine Collagen, D-Panthenol, 10x Amino Acid. Perpaduan kandungan tersebut efektif untuk menyamarkan noda hitam, membantu mencerahkan dan meratakan warna kulit, menyamarkan kerutan serta menjaga kelembaban kulit.',
    price: 120000,
    size: '30 gr',
    image: '/products/individual/antiaging-moisturizer.webp',
    category: 'Anti Aging Series'
  },
  {
    id: 'antiaging-dna-serum',
    name: 'RevivAge DNA Serum',
    description: 'DNA Serum yang mengandung 5% Biotox LC (Botolinum Toxin Topical) yang bermanfaat menyamarkan kerutan pada wajah dan dipadukan dengan Niacinamide, Salmon DNA, Marine Collagen, 7 macam Hyaluronic Acid untuk mendukung regenerasi kulit, menjaga kelembapan serta mencerahkan kulit wajah.',
    price: 200000,
    size: '100 ml',
    image: '/products/individual/antiaging-dna-serum.webp',
    category: 'Anti Aging Series'
  },
];

const categories = [
  'All Products',
  'Acne Specialized Series',
  'Lumièra Series',
  'Anti Aging Series'
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory === 'All Products'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-dark pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-5 py-12 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-primary mb-4">
            Product Gallery
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover our premium skincare collection designed for your beauty journey
          </p>
        </section>

        {/* Category Filter */}
        <section className="px-5 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-primary-light text-dark'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer group"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Product Image */}
                  <div className="relative h-80 bg-white/5 flex items-center justify-center p-8">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={180}
                      height={253}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <p className="text-primary text-sm font-semibold mb-2">
                      {product.category}
                    </p>
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary font-bold text-xl">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-white/50 text-xs">{product.size}</p>
                      </div>
                      <button className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-light transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Package Banners */}
        <section className="px-5 mt-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-primary mb-8 text-center">
              Special Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Acne Package */}
              <div className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src="/products/003.webp"
                  alt="Acne Specialized Series Package"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-2xl mb-2">
                    Acne Specialized Series
                  </h3>
                  <p className="text-primary font-bold text-3xl">
                    Rp 450.000
                  </p>
                </div>
              </div>

              {/* Lumièra Package */}
              <div className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src="/products/006.webp"
                  alt="Lumièra Series Package"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-2xl mb-2">
                    Lumièra Series
                  </h3>
                  <p className="text-primary font-bold text-3xl">
                    Rp 450.000
                  </p>
                </div>
              </div>

              {/* Anti Aging Package */}
              <div className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src="/products/009.webp"
                  alt="Anti Aging Series Package"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-2xl mb-2">
                    Anti Aging Series
                  </h3>
                  <p className="text-primary font-bold text-3xl">
                    Rp 700.000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-gradient-to-br from-dark to-dark-lighter rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="flex items-center justify-center bg-white/5 rounded-xl p-8">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={300}
                  height={420}
                  className="object-contain"
                />
              </div>

              {/* Product Details */}
              <div>
                <p className="text-primary text-sm font-semibold mb-2">
                  {selectedProduct.category}
                </p>
                <h2 className="font-playfair text-3xl font-bold text-white mb-4">
                  {selectedProduct.name}
                </h2>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="mb-6">
                  <p className="text-white/50 text-sm mb-1">Size</p>
                  <p className="text-white font-semibold">{selectedProduct.size}</p>
                </div>
                <div className="mb-8">
                  <p className="text-white/50 text-sm mb-1">Price</p>
                  <p className="text-primary font-bold text-4xl">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-primary to-primary-light text-dark px-6 py-3 rounded-lg font-semibold hover:shadow-xl hover:shadow-primary/40 transition-all">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
