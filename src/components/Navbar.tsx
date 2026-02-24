import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import siteConfig from '../data/siteConfig.json';
import { useSiteConfig } from '../data/useSiteConfig';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const { siteConfig, loading } = useSiteConfig(); // hook from context

    if (loading) return <div></div>;
    if (!siteConfig) return <div>No site data found</div>;
    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Collection', href: '#collection' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass luxury-shadow py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-xl sm:text-2xl font-serif font-bold gold-text-gradient tracking-widest">{siteConfig.brandName}</span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled ? 'text-luxury-charcoal hover:text-gold-600' : 'text-white hover:text-gold-400'}`}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href={siteConfig.contact.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="gold-gradient text-white px-6 py-2 rounded-full text-sm font-semibold luxury-shadow hover:scale-105 transition-transform"
                            >
                                Follow Us
                            </a>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${scrolled ? 'text-luxury-charcoal hover:text-gold-600' : 'text-white hover:text-gold-400'}`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-luxury-charcoal block px-3 py-4 rounded-md text-base font-medium border-b border-gray-100 last:border-0"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
