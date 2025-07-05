"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '../search/SearchBar';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';
  const isAdminPage = pathname === '/admin';

  const getNavbarStyling = () => {
    const DEFAULT_STYLE = 'bg-luxury-white backdrop-blur-sm border-b border-[#d6c6ae]/30 shadow-[0_4px_24px_rgba(214,198,174,0.2)] drop-shadow-[0_0_12px_rgba(214,198,174,0.1)]';
    // const BANNER_STYLE = 'bg-luxury-black/95 backdrop-blur-lg border-b border-white/30 shadow-[0_4px_24px_rgba(214,198,174,0.2)] drop-shadow-[0_0_12px_rgba(214,198,174,0.1)]';

    return DEFAULT_STYLE;
  };

  const getTextStyling = () => {
    const default_link_style = "luxury-body font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left";
    return {
      logo: 'text-luxury-black hover:text-luxury-gold font-[450]',
      logoSubtext: 'text-luxury-gold font-[500]',
      navLinks: `${default_link_style} text-luxury-black hover:text-luxury-gold font-[350] text-sm`
    };
  };

  const textStyles = getTextStyling();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getNavbarStyling()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className={`luxury-heading text-2xl font-light cursor-pointer transition-colors duration-300 tracking-wide ${textStyles.logo}`}>
            Samiya
            <span className={`block text-sm luxury-subheading tracking-[0.2em] ${textStyles.logoSubtext}`}>
              Wedding Center
            </span>
          </Link>

          <div className="hidden md:flex space-x-12">
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

          {/* Search Bar - Only show on search page */}
          {isSearchPage && (
            <div className="hidden md:block w-80">
              <SearchBar />
            </div>
          )}

          <div className="md:hidden">
            <button className={`transition-colors duration-300 ${textStyles.navLinks}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
