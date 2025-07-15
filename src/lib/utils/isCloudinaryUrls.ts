const isCloudinaryUrl = (url: unknown): boolean => {
  return typeof url === 'string' && url.includes('res.cloudinary.com');
};

export default isCloudinaryUrl;
