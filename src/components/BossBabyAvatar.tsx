import React from 'react';

interface BossBabyAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const BossBabyAvatar: React.FC<BossBabyAvatarProps> = ({
  size = 'md',
  className = '',
  animate = false,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-300 p-1 shadow-md border-2 border-amber-400 overflow-hidden ${sizeMap[size]} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${animate ? 'animate-bounce' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cute Baby Head */}
        <circle cx="50" cy="46" r="32" fill="#FDE2CD" />
        {/* Blonde Slicked Hair */}
        <path
          d="M26 38 C32 18, 68 18, 74 38 C70 28, 55 24, 45 27 C35 29, 28 34, 26 38 Z"
          fill="#F5D061"
        />
        <path
          d="M48 24 C52 18, 58 19, 62 23 C58 23, 53 23, 48 24 Z"
          fill="#E5B83B"
        />
        {/* Big expressive Boss Eyes */}
        <ellipse cx="38" cy="45" rx="5.5" ry="7" fill="#2C3E50" />
        <ellipse cx="62" cy="45" rx="5.5" ry="7" fill="#2C3E50" />
        {/* Eye sparkles */}
        <circle cx="36.5" cy="42.5" r="2" fill="white" />
        <circle cx="60.5" cy="42.5" r="2" fill="white" />
        <circle cx="40" cy="48" r="1" fill="white" />
        <circle cx="64" cy="48" r="1" fill="white" />
        {/* Confident Boss Eyebrows */}
        <path
          d="M32 37 Q39 34 44 38"
          stroke="#B7892F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M68 37 Q61 34 56 38"
          stroke="#B7892F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Tiny Button Nose */}
        <ellipse cx="50" cy="51" rx="2" ry="1.5" fill="#E8A882" />
        {/* Confident Smirk / Smile */}
        <path
          d="M42 57 Q50 63 58 56"
          stroke="#C0392B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Rosy Cheeks */}
        <circle cx="30" cy="52" r="4.5" fill="#FF8A80" opacity="0.45" />
        <circle cx="70" cy="52" r="4.5" fill="#FF8A80" opacity="0.45" />

        {/* Executive Black Suit & White Shirt Collar */}
        <path
          d="M20 90 L30 72 L70 72 L80 90 Z"
          fill="#1E293B"
        />
        <polygon points="40,72 50,82 60,72" fill="#FFFFFF" />
        {/* Signature Yellow/Gold Tie */}
        <polygon points="47,75 53,75 55,87 50,91 45,87" fill="#F1C40F" />
        <line x1="47" y1="79" x2="53" y2="79" stroke="#D4AC0D" strokeWidth="1" />
        <line x1="46" y1="83" x2="54" y2="83" stroke="#D4AC0D" strokeWidth="1" />
      </svg>
    </div>
  );
};
