'use client';

export default function CustomLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Simple bucket hat icon */}
      <div className="relative w-8 h-6">
        <div className="absolute bottom-0 w-8 h-1.5 bg-black rounded-sm"></div>
        <div className="absolute bottom-1.5 w-6 h-4 bg-black rounded-t-lg mx-1"></div>
      </div>
      
      <div className="font-bold text-lg tracking-wide">
        INDECISIVE WEAR
      </div>
    </div>
  );
} 