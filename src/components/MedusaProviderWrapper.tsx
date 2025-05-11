'use client';

import { MedusaProvider } from '../context/MedusaContext';

export default function MedusaProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MedusaProvider>{children}</MedusaProvider>;
} 