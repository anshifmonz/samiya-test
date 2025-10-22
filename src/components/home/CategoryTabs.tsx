'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const categoryImages = [
  { src: '/assets/images/home/tabs/saree.jpg', name: 'saree', alt: 'Saree' },
  { src: '/assets/images/home/tabs/kurtis.jpg', name: 'kurti', alt: 'Kurtis' },
  { src: '/assets/images/home/tabs/westerns.jpg', name: 'western', alt: 'Westerns' },
  { src: '/assets/images/home/tabs/salwars.jpg', name: 'salwar', alt: 'Salwars' },
  { src: '/assets/images/home/tabs/kids.jpg', name: 'kid', alt: 'Kids' },
  { src: '/assets/images/home/tabs/duppattas.jpg', name: 'duppatta', alt: 'Duppattas' },
  { src: '/assets/images/home/tabs/blouses.jpg', name: 'blouse', alt: 'Blouses' }
];

const CategoryTabs: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (name: string) => router.push(`/search?q=${name}`);

  return (
    <div className="py-6 px-2 -ml-2 sm:ml-0 sm:px-4 lg:px-6 mt-[70px] -mb-16">
      <div className="max-w-7xl mx-auto">
        <div
          ref={containerRef}
          className="category-tabs-scroll flex items-center gap-x-2 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 overflow-x-auto px-2 py-2 snap-x snap-mandatory scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categoryImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 cursor-pointer group transition-transform duration-300 hover:scale-100 snap-start"
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
      <style jsx>{`
        .category-tabs-scroll::-webkit-scrollbar {
          display: none;
          height: 0;
        }
        .category-tabs-scroll {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default CategoryTabs;
