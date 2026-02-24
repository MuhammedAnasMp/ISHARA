import { useState, useEffect } from 'react';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<string[]>(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (id: string) => {
        setWishlist(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const isLiked = (id: string) => wishlist.includes(id);

    return { wishlist, toggleWishlist, isLiked };
};
