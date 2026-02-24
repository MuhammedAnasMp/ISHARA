export interface Media {
    url: string;
    type: 'image' | 'video' | 'gif';
}

export interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    image: string; // Keep as thumbnail
    category: string;
    details?: string[];
    media?: Media[];
    orderButtonName: string; // New: Custom label (e.g., "Buy on Instagram")
    orderURL: string;   
}

export interface SiteConfig {
    brandName: string;
    hero: {
        title: string;
        accentTitle: string;
        subtitle: string;
        tagline: string;
        backgroundImage: Media;
    };
    about: {
        title: string;
        subtitle: string;
        content: string;
        image: Media;
    };
    contact: {
        address: string;
        phone: string;
        email: string;
        instagram: string;
        instagramDm: string;
    };
    products: Product[];
}
