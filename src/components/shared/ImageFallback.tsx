const ImageFallback = () => {
  return (
    <div className="w-full h-80 bg-luxury-gray/10 flex items-center justify-center group-hover:bg-luxury-gray/20 transition-colors duration-300">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-luxury-gray/30 rounded-full flex items-center justify-center group-hover:bg-luxury-gray/40 transition-colors duration-300">
          <svg className="w-8 h-8 text-luxury-gray/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="luxury-body text-luxury-gray/60 text-sm font-medium">
          Image not available
        </p>
      </div>
    </div>
  );
};

export default ImageFallback;
