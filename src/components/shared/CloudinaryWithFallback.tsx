import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import ImageFallback from 'components/shared/ImageFallback';

export default function CloudinaryWithFallback({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority = false,
}) {
  const [fallbackStage, setFallbackStage] = useState<'cld' | 'img' | 'none'>('cld');

  useEffect(() => {
    setFallbackStage('cld');
  }, [src]);

  if (fallbackStage === 'none') {
    return <ImageFallback />;
  }

  if (fallbackStage === 'img') {
    return (
      <Image
        src={src}
        alt={alt}
        width={width * 2}
        height={height * 2}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setFallbackStage('none')}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFallbackStage('img')}
    />
  );
}
