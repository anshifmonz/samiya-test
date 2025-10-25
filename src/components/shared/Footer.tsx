'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<string>("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-black text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:flex sm:justify-between sm:flex-wrap sm:items-start">
          <div className="text-center sm:text-left sm:flex-1 sm:min-w-[200px] sm:max-w-[300px]">
            <h3 className="luxury-heading text-xl sm:text-2xl lg:text-3xl font-light mb-4 tracking-wide text-red-500">Samiya Online</h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Discover the latest trends and timeless pieces that define your unique style.
              Quality fashion for the modern lifestyle.
            </p>
          </div>

          <div className="text-center sm:text-left sm:flex-1 sm:min-w-[150px] sm:max-w-[200px] sm:pl-14">
            <h4 className="luxury-body font-medium mb-4 text-sm sm:text-base tracking-wide text-red-500 uppercase">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-luxury-black/70">
              <li><Link href="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
              <li><Link href="/collections" className="hover:text-red-400 transition-colors">Collections</Link></li>
              <li><Link href="#navbar" className="hover:text-red-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="#navbar" className="hover:text-red-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="text-center sm:text-left sm:flex-1 sm:min-w-[150px] sm:max-w-[200px] sm:pl-16">
            <h4 className="luxury-body font-medium mb-4 text-sm sm:text-base tracking-wide text-red-500 uppercase">Support</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-luxury-black/70">
              <li><Link href="/privacy-policy" className="hover:text-red-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-red-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/cancellation-and-refund-policy" className="hover:text-red-400 transition-colors">Cancellation & Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-red-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-luxury-black/20 mt-8 sm:mt-12 pt-8 text-center">
          <p className="text-luxury-black/60 text-sm sm:text-base">
            © {currentYear} Samiya Online. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
