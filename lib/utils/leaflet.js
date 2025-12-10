import L from 'leaflet';

/**
 * Fixes the default Leaflet icon paths in Next.js/Webpack environments.
 * Leaflet's default icon URLs often break when bundled, so this ensures they point to reliable CDNs or local assets.
 */
export const fixLeafletIcons = () => {
    // Only run on client side and if L is defined
    if (typeof window === 'undefined' || !L) return;

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};
