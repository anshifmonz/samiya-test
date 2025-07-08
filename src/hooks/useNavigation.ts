import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const useNavigation = () => {
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
    const DEFAULT_STYLE = 'bg-luxury-white backdrop-blur-sm border-b border-[#d6c6ae]/50';
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

  return {
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
  };
};
