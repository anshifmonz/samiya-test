import type { Metadata } from 'next';
import AboutHero from 'components/about/AboutHero';
import AboutStory from 'components/about/AboutStory';
import OurStoreSection from 'components/about/OurStoreSection';

export const metadata: Metadata = {
  title: 'About Samiya Online - Our Story & Heritage',
  description:
    'Learn about the story behind Samiya, our commitment to quality craftsmanship, and our passion for creating timeless wedding and party attire.',
  openGraph: {
    title: 'About Samiya Online - Our Story & Heritage',
    description:
      'Learn about the story behind Samiya, our commitment to quality craftsmanship, and our passion for creating timeless wedding and party attire.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'About Samiya Online - Our Story & Heritage',
    description:
      'Learn about the story behind Samiya, our commitment to quality craftsmanship, and our passion for creating timeless wedding and party attire.',
    images: ['/opengraph-image.png']
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-white">
      <AboutHero />
      <AboutStory />
      <OurStoreSection />
    </div>
  );
}
