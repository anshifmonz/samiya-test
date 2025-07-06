"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SearchBar from '../search/SearchBar';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const isAdminPage = pathname === '/admin';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchButton = document.querySelector('[aria-label="Toggle mobile search"]');

      if (searchButton && searchButton.contains(target)) return;
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target))
        setIsMobileSearchOpen(false);
    };

    if (isMobileSearchOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 50);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileSearchOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const menuButton = document.querySelector('[aria-label="Toggle mobile menu"]');

      if (menuButton && menuButton.contains(target)) return;
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target))
        setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 50);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const getNavbarStyling = () => {
    const DEFAULT_STYLE = 'bg-luxury-white backdrop-blur-sm border-b border-[#d6c6ae]/30 shadow-[0_4px_24px_rgba(214,198,174,0.2)] drop-shadow-[0_0_12px_rgba(214,198,174,0.1)]';
    // const BANNER_STYLE = 'bg-luxury-black/95 backdrop-blur-lg border-b border-white/30 shadow-[0_4px_24px_rgba(214,198,174,0.2)] drop-shadow-[0_0_12px_rgba(214,198,174,0.1)]';
    return DEFAULT_STYLE;
  };

  const getTextStyling = () => {
    const default_link_style = "luxury-body font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-red-500 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left";
    return {
      logo: 'text-red-500 font-[450]',
      logoSubtext: 'text-red-500 font-[500]',
      navLinks: `${default_link_style} text-black hover:text-red-500 font-[350] text-sm`
    };
  };

  const textStyles = getTextStyling();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getNavbarStyling()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo (desktop) or Hamburger menu (mobile) */}
          <div className="flex items-center">
            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`transition-colors duration-300 text-black p-2`}
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop Logo */}
            <div className="hidden md:block">
              <Link href="/" className={`flex flex-col items-start luxury-heading text-2xl font-light cursor-pointer transition-colors duration-300 tracking-wide uppercase ${textStyles.logo}`}>
                <span>Samiya</span>
                <span className={`block text-sm luxury-subheading tracking-[0.2em] ${textStyles.logoSubtext}`}>
                  Wedding Center
                </span>
              </Link>
            </div>
          </div>

          {/* Center - Navigation Links (desktop) or Logo (mobile) */}
          <div className="flex items-center">
            {/* Mobile Logo - Centered */}
            <div className="md:hidden">
              <Link href="/" className={`flex flex-col items-center luxury-heading text-2xl font-light cursor-pointer transition-colors duration-300 tracking-wide uppercase ${textStyles.logo}`}>
                <span>Samiya</span>
                <span className={`block text-sm luxury-subheading tracking-[0.2em] ml-2 sm:ml-0 ${textStyles.logoSubtext}`}>
                  Wedding Center
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links - Centered */}
            <div className="hidden md:flex space-x-12 md:space-x-8 lg:space-x-16">
              <Link
                href="/"
                className={`${textStyles.navLinks}`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`${textStyles.navLinks}`}
              >
                About
              </Link>
              <Link
                href="/collections"
                className={`${textStyles.navLinks}`}
              >
                Collections
              </Link>
              <Link
                href="/contact"
                className={`${textStyles.navLinks}`}
              >
                Contact
              </Link>
              {isAdminPage && (
                <span className="luxury-body font-light text-luxury-gold/80 tracking-wide px-3 py-1 bg-luxury-gold/10 rounded-full border border-luxury-gold/20">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Right side - Search bar (desktop) or Mobile Search */}
          <div className="flex items-center">
            {/* Desktop Search Bar */}
            <div className="hidden md:block w-44 md:w-56 lg:w-64">
              <SearchBar />
            </div>

            {/* Mobile Search Icon/Bar */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileSearch}
                className={`transition-colors duration-300 text-black p-2`}
                aria-label="Toggle mobile search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        <div
          ref={mobileSearchRef}
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-[#d6c6ae]/30">
            <SearchBar />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-4 border-t border-[#d6c6ae]/30">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`block ${textStyles.navLinks} text-base py-2`}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className={`block ${textStyles.navLinks} text-base py-2`}
            >
              About
            </Link>
            <Link
              href="/collections"
              onClick={closeMobileMenu}
              className={`block ${textStyles.navLinks} text-base py-2`}
            >
              Collections
            </Link>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className={`block ${textStyles.navLinks} text-base py-2`}
            >
              Contact
            </Link>
            {isAdminPage && (
              <div className="pt-2">
                <span className="luxury-body font-light text-luxury-gold/80 tracking-wide px-3 py-1 bg-luxury-gold/10 rounded-full border border-luxury-gold/20">
                  Admin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
