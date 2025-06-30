import React from 'react';
import AboutHero from 'components/about/AboutHero';
import AboutStory from 'components/about/AboutStory';
import AboutValues from 'components/about/AboutValues';
import AboutMission from 'components/about/AboutMission';
import AboutTeam from 'components/about/AboutTeam';
import StatsSection from 'components/about/StatsSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <AboutHero />
      <AboutStory />
      <StatsSection />
      <AboutValues />
      <AboutMission />
      <AboutTeam />
    </div>
  );
}
