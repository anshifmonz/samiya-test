import './globals.css';
import Script from 'next/script';
import { TooltipProvider } from 'ui/tooltip';
import { Inter, Playfair_Display } from 'next/font/google';
import Footer from 'components/shared/Footer';
import NavBar from 'components/shared/NavBar';
import { AuthProvider } from 'contexts/AuthContext';
import NextLoadingBar from 'components/shared/NextLoadingBar';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import { QueryProvider } from 'components/providers/QueryProvider';
import { ToasterProvider } from 'components/providers/ToasterProvider';
import { AuthModalProvider } from 'contexts/user/shared/AuthModalContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});

export const metadata = generateBaseMetadata({
  title: 'Samiya Online - Elegant Wedding & Party Dresses',
  description:
    "Discover exquisite wedding attire and traditional wear crafted for life's most precious moments. Elegant bridal collection, sherwanis, kurtis, salwar suits, and festive wear."
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <AuthModalProvider>
              <TooltipProvider>
                <ToasterProvider />
                <NavBar />
                <div id="recaptcha-container" style={{ display: 'none' }}></div>
                <NextLoadingBar color="#ef4444" />
                {children}
                <Footer />
              </TooltipProvider>
            </AuthModalProvider>
          </AuthProvider>
        </QueryProvider>
        <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
