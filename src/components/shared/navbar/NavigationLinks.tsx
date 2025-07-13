import Link from 'next/link';

interface NavigationLinksProps {
  textStyles: {
    navLinks: string;
  };
  isAdminPage: boolean;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ textStyles, isAdminPage }) => {
  return (
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
        href="/#navbar"
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
  );
};

export default NavigationLinks;
