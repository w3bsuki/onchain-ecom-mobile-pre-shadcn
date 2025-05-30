'use client';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 text-center">
      <div className="container mx-auto">
        <p className="text-gray-600 text-sm">
          © {currentYear} Onchain Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 