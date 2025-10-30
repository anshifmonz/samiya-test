import { Heart, Share2 } from 'lucide-react';
import { useToast } from 'hooks/ui/use-toast';
import { useProductContext } from 'contexts/ProductContext';

export default function ProductHeader() {
  const { product, isWishlist, isLoadingWishlist, handleWishlistToggle } = useProductContext();
  const { toast } = useToast();

  const handleShare = async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const shareData = {
      title: product.title,
      text: `Check out this awesome product: ${product.title}`,
      url: window.location.href
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Copied!',
          description: 'Link copied to clipboard!'
        });
      } catch {
        toast({
          title: 'Failed to copy',
          description: 'Could not copy link.',
          variant: 'destructive'
        });
      }
    };

    if (!navigator.share) return await copyToClipboard();

    try {
      await navigator.share(shareData);
    } catch {
      await copyToClipboard();
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-semibold text-foreground">
          {product.title}{' '}
          <span className="text-muted-foreground text-sm">{product.short_code}</span>
        </h1>
        <div className="flex items-center gap-4">
          <Share2
            className="cursor-pointer text-gray-400 hover:text-pink-400 transition-colors"
            onClick={handleShare}
          />
          <Heart
            className={`transition-colors ${
              isWishlist ? 'text-pink-500 fill-pink-500' : 'text-gray-400 hover:text-pink-400'
            } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleWishlistToggle}
          />
        </div>
      </div>
      <p className="text-lg text-gray-600">{product.description}</p>
    </div>
  );
}
