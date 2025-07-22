const isValidPublicId = (id: unknown): boolean => {
    return typeof id === 'string' && id.trim() !== '' && !id.startsWith('url-');
};

export default isValidPublicId;
