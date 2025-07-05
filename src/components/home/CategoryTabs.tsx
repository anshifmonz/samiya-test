"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const categoryImages = [
  { src: '/assets/images/home/tabs/saree.jpg', name: 'saree', alt: 'Saree' },
  { src: '/assets/images/home/tabs/kurtis.jpg', name: 'kurtis', alt: 'Kurtis' },
  { src: '/assets/images/home/tabs/westerns.jpg', name: 'westerns', alt: 'Westerns' },
  { src: '/assets/images/home/tabs/salwars.jpg', name: 'salwars', alt: 'Salwars' },
  { src: '/assets/images/home/tabs/kids.jpg', name: 'kids', alt: 'Kids' },
  { src: '/assets/images/home/tabs/duppattas.jpg', name: 'duppattas', alt: 'Duppattas' },
  { src: '/assets/images/home/tabs/blouses.jpg', name: 'blouses', alt: 'Blouses' },
];

const CategoryTabs: React.FC = () => {
  const router = useRouter();

  const handleImageClick = (name: string) => {
    router.push(`/search?q=${name}`);
  };

  return (
    <div className="py-6 px-2 -ml-2 sm:ml-0 sm:px-4 lg:px-6 mt-[70px] -mb-16">
      <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start custom-910:justify-center space-x-2 sm:space-x-6 md:space-x-8 lg:space-x-10 overflow-x-auto scrollbar-hide">
          {categoryImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 cursor-pointer group transition-transform duration-300 hover:scale-100"
              onClick={() => handleImageClick(image.name)}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden hover:border-luxury-gold/60 transition-all duration-300">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
                  priority
                  unoptimized={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
