"use client";

import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import Image from 'next/image';
import stores from '@/data/stores';

const OurStoreSection: React.FC = () => {
  const handleViewOnMap = (mapLink: string) => {
    window.open(mapLink, '_blank');
  };

  return (
    <div className="bg-luxury-cream py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-luxury-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-beige/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
              <span className="luxury-subheading block text-luxury-gold-dark text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
                Visit Our Locations
              </span>
              Our Stores
            </h2>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto leading-relaxed">
              Experience our collections in person at our beautifully designed showrooms across Kerala,
              where luxury meets personalized service.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className={`group luxury-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 animate-fade-in-up`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="relative">
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    width={600}
                    height={375}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-luxury-black/20 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="glass-dark rounded-xl p-4 backdrop-blur-sm">
                    <h3 className="luxury-heading text-2xl sm:text-3xl mb-3 text-white">{store.name}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-1 text-luxury-gold flex-shrink-0" />
                        <span className="luxury-body text-white/90 text-sm">{store.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-luxury-gold" />
                        <span className="luxury-body text-white/90 text-sm">{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-luxury-gold" />
                        <span className="luxury-body text-white/90 text-sm">{store.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white">
                <button
                  onClick={() => handleViewOnMap(store.mapLink)}
                  className="w-full luxury-btn-primary py-3 px-6 rounded-xl font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-lg"
                >
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="glass-dark rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="luxury-heading text-3xl text-white mb-4">
              Visit Us Today
            </h3>
            <p className="luxury-body text-white/90 text-lg mb-6 leading-relaxed">
              Experience our premium collections and receive personalized styling consultation
              from our expert team.
            </p>
            <button className="luxury-btn-secondary px-8 py-3 rounded-full font-medium text-sm tracking-wider uppercase">
              Schedule Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStoreSection;
