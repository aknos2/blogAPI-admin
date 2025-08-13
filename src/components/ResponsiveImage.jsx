import { cloudinaryUrl } from '../utils/cloudinary';

function ResponsiveImage({ url, alt, widths = [400, 800, 1200], sizes }) {
  if (!url) return null;

  const srcSet = widths
    .map((w) => `${cloudinaryUrl(url, w)} ${w}w`)
    .join(', ');

  const defaultSizes =
    sizes ||
    `
    (max-width: 480px) ${widths[0]}px,
    (max-width: 1024px) ${widths[1]}px,
    (min-width: 1290px) ${widths[2]}px,
    ${widths[widths.length - 1]}px
  `;

  return (
    <img
      src={cloudinaryUrl(url, widths[1])} // mid-size fallback
      srcSet={srcSet}
      sizes={defaultSizes}
      alt={alt || ''}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default ResponsiveImage;