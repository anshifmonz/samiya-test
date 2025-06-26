
import React from 'react';
import Navigation from '../components/shared/Navigation';
import AboutHero from '../components/about/AboutHero';
import AboutStory from '../components/about/AboutStory';
import AboutValues from '../components/about/AboutValues';
import AboutMission from '../components/about/AboutMission';
import AboutTeam from '../components/about/AboutTeam';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutMission />
      <AboutTeam />
    </div>
  );
};

export default About;
