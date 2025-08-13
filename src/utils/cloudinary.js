export function cloudinaryUrl(originalUrl, width) {
  if (!originalUrl) return '';
  return originalUrl.replace(
    '/upload/',
    `/upload/w_${width},c_fill,q_auto,f_auto/`
  );
}
