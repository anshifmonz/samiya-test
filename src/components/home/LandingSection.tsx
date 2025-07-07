"use client";

import Image from 'next/image';
import ScrollIndicator from './ScrollIndicator';

const LandingSection: React.FC = () => {

  return (
    <section id="hero" className="relative overflow-hidden -mt-6">
      <div id="hero-banner" className="relative mx-auto w-[clamp(166px,calc(100vw-34px),1366px)] h-[clamp(67px,calc((100vw-34px)*0.4),534px)]">
        <Image
          src="/assets/images/home/landing-hero.png"
          alt="Samiya Wedding Center"
          fill
          className="object-cover rounded-lg"
          priority
          unoptimized={true}
        />

        <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default LandingSection;
