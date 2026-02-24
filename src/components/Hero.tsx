import React from 'react';
import { motion } from 'framer-motion';
import MediaRenderer from './MediaRenderer';
// import siteConfigData from '../data/siteConfig.json';

import { useSiteConfig } from '../data/useSiteConfig';

// const siteConfig = siteConfigData as unknown as SiteConfig;

const Hero: React.FC = () => {

    const { siteConfig, loading } = useSiteConfig(); // hook from context

    if (loading) return <div></div>;
    if (!siteConfig) return <div>No site data found</div>;


    return (
        <section className="relative h-screen flex items-center overflow-hidden bg-luxury-charcoal">
            {/* Background Image/Video with Overlay */}
            <div className="absolute inset-0 z-0">
                <MediaRenderer
                    media={siteConfig.hero.backgroundImage}
                    className="w-full h-full object-cover opacity-40 scale-105"
                    alt="Luxury Jewelry Background"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-charcoal via-transparent to-transparent opacity-80" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-gold-400 font-serif italic text-xl mb-4 block tracking-wider"
                    >
                        {siteConfig.hero.tagline}
                    </motion.span>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight">
                        {siteConfig.hero.title} <br />
                        <span className="gold-text-gradient">{siteConfig.hero.accentTitle}</span>
                    </h1>
                    <p className="text-base md:text-xl mb-10 max-w-lg leading-relaxed font-sans opacity-90">
                        {siteConfig.hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a
                            href="#collection"
                            className="gold-gradient text-white px-8 py-4 sm:px-10 rounded-full text-base sm:text-lg font-semibold text-center luxury-shadow hover:scale-105 transition-transform"
                        >
                            Explore Collection
                        </a>
                        <a
                            href="#about"
                            className="border border-white/30 backdrop-blur-sm text-white px-8 py-4 sm:px-10 rounded-full text-base sm:text-lg font-semibold text-center hover:bg-white/10 transition-colors"
                        >
                            Our Story
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Element */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute right-[-10%] bottom-[-5%] w-[600px] h-[600px] border border-gold-500/10 rounded-full blur-3xl"
            />
        </section>
    );
};

export default Hero;
