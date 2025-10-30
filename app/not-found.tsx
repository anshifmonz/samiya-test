import Link from 'next/link';
import { Button } from 'ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist or has been moved.",
  noIndex: true
});

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-white">
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-luxury-black mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-luxury-black mb-4">Page Not Found</h2>
            <p className="text-luxury-gray mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-medium px-6 py-3"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-luxury-gray/30 text-luxury-black hover:bg-luxury-gray/10 px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
