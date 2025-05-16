"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { INSTAGRAM_LINK, TIKTOK_LINK } from "src/links";
import { ExternalLinkSvg } from "src/svg/ExternalLinkSvg";
import Link from "next/link";

export default function HeroFashion() {
    return (
        <div className="relative w-full overflow-hidden">
            {/* Mobile Hero */}
            <div className="block md:hidden">
                <div className="relative h-[70vh] w-full">
                    <Image
                        src="/images/hero-mobile.jpg"
                        alt="Fashion Collection"
                        fill={true}
                        className="object-cover"
                        priority={true}
                    />
                    <div className="absolute inset-0 from-black/60 to-transparent bg-gradient-to-t" />
                    <div className="absolute bottom-0 left-0 w-full p-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h1 className="text-3xl font-bold text-white">
                                New Summer <br />Collection
                            </h1>
                            <p className="text-sm text-white/90">
                                Discover the latest trends in fashion
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100"
                            >
                                Shop Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Desktop Hero */}
            <div className="hidden md:block">
                <div className="grid h-[600px] grid-cols-2 gap-4">
                    <div className="flex items-center justify-center bg-gray-50 p-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6 max-w-lg"
                        >
                            <span className="inline-block rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                                New Collection
                            </span>
                            <h1 className="text-5xl font-bold leading-tight text-gray-900">
                                Summer Sale Stylish
                                <br />
                                <span className="text-gray-500">Collection</span>
                            </h1>
                            <p className="text-gray-600">
                                Discover our curated collection of summer essentials. Fresh styles added weekly.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center rounded-full bg-black px-8 py-4 font-medium text-white transition-colors hover:bg-gray-900"
                                >
                                    Shop Collection
                                    <ShoppingBag className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    href="/categories"
                                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-8 py-4 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                                >
                                    Browse Categories
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                    <div className="relative h-full">
                        <Image
                            src="/images/hero-desktop.jpg"
                            alt="Fashion Collection"
                            fill={true}
                            className="object-cover"
                            priority={true}
                        />
                        {/* Floating Promotion Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="absolute bottom-8 right-8 rounded-xl bg-white p-4 shadow-lg"
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                                    <Image
                                        src="/images/promo-product.jpg"
                                        alt="Promotional Product"
                                        fill={true}
                                        className="object-cover"
                                        priority={true}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Summer Sale</p>
                                    <p className="text-xs text-gray-500">Up to 50% off</p>
                                    <Link
                                        href="/products?category=sale"
                                        className="mt-2 inline-flex items-center text-xs font-medium text-black hover:underline"
                                    >
                                        Shop Now
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 