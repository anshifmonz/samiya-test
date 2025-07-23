const isCloudinaryUrl = (url: unknown): boolean => {
  if (typeof url !== 'string' || !url.trim()) return false;

  const trimmed = url.trim();

  try {
    const { hostname } = new URL(trimmed);
    return hostname.includes('res.cloudinary.com') || hostname.includes('cloudinary.com');
  } catch {
    return trimmed.includes('res.cloudinary.com') || trimmed.includes('cloudinary.com');
  }
};

export default isCloudinaryUrl;
