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
    <div className="md:hidden">
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
