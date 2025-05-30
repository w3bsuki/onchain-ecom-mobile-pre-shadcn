import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Bebas_Neue } from "next/font/google";
import { OnchainStoreProvider } from "@/components/OnchainStoreProvider";
import Navbar from "@/components/layout/Navbar";
import { Banner } from "@/components/layout/Banner";
import { PromoBanner } from "@/components/layout/PromoBanner";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

// Configure the Poppins font for body text, including lighter weights
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Add Bebas Neue for urban/youth-oriented headings
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Strike - Urban Streetwear",
  description: "Premium streetwear and urban fashion for the style-conscious",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn("font-light font-sans", poppins.variable, bebasNeue.variable)}>
        <Providers>
          <OnchainStoreProvider>
            <Banner />
            <PromoBanner />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </OnchainStoreProvider>
        </Providers>
      </body>
    </html>
  );
}
