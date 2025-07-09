"use client";

import { useNavigation } from '../../hooks/useNavigation';
import {
  Logo,
  NavigationLinks,
  SearchSection,
  MobileSearch
} from './navbar';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const {
    isAdminPage,
    isMobileMenuOpen,
    isMobileSearchOpen,
    mobileSearchRef,
    mobileMenuRef,
    toggleMobileMenu,
    toggleMobileSearch,
    closeMobileMenu,
    getNavbarStyling,
    getTextStyling,
  } = useNavigation();

  const textStyles = getTextStyling();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getNavbarStyling()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo (desktop) or Hamburger menu (mobile) */}
          <div className="flex items-center">
            {/* Mobile Hamburger Menu Button */}
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
            <Logo variant="desktop" textStyles={textStyles} />
          </div>

          {/* Center - Navigation Links (desktop) or Logo (mobile) */}
          <div className="flex items-center">
            <Logo variant="mobile" textStyles={textStyles} />
            <NavigationLinks textStyles={textStyles} isAdminPage={isAdminPage} />
          </div>

          {/* Right side - Search Section */}
          <SearchSection toggleMobileSearch={toggleMobileSearch} />
        </div>

        {/* Mobile Search Bar - Expandable */}
        <MobileSearch
          isMobileSearchOpen={isMobileSearchOpen}
          mobileSearchRef={mobileSearchRef}
        />

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
