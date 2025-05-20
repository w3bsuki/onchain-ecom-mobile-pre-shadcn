'use client';

import { useState, useEffect } from 'react';
import { Filter, Tag, Circle, Sliders, SlidersHorizontal } from 'lucide-react';

export function MobileNavigation() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => {};
  }, []);

  // Only lock scrolling when a filter is active
  useEffect(() => {
    if (activeFilter) {
      // Lock scrolling when bottom sheet is open
      document.body.style.overflow = 'hidden';
    } else {
      // Allow scrolling when no bottom sheet is open
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeFilter]);
  
  if (!isMounted) return null;
  
  const filters = [
    { id: 'size', label: 'Size', icon: Tag },
    { id: 'color', label: 'Color', icon: Circle },
    { id: 'category', label: 'Category', icon: Filter },
    { id: 'price', label: 'Price', icon: Sliders },
    { id: 'sort', label: 'Sort', icon: SlidersHorizontal }
  ];
  
  const filterContent = {
    size: (
      <div>
        <h3 style={{ marginBottom: '12px', fontWeight: 500 }}>Select Size</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <button 
              key={size}
              type="button"
              aria-label={`Size ${size}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                width: '60px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    ),
    
    color: (
      <div>
        <h3 style={{ marginBottom: '12px', fontWeight: 500 }}>Select Color</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Gray', hex: '#808080' },
            { name: 'Red', hex: '#FF0000' },
            { name: 'Blue', hex: '#0000FF' }
          ].map(color => (
            <button 
              key={color.name}
              type="button"
              aria-label={`Color ${color.name}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                width: '70px',
                height: '70px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}
            >
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: color.hex,
                  border: '1px solid #e5e7eb',
                  marginBottom: '6px'
                }} 
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>
    ),
    
    category: (
      <div>
        <h3 style={{ marginBottom: '12px', fontWeight: 500 }}>Shop by Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['All', 'T-Shirts', 'Jeans', 'Dresses', 'Shoes'].map(category => (
            <button 
              key={category}
              type="button"
              aria-label={`Category ${category}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '10px',
                textAlign: 'left',
                width: '100%'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    ),
    
    price: (
      <div>
        <h3 style={{ marginBottom: '12px', fontWeight: 500 }}>Price Range</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <input 
            type="number" 
            placeholder="Min"
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '8px',
              width: '100%'
            }}
          />
          <span>to</span>
          <input 
            type="number" 
            placeholder="Max"
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '8px',
              width: '100%'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Under $25', '$25 - $50', '$50 - $100', '$100+'].map(range => (
            <button 
              key={range}
              type="button"
              aria-label={`Price range ${range}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '10px',
                textAlign: 'left',
                width: '100%'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    ),
    
    sort: (
      <div>
        <h3 style={{ marginBottom: '12px', fontWeight: 500 }}>Sort By</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'].map(option => (
            <button 
              key={option}
              type="button"
              aria-label={`Sort by ${option}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '10px',
                textAlign: 'left',
                width: '100%'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  };
  
  return (
    <>
      {/* Fixed bottom navigation bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '60px',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        zIndex: 40,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 4px'
      }}>
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id === activeFilter ? null : filter.id)}
            type="button"
            aria-label={filter.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '20%',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <filter.icon size={20} color="#374151" />
            <span style={{
              fontSize: '12px',
              marginTop: '4px',
              color: '#374151',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }}>
              {filter.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Bottom Sheet */}
      {activeFilter && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: '60px',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: -1
            }}
            onClick={() => setActiveFilter(null)}
          />
          
          {/* Content */}
          <div style={{
            backgroundColor: 'white',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
              <div style={{ width: '40px', height: '4px', backgroundColor: '#d1d5db', borderRadius: '2px' }} />
            </div>
            
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0 16px 12px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </h2>
              <button 
                onClick={() => setActiveFilter(null)}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div style={{ 
              padding: '16px', 
              overflowY: 'auto',
              flex: 1
            }}>
              {filterContent[activeFilter]}
            </div>
            
            {/* Actions */}
            <div style={{ 
              padding: '12px 16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => setActiveFilter(null)}
                aria-label="Cancel"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setActiveFilter(null)}
                aria-label="Apply"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 