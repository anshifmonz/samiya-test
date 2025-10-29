import Link from 'next/link';
import Image from 'next/image';

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
        <Link href="/" className="flex justify-center align-center ">
          <Image
            src="assets/images/logo.png"
            width="38"
            height="38"
            alt="Logo of samiya"
            className="mr-2  hidden md:block"
          />
          <div className={`${textStyles.logo}`}>
            <span>Samiya</span>
            <span className={`${textStyles.logoSubtext}`}>Online</span>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className={`md:hidden ${className}`}>
      <Link href="/" className="flex justify-center align-center pl-8 md:pl-">
        <Image
          src="assets/images/logo.png"
          width="38"
          height="38"
          alt="Logo of samiya"
          className="mr-2 block md:hidden"
        />
        <div className={`${textStyles.logo}`}>
          <span>Samiya</span>
          <span className={`${textStyles.logoSubtext}`}>Online</span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
