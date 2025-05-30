'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import SiteFooter from '@/components/layout/site-footer';
import EnhancedMedusaProducts from '@/components/products/EnhancedMedusaProducts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiStar, FiLayers, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function EnhancedProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-6">
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold mb-3">Enhanced Product Cards</h1>
          <p className="text-lg text-gray-600 mb-6">
            Showcasing our product cards using React Icons, Framer Motion animations, and React Hook Form.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <FiPackage className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">React Icons</h3>
              <p className="text-gray-600">
                Access 9.4 million+ icons from popular icon sets in a single package.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            >
              <FiStar className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">Framer Motion</h3>
              <p className="text-gray-600">
                Powerful animations and gestures for React applications.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              <FiLayers className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">React Hook Form</h3>
              <p className="text-gray-600">
                Efficient form validation with minimal re-renders.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
            >
              <FiRefreshCw className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">SWR</h3>
              <p className="text-gray-600">
                React data fetching library for fast, reactive applications.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        <section>
          <EnhancedMedusaProducts
            title="Enhanced Products"
            subtitle="Products with interactive cards using React Icons, Framer Motion, and React Hook Form"
            limit={8}
            featured={true}
            useEnhancedCards={true}
            fallbackToDemo={true}
            showDebug={true}
          />
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
} 