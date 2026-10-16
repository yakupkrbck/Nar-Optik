import React from 'react';

interface NarLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NarLogo: React.FC<NarLogoProps> = ({
  className = '',
  size = 48,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Pomegranate with eye pupil icon matching business card */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md"
      >
        {/* Pomegranate crown spikes at top */}
        <path
          d="M 36 28 L 30 14 L 42 22 L 50 11 L 58 22 L 70 14 L 64 28"
          fill="#c1121f"
          stroke="#c1121f"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Outer Pomegranate red ring body */}
        <circle
          cx="50"
          cy="56"
          r="34"
          stroke="#c1121f"
          strokeWidth="11"
          fill="#ffffff"
        />

        {/* Center eye pupil / iris in charcoal dark grey */}
        <circle cx="50" cy="56" r="16" fill="#2b2d42" />

        {/* White eye highlight reflection */}
        <circle cx="44" cy="50" r="4.5" fill="#ffffff" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline text-2xl font-black tracking-tight text-white leading-none">
            <span className="text-[#c1121f] lowercase font-extrabold">nar</span>
            <span className="text-white lowercase ml-1 font-extrabold relative">
              opt
              <span className="relative">
                ı
                {/* Red small pomegranate crown dot above the dot of optik */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#c1121f]" />
              </span>
              k
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase mt-0.5">
            Lens & Gözlük
          </span>
        </div>
      )}
    </div>
  );
};
