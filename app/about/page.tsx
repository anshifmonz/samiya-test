import AboutHero from 'components/about/AboutHero';
import AboutStory from 'components/about/AboutStory';
import OurStoreSection from 'components/about/OurStoreSection';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'About Us - Our Story & Heritage',
  description:
    'Learn about the story behind Samiya, our commitment to quality craftsmanship, and our passion for creating timeless wedding and party attire.',
  url: '/about'
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-white">
      <AboutHero />
      <AboutStory />
      <OurStoreSection />
    </div>
  );
}
