import Link from 'next/link';

interface LogoProps {
  variant: 'desktop' | 'mobile';
  textStyles: {
    logo: string;
    logoSubtext: string;
  };
}

const Logo: React.FC<LogoProps> = ({ variant, textStyles }) => {
  if (variant === 'desktop') {
    return (
      <div className="hidden md:block">
        <Link href="/" className={`flex flex-col items-start luxury-heading text-2xl font-light cursor-pointer transition-colors duration-300 tracking-wide uppercase ${textStyles.logo}`}>
          <span>Samiya</span>
          <span className={`block text-sm luxury-subheading tracking-[0.2em] ${textStyles.logoSubtext}`}>
            Wedding Center
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <Link href="/" className={`flex flex-col items-center luxury-heading text-2xl font-light cursor-pointer transition-colors duration-300 tracking-wide uppercase ${textStyles.logo}`}>
        <span>Samiya</span>
        <span className={`block text-sm luxury-subheading tracking-[0.2em] ${textStyles.logoSubtext}`}>
          Wedding Center
        </span>
      </Link>
    </div>
  );
};

export default Logo;
