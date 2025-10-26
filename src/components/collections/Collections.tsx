'use client';

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewCollection } from 'types/collection';
import { useInputDevice } from 'src/hooks/useInputDevice';

const Collections: FC<{ collections: NewCollection[] }> = ({ collections }) => {
  const isTouch = useInputDevice();

  return (
    <div className="py-32 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-4 tracking-[0.3em]">
              Trending Now
            </span>
            <h2 className="luxury-heading text-5xl sm:text-6xl text-luxury-black mb-4">
              Featured Collections
            </h2>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
              Explore our handpicked selections that define today&apos;s fashion landscape
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Link href={`/collections/${collection.id}`} key={collection.id}>
              <div
                className={`group cursor-pointer luxury-card rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 animate-fade-in-up`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <Image
                    src={collection.image_url || '/placeholder.svg'}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    width={400}
                    height={500}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-luxury-black/20 to-transparent group-hover:opacity-90 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8">
                    <div
                      className={`glass-dark rounded-xl max-h-[60%] p-4 backdrop-blur-sm transition-all duration-500 ease-out flex items-center ${
                        isTouch
                          ? 'pb-6 items-start'
                          : 'group-hover:pb-6 group-hover:items-start group'
                      }`}
                    >
                      <div
                        className={`transform transition-transform duration-500 w-full ${
                          isTouch ? 'translate-y-0' : 'group-hover:translate-y-0'
                        }`}
                      >
                        <h3
                          className={`luxury-heading text-3xl text-white transition-all duration-500 text-left ${
                            isTouch
                              ? 'mb-1 sm:mb-4 text-luxury-gold'
                              : 'group-hover:mb-4 group-hover:text-luxury-gold'
                          }`}
                        >
                          {collection.title}
                        </h3>

                        <div
                          className={`overflow-hidden transition-all duration-500 ease-out ${
                            isTouch ? 'max-h-32' : 'max-h-0 group-hover:max-h-32'
                          }`}
                        >
                          <p className="luxury-body text-white/90 text-lg leading-relaxed pt-2 line-clamp-3">
                            {collection.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-luxury-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                    <div className="shimmer absolute inset-0"></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
