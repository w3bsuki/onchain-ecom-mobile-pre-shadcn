'use client';

export default function CustomLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Simple bucket hat icon */}
      <div className="relative h-6 w-8">
        <div className="absolute bottom-0 h-1.5 w-8 rounded-sm bg-black" />
        <div className="absolute bottom-1.5 mx-1 h-4 w-6 rounded-t-lg bg-black" />
      </div>
      
      <div className="font-bold text-xl tracking-tight lg:text-2xl">
        INDECISIVE WEAR
      </div>
    </div>
  );
} 