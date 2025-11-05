'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'ui/button';
import { User } from 'lucide-react';
import { useNavigation } from 'hooks/useNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'ui/dropdown-menu';
import { Logo, NavigationLinks, SearchSection, MobileSearch } from './navbar';
import { useAuthContext } from 'contexts/AuthContext';

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
    closeMobileSearch,
    getNavbarStyling,
    getTextStyling
  } = useNavigation();

  const { user } = useAuthContext();

  const textStyles = getTextStyling();

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getNavbarStyling()}`}
    >
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop Logo */}
            <Logo variant="desktop" textStyles={textStyles} />
          </div>

          {/* Center - Navigation Links (desktop) or Logo (mobile) */}
          <div className="flex items-center">
            <Logo variant="mobile" textStyles={textStyles} className="" />
            <NavigationLinks
              textStyles={textStyles}
              isAdminPage={isAdminPage}
              className="pl-12 lg:pl-20"
            />
          </div>

          {/* Right side - Search and User Sections */}
          <div className="flex items-center space-x-4">
            <SearchSection toggleMobileSearch={toggleMobileSearch} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="border hover:bg-muted">
                <Button variant="ghost" size="icon">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {user ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/user/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/user/wishlists">Wishlists</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/user/cart">Cart</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/user/orders">Orders</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/signin">Sign In</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        <MobileSearch
          isMobileSearchOpen={isMobileSearchOpen}
          mobileSearchRef={mobileSearchRef}
          onSearch={closeMobileSearch}
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
              href="/categories"
              onClick={closeMobileMenu}
              className={`block ${textStyles.navLinks} text-base py-2`}
            >
              Categories
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
