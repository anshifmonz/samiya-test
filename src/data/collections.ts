  type Collection = {
    id: string;
    title: string;
    description: string;
    image: string;
    searchQuery: string;
    gradient: string;
  };

  const collections: Collection[] = [
    {
      id: 'oversized-blazers',
      title: 'Oversized Blazers',
      description: 'Power dressing redefined with structured silhouettes and contemporary cuts that command attention.',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&crop=center',
      searchQuery: 'blazer oversized',
      gradient: 'from-luxury-black/80 to-luxury-gray/60'
    },
    {
      id: 'high-waisted-jeans',
      title: 'High-Waisted Jeans',
      description: 'Classic denim elevated with flattering high-rise cuts and premium fabric for effortless sophistication.',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=1000&fit=crop&crop=center',
      searchQuery: 'jeans high waisted',
      gradient: 'from-luxury-dark-gray/80 to-luxury-black/60'
    },
    {
      id: 'bold-prints',
      title: 'Bold Prints',
      description: 'Make a statement with vibrant patterns and artistic designs that celebrate individuality and creativity.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&crop=center',
      searchQuery: 'printed bold pattern',
      gradient: 'from-luxury-gold/40 to-luxury-black/80'
    },
    {
      id: 'pastel-colors',
      title: 'Pastel Colors',
      description: 'Soft, dreamy hues that bring elegance and femininity to your wardrobe with subtle sophistication.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop&crop=center',
      searchQuery: 'pastel soft colors',
      gradient: 'from-white/60 to-luxury-cream/80'
    },
    {
      id: 'minimalist-chic',
      title: 'Minimalist Chic',
      description: 'Clean lines and timeless designs that embody the philosophy of less is more in luxury fashion.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop&crop=center',
      searchQuery: 'minimalist clean',
      gradient: 'from-luxury-black/70 to-luxury-gray/50'
    },
    {
      id: 'vintage-revival',
      title: 'Vintage Revival',
      description: 'Nostalgic pieces with a modern twist, bringing the best of bygone eras into contemporary style.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&crop=center',
      searchQuery: 'vintage retro classic',
      gradient: 'from-luxury-gold/30 to-luxury-dark-gray/70'
    }
  ];

  export default collections;
