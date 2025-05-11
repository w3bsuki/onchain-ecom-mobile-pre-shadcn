import ProductImage from './ProductImage';

interface MedusaImageProps {
  src: string | null; 
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * A simple wrapper around ProductImage for compatibility
 */
export function MedusaImage(props: MedusaImageProps) {
  return <ProductImage {...props} />;
}

export default MedusaImage; 