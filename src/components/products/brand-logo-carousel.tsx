"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Sports/streetwear brand logos 
const brandLogos = [
  { 
    id: 1,
    name: "Nike", 
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-nike-1-202653.png",
    alt: "Nike"
  },
  { 
    id: 2,
    name: "Adidas", 
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-adidas-282414.png",
    alt: "Adidas"
  },
  { 
    id: 3,
    name: "Puma", 
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-puma-3421676-2854595.png",
    alt: "Puma"
  },
  { 
    id: 4,
    name: "Reebok", 
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-reebok-3421498-2854417.png",
    alt: "Reebok"
  },
  { 
    id: 5,
    name: "New Balance", 
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-new-balance-3421505-2854424.png",
    alt: "New Balance"
  },
  { 
    id: 6,
    name: "Under Armour", 
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-under-armour-3421496-2854415.png",
    alt: "Under Armour"
  },
  { 
    id: 7,
    name: "North Face", 
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-north-face-3421492-2854411.png",
    alt: "North Face"
  },
  { 
    id: 8,
    name: "Vans",
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-vans-3421544-2854463.png",
    alt: "Vans"
  }
];

export default function BrandLogoCarousel() {
  return (
    <div className="bg-black overflow-hidden h-20 w-full shadow-md flex items-center">
      <div className="w-full relative flex items-center py-2">
        {/* Gradient overlay on left */}
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-black to-transparent" />
        
        {/* Gradient overlay on right */}
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-black to-transparent" />
        
        {/* Marquee container */}
        <div className="w-full overflow-hidden">
          <motion.div 
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              repeat: Number.MAX_SAFE_INTEGER, 
              duration: 25,
              ease: "linear"
            }}
          >
            {/* First set of logos */}
            <div className="flex min-w-full justify-around">
              {brandLogos.map((brand) => (
                <div 
                  key={brand.id} 
                  className="marquee-item"
                >
                  <div className="logo-container">
                    <Image
                      alt={brand.alt}
                      className="logo-image"
                      fill={true}
                      sizes="80px"
                      src={brand.logo}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Duplicated set of logos for seamless loop */}
            <div className="flex min-w-full justify-around">
              {brandLogos.map((brand) => (
                <div 
                  key={`clone-${brand.id}`} 
                  className="marquee-item"
                >
                  <div className="logo-container">
                    <Image
                      alt={brand.alt}
                      className="logo-image"
                      fill={true}
                      sizes="80px"
                      src={brand.logo}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* CSS for styles */}
      <style jsx={true} global={true}>{`
        /* Item styles */
        .marquee-item {
          flex-shrink: 0;
          width: 80px;
          margin: 0 8px;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .marquee-item:hover {
          transform: translateY(-2px);
        }
        
        /* Logo container styles */
        .logo-container {
          position: relative;
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Logo image styles */
        .logo-image {
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.9;
          transition: all 0.2s ease;
        }
        
        .marquee-item:hover .logo-image {
          opacity: 1;
          transform: scale(1.05);
        }
        
        /* Media queries for responsive design */
        @media (min-width: 768px) {
          .marquee-item {
            width: 110px;
            margin: 0 12px;
            padding: 5px;
          }
          
          .logo-container {
            height: 34px;
          }
        }
      `}</style>
    </div>
  );
}