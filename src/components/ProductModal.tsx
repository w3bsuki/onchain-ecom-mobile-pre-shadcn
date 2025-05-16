'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import ProductImage from './ProductImage';
import QuantityInput from './QuantityInput';
import type { Product } from 'src/types';
import { Star, Truck, ShieldCheck, RefreshCw, Check, ChevronDown } from 'lucide-react';
import { useOnchainStoreContext } from './OnchainStoreProvider';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  // Destructure the product
  const { id, name, price, image } = product;
  const { addToCart } = useOnchainStoreContext();
  
  // Mock data for enhanced display
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Navy', hex: '#0a2463' },
    { name: 'Gray', hex: '#808080' },
  ];
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  
  // Mock review data
  const rating = 4.5;
  const reviewCount = 24;
  
  // Sample product images (would come from API in real implementation)
  const productImages = [
    typeof image === 'string' ? image : null,
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1548126032-079a0fb0099d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  ];
  
  const [mainImage, setMainImage] = useState<string | null>(productImages[0]);
  
  const renderStars = () => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <Star
              key={`star-${i}`}
              size={16}
              className={`${
                starValue <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : starValue - 0.5 <= rating
                  ? 'fill-yellow-400 half text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          );
        })}
        <span className="ml-2 text-gray-500 text-sm">{reviewCount} reviews</span>
      </div>
    );
  };
  
  const renderTabContent = () => {
    if (activeTab === 'description') {
      return (
        <div className="leading-relaxed space-y-4 text-gray-700 text-sm">
          <p>This is a premium product made with the highest quality materials. Perfect for everyday use and special occasions.</p>
          <p>The fabric is durable, comfortable, and easy to care for. Designed with attention to detail and crafted for long-lasting wear.</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Premium quality fabric</li>
            <li>Comfortable fit</li>
            <li>Versatile style</li>
            <li>Machine washable</li>
          </ul>
        </div>
      );
    }
    
    if (activeTab === 'details') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 text-sm">
            <span className="font-medium text-gray-700">Material</span>
            <span className="text-gray-600">100% Cotton</span>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <span className="font-medium text-gray-700">Weight</span>
            <span className="text-gray-600">250g</span>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <span className="font-medium text-gray-700">Made in</span>
            <span className="text-gray-600">Portugal</span>
          </div>
          <div className="grid grid-cols-2 text-sm">
            <span className="font-medium text-gray-700">Care Instructions</span>
            <span className="text-gray-600">Machine wash cold, tumble dry low</span>
          </div>
        </div>
      );
    }
    
    // Shipping tab
    return (
      <div className="space-y-4 text-sm">
        <div className="flex items-start">
          <Truck size={18} className="mt-0.5 mr-2 text-gray-700" />
          <div>
            <p className="font-medium text-gray-800">Free Shipping</p>
            <p className="text-gray-600">On orders over $100 - 3-5 business days</p>
          </div>
        </div>
        <div className="flex items-start">
          <RefreshCw size={18} className="mt-0.5 mr-2 text-gray-700" />
          <div>
            <p className="font-medium text-gray-800">Free Returns</p>
            <p className="text-gray-600">Within 30 days of delivery</p>
          </div>
        </div>
        <div className="flex items-start">
          <ShieldCheck size={18} className="mt-0.5 mr-2 text-gray-700" />
          <div>
            <p className="font-medium text-gray-800">Secure Payments</p>
            <p className="text-gray-600">SSL encrypted checkout</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Toggle collapsible section
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Collapsible section component for mobile
  const CollapsibleSection = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="border-t border-gray-100 py-3">
        <button 
          type="button" 
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-medium text-sm">{title}</h3>
          <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        {isExpanded && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
    );
  };
  
  // Add to Cart button
  const handleAddToCart = () => {
    addToCart(id);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-full md:max-w-3xl overflow-hidden p-0 rounded-lg h-[90vh] md:h-auto">
        <div className="flex flex-col h-full overflow-auto md:flex-row md:overflow-visible">
          {/* Product Images - Top on mobile, Left on desktop */}
          <div className="bg-gray-50 flex flex-col md:w-1/2">
            {/* Main Image - smaller on mobile */}
            <div className="aspect-square flex h-[250px] md:h-[350px] items-center justify-center p-4 relative">
              <ProductImage 
                src={mainImage}
                alt={name}
                className="max-h-full max-w-full object-contain transition-all duration-300"
                width={400}
                height={400}
              />
            </div>
            
            {/* Thumbnail Images - horizontal scroll on mobile */}
            <div className="border-t border-gray-100 flex items-center justify-start md:justify-center overflow-x-auto p-2 space-x-2">
              {productImages.map((img, index) => (
                <button
                  type="button"
                  key={`thumb-${index}`}
                  className={`border h-12 md:h-14 overflow-hidden p-1 rounded-md w-12 md:w-14 flex-shrink-0 ${
                    mainImage === img ? 'border-black' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMainImage(img)}
                  aria-label={`View product image ${index + 1}`}
                >
                  <ProductImage
                    src={img}
                    alt={`${name} - View ${index + 1}`}
                    className="h-full object-contain w-full"
                    width={50}
                    height={50}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details - Bottom on mobile, Right on desktop */}
          <div className="border-t border-gray-100 flex flex-col flex-grow md:border-l md:border-t-0 md:w-1/2 p-4 md:p-6 overflow-auto">
            <DialogHeader className="mb-3 md:mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="font-semibold text-lg md:text-xl tracking-tight">{name}</DialogTitle>
                  <div className="mt-1">{renderStars()}</div>
                </div>
                <div className="font-semibold text-lg md:text-xl text-gray-900">
                  ${price.toFixed(2)}
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-4 md:space-y-6">
              {/* Mobile: Collapsible sections */}
              <div className="md:hidden">
                {/* Colors */}
                <CollapsibleSection title={`Color: ${colors[selectedColor].name}`} id="colors">
                  <div className="flex space-x-2 mt-2">
                    {colors.map((color, index) => (
                      <button
                        type="button"
                        key={`color-${index}`}
                        className={`h-8 relative rounded-full w-8 ${selectedColor === index ? 'ring-2 ring-black ring-offset-2' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(index)}
                        aria-label={`Select ${color.name} color`}
                      >
                        {selectedColor === index && (
                          <Check className="absolute h-full inset-0 m-auto text-white w-full" size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                </CollapsibleSection>
                
                {/* Sizes */}
                <CollapsibleSection title={`Size: ${selectedSize}`} id="sizes">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map((size) => (
                      <button
                        type="button"
                        key={`size-${size}`}
                        className={`border font-medium h-9 rounded text-center text-sm transition-colors w-12 
                          ${selectedSize === size 
                            ? 'bg-black border-black text-white' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </CollapsibleSection>
                
                {/* Quantity */}
                <CollapsibleSection title="Quantity" id="quantity">
                  <QuantityInput productId={id} />
                </CollapsibleSection>
                
                {/* Product Info */}
                <CollapsibleSection title="Product Information" id="info">
                  <div className="border-b border-gray-200 flex space-x-4 mb-3">
                    <button
                      type="button"
                      className={`border-b-2 font-medium pb-2 pt-1 text-sm transition-colors ${
                        activeTab === 'description' ? 'border-black text-black' : 'border-transparent hover:text-gray-700 text-gray-500'
                      }`}
                      onClick={() => setActiveTab('description')}
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      className={`border-b-2 font-medium pb-2 pt-1 text-sm transition-colors ${
                        activeTab === 'shipping' ? 'border-black text-black' : 'border-transparent hover:text-gray-700 text-gray-500'
                      }`}
                      onClick={() => setActiveTab('shipping')}
                    >
                      Shipping
                    </button>
                  </div>
                  {renderTabContent()}
                </CollapsibleSection>
              </div>
              
              {/* Desktop: Expanded sections */}
              <div className="hidden md:block">
                {/* Colors */}
                <div>
                  <h3 className="font-medium mb-2 text-sm">Color: <span className="font-normal">{colors[selectedColor].name}</span></h3>
                  <div className="flex space-x-2">
                    {colors.map((color, index) => (
                      <button
                        type="button"
                        key={`color-${index}`}
                        className={`h-8 relative rounded-full w-8 ${selectedColor === index ? 'ring-2 ring-black ring-offset-2' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(index)}
                        aria-label={`Select ${color.name} color`}
                      >
                        {selectedColor === index && (
                          <Check className="absolute h-full inset-0 m-auto text-white w-full" size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sizes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Size</h3>
                    <button type="button" className="font-medium hover:text-indigo-500 text-indigo-600 text-xs">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        type="button"
                        key={`size-${size}`}
                        className={`border font-medium h-9 rounded text-center text-sm transition-colors w-12 
                          ${selectedSize === size 
                            ? 'bg-black border-black text-white' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity */}
                <div>
                  <h3 className="font-medium mb-2 text-sm">Quantity</h3>
                  <QuantityInput productId={id} />
                </div>
                
                {/* Tabs */}
                <div>
                  <div className="border-b border-gray-200 flex space-x-6">
                    <button
                      type="button"
                      className={`border-b-2 font-medium pb-2 pt-1 text-sm transition-colors ${
                        activeTab === 'description' ? 'border-black text-black' : 'border-transparent hover:text-gray-700 text-gray-500'
                      }`}
                      onClick={() => setActiveTab('description')}
                    >
                      Description
                    </button>
                    <button
                      type="button"
                      className={`border-b-2 font-medium pb-2 pt-1 text-sm transition-colors ${
                        activeTab === 'details' ? 'border-black text-black' : 'border-transparent hover:text-gray-700 text-gray-500'
                      }`}
                      onClick={() => setActiveTab('details')}
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      className={`border-b-2 font-medium pb-2 pt-1 text-sm transition-colors ${
                        activeTab === 'shipping' ? 'border-black text-black' : 'border-transparent hover:text-gray-700 text-gray-500'
                      }`}
                      onClick={() => setActiveTab('shipping')}
                    >
                      Shipping
                    </button>
                  </div>
                  <div className="mt-4">
                    {renderTabContent()}
                  </div>
                </div>
              </div>
              
              {/* Shipping note - compressed on mobile */}
              <div className="border-t border-gray-100 flex items-center justify-center pt-3 md:pt-4 text-gray-500 text-xs md:text-sm">
                <Truck size={14} className="mr-1.5" />
                <span>Free shipping on orders over $100</span>
              </div>
              
              {/* Add to Cart - sticky on mobile */}
              <div className="sticky bottom-0 bg-white pt-2 pb-2 md:static md:pt-0 md:pb-0">
                <button 
                  type="button"
                  className="bg-black font-medium hover:bg-gray-800 px-6 py-3 rounded text-white transition-colors w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 