interface IconProps {
  className?: string;
}

export function ShoesIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>Shoes</title>
      <path d="M2 14l.02-4 4.98-2v4l-5 2Z" />
      <path d="M6 12v8c4.5 0 8.5-2 14-6v-4c-4.5 0-8.5 2-14 6Z" />
      <path d="M14 12.4c.6.2 1.2.3 1.9.3 1.1 0 2.3-.3 3.1-.8" />
      <path d="M7 15.5c3.5 0 6.5-1 10-4" />
      <path d="M9 18c2.5 0 5-1 8-3" />
      <circle cx="4" cy="15" r="0.5" />
      <circle cx="4.5" cy="17" r="0.5" />
    </svg>
  );
}

export function ShirtIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>Shirt</title>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      <path d="M8 10v5" />
      <path d="M16 10v5" />
      <path d="M12 6v10" />
      <path d="M10 15h4" />
      <path d="M8.5 15.5L10 17l1.5-1.5" />
      <path d="M15.5 15.5L14 17l-1.5-1.5" />
    </svg>
  );
}

export function HoodieIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>Hoodie</title>
      <path d="M21 6l-5 4" />
      <path d="M3 6l5 4" />
      <path d="M12 2a4 4 0 0 0-4 4v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a4 4 0 0 0-4-4z" />
      <path d="M10 10v8c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-8" />
      <path d="M7.2 6h-.1a2 2 0 0 0-2 2.1l.5 8a2 2 0 0 0 2 1.9h.1" />
      <path d="M16.8 6h.1a2 2 0 0 1 2.1 2.1l-.6 8A2 2 0 0 1 16.4 18h-.1" />
      <path d="M12 3v9" />
      <path d="M8 4c1.5 0 4-1 4-1s2.5 1 4 1" />
      <circle cx="12" cy="16" r="1" />
      <path d="M10 7h4" />
    </svg>
  );
}

export function JacketIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>Jacket</title>
      <path d="M16 2H8a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3Z" />
      <path d="M5 10V5" />
      <path d="M19 10V5" />
      <path d="M5 17S7 17 12 17s7 0 7 0" />
      <path d="M12 4s-5 0-5 6v3" />
      <path d="M12 4s5 0 5 6v3" />
      <path d="M10 10v1" />
      <path d="M14 10v1" />
      <path d="M6 8h2" />
      <path d="M16 8h2" />
      <path d="M12 10v4" />
      <path d="M8 17v3" />
      <path d="M16 17v3" />
    </svg>
  );
}

export function HatIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>Hat</title>
      <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V7C21 8.10457 20.1046 9 19 9H5C3.89543 9 3 8.10457 3 7V7Z" />
      <path d="M7 9V15C7 15 12 17 17 15V9" />
      <path d="M12 9v8" />
      <path d="M9 9.5c.5 0 1.5 1 3 1s2.5-1 3-1" />
      <path d="M5 7h14" />
      <path d="M9 5.2C9 4 10.5 3 12 3s3 1 3 2.2" />
    </svg>
  );
}

export function WatchIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>Watch</title>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 10V12l1.5 1.5" />
      <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
      <circle cx="12" cy="12" r="1" />
      <path d="M12 8v1" />
      <path d="M16 12h-1" />
      <path d="M12 16v-1" />
      <path d="M8 12h1" />
    </svg>
  );
}

export function GlassesIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>Glasses</title>
      <circle cx="6" cy="14" r="4" />
      <circle cx="18" cy="14" r="4" />
      <path d="M10 14h4" />
      <path d="M18.5 4h-3" />
      <path d="M5.5 4h3" />
      <path d="M6 10v2" />
      <path d="M18 10v2" />
      <path d="M6 18l-2 2" />
      <path d="M18 18l2 2" />
      <circle cx="6" cy="14" r="1.5" fill="none" />
      <circle cx="18" cy="14" r="1.5" fill="none" />
    </svg>
  );
}

export function AllIcon({ className }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <title>All Categories</title>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <path d="M6.5 3.5v6" />
      <path d="M3.5 6.5h6" />
      <path d="M17.5 5.5l1 2" />
      <path d="M15.5 5.5l1 2" />
      <path d="M16.5 17.5a1 1 0 1 0 2 0 1 1 0 1 0-2 0" />
      <path d="M4.5 17.5h4" />
    </svg>
  );
}