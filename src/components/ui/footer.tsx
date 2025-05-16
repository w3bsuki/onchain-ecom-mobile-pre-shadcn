'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { name: 'GitHub', href: 'https://github.com', icon: Github },
  ];

  const shopLinks = [
    { name: 'All Products', href: '/' },
    { name: 'New Arrivals', href: '/' },
    { name: 'Featured', href: '/' },
    { name: 'Accessories', href: '/' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/' },
    { name: 'Blog', href: '/' },
    { name: 'Careers', href: '/' },
    { name: 'Contact', href: '/' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Privacy Policy', href: '/legal/privacy-policy' },
    { name: 'Returns', href: '/' },
    { name: 'FAQ', href: '/' },
  ];

  return (
    <footer className="bg-black border-gray-800 border-t text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-10 grid-cols-1 md:grid-cols-4">
          {/* Branding */}
          <div className="space-y-4">
            <h2 className="font-bold text-xl">ONCHAIN COMMERCE</h2>
            <Link 
              href="/" 
              className="bg-white border border-gray-300 font-medium hover:bg-gray-50 inline-block px-5 py-2 rounded-md text-black text-sm transition-colors">
              Shop All
            </Link>
          </div>
          
          {/* Links 1 */}
          <div>
            <h3 className="font-medium mb-4 text-lg">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map(item => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white text-gray-400 text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Links 2 */}
          <div>
            <h3 className="font-medium mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map(item => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white text-gray-400 text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Links 3 */}
          <div>
            <h3 className="font-medium mb-4 text-lg">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map(item => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white text-gray-400 text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="mb-4 md:mb-0 text-gray-400 text-sm">
            © {currentYear} Onchain Commerce. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-gray-400 transition-colors"
                aria-label={name}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 