
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, getProductById, products } from '../../data/products';
import ProductCard from '../../components/shared/ProductCard';
import Navigation from '../../components/shared/Navigation';
import { ArrowLeft } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        const firstColor = Object.keys(foundProduct.images)[0];
        setSelectedColor(firstColor);
        setCurrentImage(foundProduct.images[firstColor]);

        // Get similar products from the same category, excluding the current product
        const similar = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setSimilarProducts(similar);
      }
      setLoading(false);
    }
  }, [id]);

  const handleColorChange = (color: string) => {
    if (product) {
      setSelectedColor(color);
      setCurrentImage(product.images[color]);
    }
  };

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      red: '#DC2626',
      blue: '#2563EB',
      green: '#16A34A',
      white: '#FFFFFF',
      cream: '#F5F5DC',
      navy: '#000080',
      pink: '#EC4899',
      yellow: '#EAB308',
      purple: '#9333EA',
      black: '#000000',
      emerald: '#059669',
      maroon: '#7C2D12',
      gold: '#D97706',
      burgundy: '#7C2D12'
    };
    return colorMap[color] || color;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto"></div>
          <p className="mt-4 text-luxury-gray luxury-body">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="luxury-heading text-3xl text-luxury-black mb-6">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="luxury-btn-primary px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      <Navigation />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-luxury-gray/10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-luxury-gray hover:text-luxury-gold transition-colors duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="luxury-body font-medium">Back</span>
            </button>
            <h1 className="luxury-heading text-xl text-luxury-black">
              Samiya Wedding Center
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="luxury-card rounded-3xl overflow-hidden border border-luxury-gray/10 p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <div className="aspect-square overflow-hidden rounded-2xl bg-luxury-beige shadow-lg">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-4">
                <span className="luxury-body text-sm font-medium text-luxury-gray">Colors:</span>
                <div className="flex gap-3">
                  {Object.keys(product.images).map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                        selectedColor === color
                          ? 'border-luxury-gold ring-2 ring-luxury-gold/30 shadow-md'
                          : 'border-luxury-gray/30 hover:border-luxury-gold/50 shadow-sm hover:shadow-md'
                      }`}
                      style={{ backgroundColor: getColorStyle(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-luxury-gold/10 text-luxury-gold px-4 py-2 rounded-full luxury-body text-sm font-medium border border-luxury-gold/20">
                    {product.category}
                  </span>
                </div>
                <h1 className="luxury-heading text-4xl font-light text-luxury-black mb-4 leading-tight">
                  {product.title}
                </h1>
                <p className="text-4xl font-light text-luxury-gold mb-2">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="luxury-subheading text-luxury-black mb-4">Description</h3>
                <p className="luxury-body text-luxury-gray leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="luxury-subheading text-luxury-black mb-4">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-luxury-cream text-luxury-gray rounded-full luxury-body text-sm border border-luxury-gray/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full luxury-btn-primary py-4 px-8 rounded-2xl luxury-body text-lg font-medium transition-all duration-300">
                  Contact for Purchase
                </button>
                <p className="luxury-body text-sm text-luxury-gray mt-4 text-center">
                  Call us at +91 9876543210 or visit our store
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="luxury-heading text-3xl text-luxury-black mb-8 text-center">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
