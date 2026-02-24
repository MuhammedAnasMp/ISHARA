import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Media } from '../types';
import MediaRenderer from './MediaRenderer';
import { Heart, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
    isLiked: boolean;
    onToggleWishlist: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isLiked, onToggleWishlist }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get the second media item if available for hover effect
    const hoverMedia = product.media && product.media.length > 1
        ? product.media[1]
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -10 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group bg-white rounded-2xl overflow-hidden luxury-shadow border border-gold-100/50 cursor-pointer relative"
        >
            <div className="relative h-80 overflow-hidden" onClick={() => onClick(product)}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isHovered && hoverMedia ? 'hover' : 'default'}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: isHovered ? 1.1 : 1 }}
                        exit={{ opacity: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        <MediaRenderer
                            media={isHovered && hoverMedia ? hoverMedia : { url: product.image, type: 'image' }}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700"
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-luxury-charcoal p-3 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300">
                        <ArrowUpRight size={20} />
                    </span>
                </div>

                <div className="absolute bottom-4 left-4">
                    <span className="bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {product.category}
                    </span>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                }}
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10 ${isLiked ? 'bg-red-50 text-red-500 scale-110' : 'bg-white/80 text-gray-400 hover:text-red-500'
                    }`}
            >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>

            <div className="p-6" onClick={() => onClick(product)}>
                <h3 className="text-xl font-serif font-bold text-luxury-charcoal mb-2 group-hover:text-gold-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed font-sans">
                    {product.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-luxury-charcoal font-sans">{product.price}</span>
                    <span className="text-gold-600 text-sm font-semibold flex items-center gap-1 font-sans">
                        Details <ArrowUpRight size={14} />
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
