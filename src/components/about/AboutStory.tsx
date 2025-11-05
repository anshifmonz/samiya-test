import React from 'react';
import Image from 'next/image';

const AboutStory: React.FC = () => {
  return (
    <div className="pb-22 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-left">
            <div className="space-y-6">
              <p className="luxury-body text-xl text-luxury-gray leading-relaxed">
                Founded in 2006, Samiya Online began as a small boutique with a simple vision: to
                make every special occasion truly extraordinary. What started as a passion project
                has grown into one of the region&apos;s most trusted names in luxury wedding attire.
              </p>
              <p className="luxury-body text-xl text-luxury-gray leading-relaxed">
                Our founder, inspired by the rich traditions of South Asian craftsmanship and the
                evolving needs of modern couples, created a space where heritage meets contemporary
                elegance. Every piece in our collection tells a story of meticulous attention to
                detail and unwavering commitment to quality.
              </p>
              <p className="luxury-body text-xl text-luxury-gray leading-relaxed">
                Today, Samiya continues to be a family-owned business that treats each customer like
                family, understanding that we&apos;re not just selling clothes – we&apos;re helping
                create memories that will last a lifetime.
              </p>
            </div>
          </div>
          <div className="animate-fade-in-right">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="assets/images/about/about-story.webp"
                alt="Samiya Online Heritage"
                className="w-full h-full object-cover"
                width={600}
                height={600}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutStory;
