import Link from 'next/link';

interface LogoProps {
  variant: 'desktop' | 'mobile';
  textStyles: {
    logo: string;
    logoSubtext: string;
  };
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant, textStyles, className }) => {
  if (variant === 'desktop') {
    return (
      <div className={`hidden md:block ${className}`}>
        <Link href="/" className={`${textStyles.logo}`}>
          <span>Samiya</span>
          <span className={`${textStyles.logoSubtext}`}>
            Online
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`md:hidden ${className}`}>
      <Link href="/" className={`${textStyles.logo}`}>
        <span>Samiya</span>
        <span className={`${textStyles.logoSubtext}`}>
          Online
        </span>
      </Link>
    </div>
  );
};

export default Logo;
