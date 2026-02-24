import React from 'react';
import type { Media } from '../types';

interface MediaRendererProps {
    media: Media;
    className?: string;
    alt?: string;
    showControls?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({
    media,
    className = "",
    alt = "",
    showControls = false,
    autoPlay = true,
    loop = true,
    muted = true
}) => {
    if (media.type === 'video') {
        return (
            <video
                src={media.url}
                className={className}
                controls={showControls}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                playsInline
            />
        );
    }

    return (
        <img
            src={media.url}
            alt={alt}
            className={className}
        />
    );
};

export default MediaRenderer;
