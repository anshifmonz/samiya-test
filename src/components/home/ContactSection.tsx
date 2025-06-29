"use client";

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <div className="bg-luxury-beige py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
              <span className="luxury-subheading block text-luxury-gold-dark text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
                Get in Touch
              </span>
              Contact Us
            </h2>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
              Visit our store or contact us for personalized styling consultation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="animate-fade-in-left" style={{ animationDelay: '0.4s' }}>
            <h3 className="luxury-heading text-3xl text-luxury-black mb-12">Contact Information</h3>

            <div className="space-y-8">
              <div className="flex items-center group">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-luxury-black" />
                </div>
                <div>
                  <p className="luxury-body text-luxury-gray text-sm tracking-wider uppercase">Phone</p>
                  <p className="luxury-heading text-xl text-luxury-black">+91 9876543210</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-luxury-black" />
                </div>
                <div>
                  <p className="luxury-body text-luxury-gray text-sm tracking-wider uppercase">Email</p>
                  <p className="luxury-heading text-xl text-luxury-black">info@samiyaweddingcenter.com</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-6 mt-1 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-luxury-black" />
                </div>
                <div>
                  <p className="luxury-body text-luxury-gray text-sm tracking-wider uppercase mb-2">Store Location</p>
                  <p className="luxury-body text-luxury-black">123 Wedding Street, Fashion District</p>
                  <p className="luxury-body text-luxury-black">Mumbai, Maharashtra 400001</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-luxury-black" />
                </div>
                <div>
                  <p className="luxury-body text-luxury-gray text-sm tracking-wider uppercase">Store Hours</p>
                  <p className="luxury-heading text-xl text-luxury-black">10:00 AM - 9:00 PM</p>
                  <p className="luxury-body text-luxury-gray">Monday - Sunday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-right" style={{ animationDelay: '0.6s' }}>
            <h3 className="luxury-heading text-3xl text-luxury-black mb-12">Send us a Message</h3>

            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-6 py-4 luxury-body text-lg bg-white border border-luxury-gray/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:border-luxury-gold/50 text-luxury-black placeholder-luxury-gray/60 transition-all duration-300"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-6 py-4 luxury-body text-lg bg-white border border-luxury-gray/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:border-luxury-gold/50 text-luxury-black placeholder-luxury-gray/60 transition-all duration-300"
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  placeholder="Your Message"
                  className="w-full px-6 py-4 luxury-body text-lg bg-white border border-luxury-gray/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:border-luxury-gold/50 text-luxury-black placeholder-luxury-gray/60 resize-none transition-all duration-300"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full luxury-btn-primary py-4 rounded-2xl font-medium text-lg tracking-wider uppercase shadow-2xl"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
