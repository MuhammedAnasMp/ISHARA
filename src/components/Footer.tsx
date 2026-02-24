import React from 'react';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { useSiteConfig } from '../data/useSiteConfig';
// import siteConfig from '../data/siteConfig.json';

const Footer: React.FC = () => {

    const { siteConfig, loading } = useSiteConfig(); // hook from context

    if (loading) return <div></div>;
    if (!siteConfig) return <div>No site data found</div>;

    return (
        <footer id="contact" className="bg-luxury-charcoal text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-3xl font-serif font-bold gold-text-gradient tracking-[0.2em] mb-6 block uppercase">{siteConfig.brandName}</span>
                        <p className="text-gray-400 max-w-sm leading-relaxed mb-8 italic font-sans">
                            "Crafting timeless elegance for the modern woman who cherishes tradition."
                        </p>
                        <div className="flex gap-4">
                            <a href={siteConfig.contact.instagram} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-gold-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-gold-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href={`mailto:${siteConfig.contact.email}`} className="p-3 bg-white/5 rounded-full hover:bg-gold-500 transition-colors">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 font-serif">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400 font-sans text-sm">
                            <li><a href="#" className="hover:text-gold-500 transition-colors">Home</a></li>
                            <li><a href="#collection" className="hover:text-gold-500 transition-colors">Collection</a></li>
                            <li><a href="#about" className="hover:text-gold-500 transition-colors">Our Story</a></li>
                            <li><a href="#contact" className="hover:text-gold-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 font-serif">Visit Us</h4>
                        <ul className="space-y-4 text-gray-400 font-sans text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-gold-500 flex-shrink-0" />
                                <span>{siteConfig.contact.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-gold-500" />
                                <span>{siteConfig.contact.phone}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-10 text-center text-gray-500 text-sm font-sans">
                    <p>© {new Date().getFullYear()} {siteConfig.brandName} Jewellers. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
