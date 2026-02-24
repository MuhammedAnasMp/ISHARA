import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, Media } from '../types';
import MediaRenderer from './MediaRenderer';
// import siteConfigData from '../data/siteConfig.json';
import type { SiteConfig } from '../types';
import { useSiteConfig } from '../data/useSiteConfig';

// const siteConfig = siteConfigData as unknown as SiteConfig;

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    const [currentMediaIdx, setCurrentMediaIdx] = useState(0);


      const { siteConfig, loading } = useSiteConfig(); // hook from context
    
      if (loading) return <div></div>;
      if (!siteConfig) return <div>No site data found</div>;
    





    if (!product) return null;

    const media: Media[] = product.media && product.media.length > 0
        ? product.media
        : [{ url: product.image, type: 'image' }];

    const nextMedia = () => setCurrentMediaIdx((prev) => (prev + 1) % media.length);
    const prevMedia = () => setCurrentMediaIdx((prev) => (prev - 1 + media.length) % media.length);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-luxury-charcoal/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm p-2 rounded-full text-luxury-charcoal hover:text-gold-600 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Media Gallery Section */}
                    <div className="w-full md:w-3/5 h-[400px] md:h-auto bg-gray-100 relative group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentMediaIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full h-full"
                            >
                                <MediaRenderer
                                    media={media[currentMediaIdx]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    showControls={media[currentMediaIdx].type === 'video'}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={prevMedia}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextMedia}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronRight size={24} />
                                </button>

                                {/* Thumbnails Indicator */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {media.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentMediaIdx(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentMediaIdx ? 'w-8 bg-gold-500' : 'w-2 bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-2/5 p-8 md:p-10 overflow-y-auto flex flex-col">
                        <span className="text-gold-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block font-sans">
                            {product.category}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-charcoal mb-4">
                            {product.name}
                        </h2>
                        <p className="text-2xl font-bold text-gold-700 mb-6 font-sans">{product.price}</p>

                        <div className="mb-8 flex-grow">
                            <p className="text-gray-600 leading-relaxed mb-6 font-sans text-sm">
                                {product.description}
                            </p>

                            {product.details && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-luxury-charcoal uppercase tracking-widest mb-4 font-sans">Specifications</p>
                                    {product.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-500 font-sans">
                                            <CheckCircle2 size={16} className="text-gold-500" />
                                            {detail}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4">
                            <a
                                href={product.orderURL}
                                target="_blank"
                                rel="noreferrer"
                                className="gold-gradient text-white py-4 px-8 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform luxury-shadow font-sans"
                            >
                                {/* <Instagram size={20} /> */}
                               {product.orderButtonName}
                            </a>
                            <p className="text-center text-[10px] text-gray-400 font-sans uppercase tracking-widest">
                                Contact us for customization
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProductModal;
