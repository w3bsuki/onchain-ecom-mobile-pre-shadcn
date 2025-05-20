import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';
import './global.css';
import { StoreProvider } from '@/context/StoreProvider';
import { MobileNavigation } from '@/components/ui/MobileNavigation';

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Onchain Commerce',
  description: 'A modern e-commerce store built with Next.js and Supabase',
  metadataBase: new URL(NEXT_PUBLIC_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
          <MobileNavigation />
        </StoreProvider>
      </body>
    </html>
  );
}
