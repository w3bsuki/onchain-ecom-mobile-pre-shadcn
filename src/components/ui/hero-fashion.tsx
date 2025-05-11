"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { INSTAGRAM_LINK, TIKTOK_LINK } from "src/links";
import { ExternalLinkSvg } from "src/svg/ExternalLinkSvg";
import { cn, pressable } from '@coinbase/onchainkit/theme';

export default function HeroFashion() {
    // Primary image
    const primaryImageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80";

    return (
        <div className="bg-white h-full w-full">
            <div className="px-4 py-4 w-full">
                {/* Image section - larger and more prominent */}
                <div className="aspect-[3/4] mb-4 overflow-hidden relative rounded-xl w-full max-h-[45vh]">
                    <div className="-left-10 -top-10 -z-10 absolute bg-[#f8b3c4] blur-3xl h-72 opacity-20 rounded-full w-72" />
                    <Image
                        src={primaryImageUrl}
                        alt="Fashion model"
                        fill={true}
                        priority={true}
                        className="object-cover"
                        onError={() => {}}
                    />
                </div>
                
                {/* Text section */}
                <div className="w-full">
                    <h1 className="font-bold leading-tight mb-4 text-3xl text-black tracking-tighter">
                        INDECISIVE WEAR
                    </h1>
                    <ul className="mb-4 space-y-2 text-black/90 text-base tracking-tighter">
                        {[
                            "Ready-to-wear",
                            "Accessories",
                            "Footwear",
                            "Leather goods",
                            "Jewelry",
                        ].map((item, index) => (
                            <motion.li
                                key={item}
                                initial={{ opacity: 0.8 }}
                                whileHover={{
                                    opacity: 1,
                                    y: -2,
                                    transition: {
                                        duration: 0.3,
                                        ease: "easeOut",
                                    },
                                }}
                                transition={{
                                    delay: index * 0.1,
                                }}
                            >
                                <a href="/" className="cursor-pointer font-medium">
                                    {item}
                                </a>
                            </motion.li>
                        ))}
                    </ul>
                    <div>
                        <h2 className="font-medium mt-4 text-black text-xl">
                            SUMMER 2024
                        </h2>
                        <p className="max-w-md pt-2 text-black/95 text-sm tracking-tight">
                            The future of commerce is less fee. More creativity.
                        </p>
                        
                        {/* Social icons */}
                        <div className="flex items-center mt-4 space-x-4">
                            <a 
                                href={INSTAGRAM_LINK} 
                                target="_blank" 
                                rel="noreferrer" 
                                className={cn(
                                    "flex items-center text-sm",
                                    pressable.default
                                )}
                            >
                                INSTAGRAM
                                <span className="pl-1">
                                    <ExternalLinkSvg />
                                </span>
                            </a>
                            <a 
                                href={TIKTOK_LINK} 
                                target="_blank" 
                                rel="noreferrer" 
                                className={cn(
                                    "flex items-center text-sm",
                                    pressable.default
                                )}
                            >
                                TIKTOK
                                <span className="pl-1">
                                    <ExternalLinkSvg />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 