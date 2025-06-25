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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-light">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-rose-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-gray-600 hover:text-rose-600 transition-colors duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold text-rose-600 tracking-tight">
              Samiya Wedding Center
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-rose-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">Colors:</span>
                <div className="flex gap-2">
                  {Object.keys(product.images).map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                        selectedColor === color
                          ? 'border-rose-600 ring-2 ring-rose-200 shadow-md'
                          : 'border-gray-300 hover:border-rose-400 shadow-sm hover:shadow-md'
                      }`}
                      style={{ backgroundColor: getColorStyle(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-bold border border-rose-200">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                  {product.title}
                </h1>
                <p className="text-4xl font-bold text-rose-600 mb-2">
                  ₹{product.price}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 tracking-wide">Description</h3>
                <p className="text-gray-700 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 tracking-wide">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm font-medium border border-rose-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 px-6 rounded-2xl text-lg font-bold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Contact for Purchase
                </button>
                <p className="text-sm text-gray-600 mt-3 text-center font-light">
                  Call us at +91 9876543210 or visit our store
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Similar Products</h2>
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
