"use client";

import { useNavigation } from '../../hooks/useNavigation';
import {
  Logo,
  NavigationLinks,
  SearchSection,
  MobileMenu,
  MobileSearch
} from './navbar';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo (desktop) or Hamburger menu (mobile) */}
          <div className="flex items-center">
            <MobileMenu
              isMobileMenuOpen={isMobileMenuOpen}
              toggleMobileMenu={toggleMobileMenu}
              closeMobileMenu={closeMobileMenu}
              isAdminPage={isAdminPage}
              textStyles={textStyles}
              mobileMenuRef={mobileMenuRef}
            />
            <Logo variant="desktop" textStyles={textStyles} />
          </div>

          {/* Center - Navigation Links (desktop) or Logo (mobile) */}
          <div className="flex items-center">
            <Logo variant="mobile" textStyles={textStyles} />
            <NavigationLinks textStyles={textStyles} isAdminPage={isAdminPage} />
          </div>
          <SearchSection toggleMobileSearch={toggleMobileSearch} />
        </div>
        <MobileSearch
          isMobileSearchOpen={isMobileSearchOpen}
          mobileSearchRef={mobileSearchRef}
        />
      </div>
    </nav>
  );
};

export default Navigation;
