import './globals.css';
import Script from 'next/script';
import type { Metadata } from 'next';
import { TooltipProvider } from 'ui/tooltip';
import { Inter, Playfair_Display } from 'next/font/google';
import Footer from 'components/shared/Footer';
import NavBar from 'components/shared/NavBar';
import NextLoadingBar from 'components/shared/NextLoadingBar';
import { QueryProvider } from 'components/providers/QueryProvider';
import { ToasterProvider } from 'components/providers/ToasterProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'Samiya Online - Elegant Wedding & Party Dresses',
  description:
    "Discover exquisite wedding attire and traditional wear crafted for life's most precious moments. Elegant bridal collection, sherwanis, kurtis, salwar suits, and festive wear.",
  authors: [{ name: 'Samiya Online' }],
  openGraph: {
    title: 'Samiya Online - Elegant Wedding & Party Dresses',
    description:
      "Discover exquisite wedding attire and traditional wear crafted for life's most precious moments.",
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_wedding',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png']
  },
  icons: {
    icon: 'https://images.jdmagicbox.com/v2/comp/palakkad/p3/9999px491.x491.240721005843.x4p3/catalogue/samiya-wedding-palace-pattambi-palakkad-readymade-garment-retailers-n1f86kp55m.jpg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <QueryProvider>
          <TooltipProvider>
            <ToasterProvider />
            <NavBar />
            <div id="recaptcha-container" style={{ display: 'none' }}></div>
            <NextLoadingBar color="#ef4444" />
            {children}
            <Footer />
          </TooltipProvider>
        </QueryProvider>
        <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
