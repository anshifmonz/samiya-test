const isValidPublicId = (id: unknown): boolean => {
  if (typeof id !== 'string') return false;

  const trimmed = id.trim();

  return (
    trimmed !== '' &&
    !trimmed.startsWith('url-') &&
    !trimmed.includes('://') &&
    !trimmed.includes('res.cloudinary.com') &&
    !/\s/.test(trimmed) &&
    trimmed.length <= 200
  );
};

export default isValidPublicId;
