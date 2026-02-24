import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import MediaRenderer from './components/MediaRenderer';
// import siteConfigData from './data/siteConfig.json';
import type { Product, SiteConfig } from './types';
import { Sparkles, Heart } from 'lucide-react';
import { useWishlist } from './hooks/useWishlist';
import { useSiteConfig } from './data/useSiteConfig';

// const siteConfig = siteConfigData as unknown as SiteConfig;

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toggleWishlist, isLiked, wishlist } = useWishlist();

  const { siteConfig, loading } = useSiteConfig(); // hook from context

  if (loading) return <div></div>;
  if (!siteConfig) return <div>No site data found</div>;




  const categories = ['All', ...new Set(siteConfig.products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'All'
    ? siteConfig.products
    : siteConfig.products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navbar />

      <main>
        <Hero />

        {/* Collection Section */}
        <section id="collection" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="text-gold-500" size={24} />
              <span className="text-gold-600 font-bold uppercase tracking-[0.3em] text-[10px] font-sans">Curated Collection</span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-6">Our Masterpieces</h2>
            <p className="text-gray-500 max-w-2xl mx-auto italic font-sans text-sm">
              Each piece is meticulously crafted to tell a unique story of heritage, love, and timeless beauty.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 font-sans ${selectedCategory === category
                  ? 'gold-gradient text-white luxury-shadow scale-105'
                  : 'bg-white text-gray-400 hover:text-gold-600 border border-gray-100 hover:border-gold-200'
                  }`}
              >
                {category}
              </button>
            ))}
            {wishlist.length > 0 && (
              <button
                onClick={() => setSelectedCategory('Wishlist')}
                className={`px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 font-sans flex items-center gap-2 ${selectedCategory === 'Wishlist'
                  ? 'bg-red-500 text-white luxury-shadow scale-105'
                  : 'bg-white text-red-400 hover:text-red-600 border border-red-50 hover:border-red-100'
                  }`}
              >
                <Heart size={14} fill={selectedCategory === 'Wishlist' ? "white" : "none"} />
                Wishlist ({wishlist.length})
              </button>
            )}
          </div>

          {/* Product Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode='popLayout'>
              {(selectedCategory === 'Wishlist'
                ? siteConfig.products.filter(p => wishlist.includes(p.id))
                : filteredProducts
              ).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={setSelectedProduct}
                  isLiked={isLiked(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold-200 rounded-3xl" />
              <MediaRenderer
                media={siteConfig.about.image}
                alt="Jewelry making"
                className="relative rounded-3xl w-full h-[300px] md:h-[500px] object-cover shadow-2xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-gold-600 font-bold uppercase tracking-widest text-xs mb-4 block font-sans">{siteConfig.about.subtitle}</span>
              <h2 className="text-4xl font-serif font-bold text-luxury-charcoal mb-8 leading-tight">
                {siteConfig.about.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8 font-sans text-sm">
                {siteConfig.about.content}
              </p>
              <div className="grid grid-cols-2 gap-8 font-sans">
                <div>
                  <h4 className="text-3xl font-bold text-gold-600 mb-2">100%</h4>
                  <p className="text-gray-500 text-xs italic tracking-widest uppercase">Authentic Gold</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-gold-600 mb-2">Handmade</h4>
                  <p className="text-gray-500 text-xs italic tracking-widest uppercase">With Precision</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default App;
