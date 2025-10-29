import AboutHero from 'components/about/AboutHero';
import AboutStory from 'components/about/AboutStory';
import OurStoreSection from 'components/about/OurStoreSection';
// import AboutMission from 'components/about/AboutMission';
// import AboutTeam from 'components/about/AboutTeam';
// import StatsSection from 'components/about/StatsSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-white">
      <AboutHero />
      <AboutStory />
      <OurStoreSection />
    </div>
  );
}
