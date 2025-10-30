'use client';

import { Button } from 'ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GoBackButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      className="border-luxury-gray/30 text-luxury-black hover:bg-luxury-gray/10 px-6 py-3"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Go Back
    </Button>
  );
}
