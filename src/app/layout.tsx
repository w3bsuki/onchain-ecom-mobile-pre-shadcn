import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';
import './global.css';
import dynamic from 'next/dynamic';

const MedusaProviderWrapper = dynamic(
  () => import('src/components/MedusaProviderWrapper'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'Medusa E-commerce',
  description: 'Modern E-commerce Template',
  openGraph: {
    title: 'Medusa E-commerce',
    description: 'Modern E-commerce Template',
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MedusaProviderWrapper>
          {children}
        </MedusaProviderWrapper>
      </body>
    </html>
  );
}
