import React from 'react';

/**
 * WaltrMascot Component
 * Faithfully vectorizes the waltr mascot:
 * - Oval face contour
 * - Iconic double-swoop black wavy hair
 * - Double round orange glasses
 * - Expressive contextual poses and accessories for onboarding steps
 */
export default function WaltrMascot({ 
  variant = 'logo', 
  className = '', 
  size = 120 
}) {
  if (variant === 'logo') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none ${className}`}
      >
        {/* Shoulders */}
        <path
          d="M26 95 C28 82, 40 76, 50 76 C60 76, 72 82, 74 95"
          stroke="#171717"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Head Contour */}
        <ellipse
          cx="50"
          cy="48"
          rx="25"
          ry="28"
          fill="#ffffff"
          stroke="#171717"
          strokeWidth="3.5"
        />

        {/* Iconic Wavy Black Hair */}
        <path
          d="M24 38 
             C18 32, 20 18, 30 16 
             C36 14, 43 21, 46 22 
             C49 14, 62 12, 70 18 
             C76 22, 78 30, 71 35 
             C65 40, 58 31, 52 30 
             C46 29, 39 39, 32 40 
             C27 41, 25 40, 24 38 Z"
          fill="#171717"
        />

        {/* Left ear hair curl */}
        <path
          d="M26 36 C22 34, 20 40, 23 44 C25 46, 27 42, 26 36 Z"
          fill="#171717"
        />

        {/* Orange Circular Glasses */}
        {/* Left lens */}
        <circle
          cx="41"
          cy="48"
          r="9.5"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
        />
        {/* Right lens */}
        <circle
          cx="59"
          cy="48"
          r="9.5"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
        />
        {/* Bridge */}
        <line
          x1="50.2"
          y1="48"
          x2="49.8"
          y2="48"
          stroke="#f97316"
          strokeWidth="3"
        />
      </svg>
    );
  }

  // Variant: Welcome / Hello (Waving hand, warm smile)
  if (variant === 'welcome') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          width={size * 1.5}
          height={size * 1.2}
          viewBox="0 0 160 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="select-none drop-shadow-xs"
        >
          {/* Subtle background glow */}
          <circle cx="80" cy="65" r="54" fill="#f5f5f5" />
          <circle cx="80" cy="65" r="48" fill="#fafafa" />

          {/* Body & Shoulders */}
          <path
            d="M52 122 C55 106, 68 100, 80 100 C92 100, 105 106, 108 122"
            stroke="#171717"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Left waving arm & hand */}
          <path
            d="M104 104 C116 98, 126 84, 128 72"
            stroke="#171717"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Hand palm & fingers waving */}
          <path
            d="M128 72 C129 67, 134 66, 136 70 C138 73, 134 77, 131 79 C133 80, 134 83, 131 84"
            stroke="#171717"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Waving motion breeze lines */}
          <path d="M136 60 C140 64, 140 68, 137 72" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <path d="M142 64 C146 68, 146 72, 143 76" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />

          {/* Head Contour */}
          <ellipse
            cx="80"
            cy="62"
            rx="27"
            ry="30"
            fill="#ffffff"
            stroke="#171717"
            strokeWidth="3.5"
          />

          {/* Hair */}
          <path
            d="M52 51 
               C46 45, 48 30, 58 28 
               C65 26, 72 34, 76 35 
               C79 26, 93 24, 102 31 
               C108 35, 110 44, 103 49 
               C96 54, 89 45, 83 44 
               C76 43, 68 53, 61 54 
               C55 55, 53 54, 52 51 Z"
            fill="#171717"
          />
          <path
            d="M54 49 C50 47, 48 53, 51 57 C53 59, 55 55, 54 49 Z"
            fill="#171717"
          />

          {/* Glasses */}
          <circle cx="70" cy="62" r="10.5" fill="none" stroke="#f97316" strokeWidth="3.2" />
          <circle cx="90" cy="62" r="10.5" fill="none" stroke="#f97316" strokeWidth="3.2" />
          <line x1="80.5" y1="62" x2="79.5" y2="62" stroke="#f97316" strokeWidth="3.2" />

          {/* Cute subtle smile */}
          <path
            d="M76 78 Q80 81 84 78"
            stroke="#171717"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Welcome greeting badge bubble */}
          <g transform="translate(18, 14)">
            <rect x="0" y="0" width="46" height="24" rx="12" fill="#171717" />
            <text x="23" y="16" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
              Salut !
            </text>
            <polygon points="36,24 40,28 32,24" fill="#171717" />
          </g>
        </svg>
      </div>
    );
  }

  // Variant: Catalog & Stock Management (Hanger, Price tag FCFA, Stock check)
  if (variant === 'catalog') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          width={size * 1.5}
          height={size * 1.2}
          viewBox="0 0 160 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="select-none drop-shadow-xs"
        >
          {/* Subtle card background */}
          <rect x="25" y="16" width="110" height="98" rx="16" fill="#f5f5f5" />

          {/* Floating Clothes Hanger on left */}
          <g transform="translate(14, 34)">
            {/* Hook */}
            <path d="M22 14 C22 10, 26 8, 28 10 C30 12, 28 16, 25 18" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Triangular hanger */}
            <path d="M10 28 L25 18 L40 28 Z" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" fill="#ffffff" />
            <line x1="10" y1="28" x2="40" y2="28" stroke="#171717" strokeWidth="2.5" />
          </g>

          {/* Floating Price Tag on right */}
          <g transform="translate(112, 32)">
            <rect x="0" y="0" width="34" height="20" rx="4" fill="#ffffff" stroke="#171717" strokeWidth="2" />
            <circle cx="6" cy="10" r="2" fill="#f97316" />
            <text x="19" y="14" fill="#171717" fontSize="8" fontWeight="800" fontFamily="sans-serif">
              FCFA
            </text>
          </g>

          {/* waltr mascot center */}
          <path
            d="M58 122 C61 108, 72 103, 80 103 C88 103, 99 108, 102 122"
            stroke="#171717"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <ellipse
            cx="80"
            cy="66"
            rx="24"
            ry="27"
            fill="#ffffff"
            stroke="#171717"
            strokeWidth="3.5"
          />

          {/* Hair */}
          <path
            d="M55 56 
               C50 51, 51 38, 60 36 
               C66 34, 73 41, 76 42 
               C79 34, 91 32, 99 38 
               C105 42, 106 50, 100 55 
               C94 59, 88 51, 83 50 
               C76 49, 70 58, 63 59 
               C58 60, 56 59, 55 56 Z"
            fill="#171717"
          />

          {/* Glasses */}
          <circle cx="71" cy="66" r="9.5" fill="none" stroke="#f97316" strokeWidth="3" />
          <circle cx="89" cy="66" r="9.5" fill="none" stroke="#f97316" strokeWidth="3" />
          <line x1="80.5" y1="66" x2="79.5" y2="66" stroke="#f97316" strokeWidth="3" />

          {/* Inspecting sparkle over glasses */}
          <circle cx="68" cy="62" r="1.5" fill="#ffffff" />
          <circle cx="86" cy="62" r="1.5" fill="#ffffff" />

          {/* Stock In-control check indicator */}
          <g transform="translate(68, 96)">
            <rect x="0" y="0" width="24" height="15" rx="7.5" fill="#171717" />
            <circle cx="7" cy="7.5" r="3" fill="#10b981" />
            <text x="16" y="11" fill="#ffffff" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
              ✓
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Variant: WhatsApp Automated Orders (Chat bubbles, smartphone, order notification)
  if (variant === 'whatsapp') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          width={size * 1.5}
          height={size * 1.2}
          viewBox="0 0 160 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="select-none drop-shadow-xs"
        >
          {/* Backdrop bubble */}
          <circle cx="80" cy="65" r="54" fill="#f5f5f5" />

          {/* Left WhatsApp message bubble */}
          <g transform="translate(8, 22)">
            <rect x="0" y="0" width="60" height="24" rx="8" fill="#ffffff" stroke="#171717" strokeWidth="1.8" />
            <text x="7" y="15" fill="#171717" fontSize="8" fontWeight="600" fontFamily="sans-serif">
              "Je prends 2 🛍️"
            </text>
            <polygon points="54,24 58,28 50,24" fill="#ffffff" stroke="#171717" strokeWidth="1.8" />
            <circle cx="53" cy="23" r="2" fill="#ffffff" />
          </g>

          {/* Right automated response bubble */}
          <g transform="translate(92, 40)">
            <rect x="0" y="0" width="62" height="24" rx="8" fill="#171717" />
            <text x="7" y="15" fill="#ffffff" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">
              "Confirmé ! ✨"
            </text>
            <polygon points="8,24 4,28 12,24" fill="#171717" />
          </g>

          {/* waltr mascot holding phone */}
          <path
            d="M58 124 C61 110, 72 105, 80 105 C88 105, 99 110, 102 124"
            stroke="#171717"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <ellipse
            cx="80"
            cy="68"
            rx="23"
            ry="26"
            fill="#ffffff"
            stroke="#171717"
            strokeWidth="3.5"
          />

          {/* Hair */}
          <path
            d="M56 58 
               C51 53, 52 41, 61 39 
               C66 37, 73 44, 76 45 
               C79 37, 91 35, 98 40 
               C104 44, 105 52, 99 57 
               C94 61, 88 53, 83 52 
               C76 51, 71 60, 64 61 
               C59 62, 57 61, 56 58 Z"
            fill="#171717"
          />

          {/* Glasses */}
          <circle cx="71" cy="68" r="9" fill="none" stroke="#f97316" strokeWidth="3" />
          <circle cx="89" cy="68" r="9" fill="none" stroke="#f97316" strokeWidth="3" />
          <line x1="80.5" y1="68" x2="79.5" y2="68" stroke="#f97316" strokeWidth="3" />

          {/* Smartphone held in hands */}
          <g transform="translate(71, 95)">
            <rect x="0" y="0" width="18" height="28" rx="4" fill="#ffffff" stroke="#171717" strokeWidth="2.2" />
            <line x1="6" y1="4" x2="12" y2="4" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="14" r="4" fill="#25d366" />
            <rect x="4" y="21" width="10" height="2" rx="1" fill="#e5e5e5" />
          </g>
        </svg>
      </div>
    );
  }

  // Variant: Launch / Ready (Thumbs up, celebratory stars)
  if (variant === 'launch') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          width={size * 1.5}
          height={size * 1.2}
          viewBox="0 0 160 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="select-none drop-shadow-xs"
        >
          {/* Radiating minimalist stars */}
          <g stroke="#f97316" strokeWidth="1.8" strokeLinecap="round">
            <line x1="32" y1="35" x2="32" y2="25" />
            <line x1="27" y1="30" x2="37" y2="30" />

            <line x1="128" y1="35" x2="128" y2="25" />
            <line x1="123" y1="30" x2="133" y2="30" />

            <circle cx="42" cy="50" r="2" fill="#f97316" />
            <circle cx="118" cy="50" r="2" fill="#f97316" />
          </g>

          {/* Mascot Shoulders */}
          <path
            d="M55 122 C58 107, 70 102, 80 102 C90 102, 102 107, 105 122"
            stroke="#171717"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Right arm thumbs up */}
          <path
            d="M102 105 C112 101, 120 92, 122 84"
            stroke="#171717"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Fist and upright thumb */}
          <path
            d="M122 84 C122 76, 126 74, 128 75 C130 77, 128 82, 128 85 C131 85, 134 87, 132 90 C130 92, 125 93, 122 93"
            stroke="#171717"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
          />

          {/* Head Contour */}
          <ellipse
            cx="80"
            cy="63"
            rx="25"
            ry="28"
            fill="#ffffff"
            stroke="#171717"
            strokeWidth="3.5"
          />

          {/* Hair */}
          <path
            d="M54 53 
               C48 48, 49 34, 59 32 
               C65 30, 72 37, 76 38 
               C79 30, 92 28, 100 34 
               C106 38, 107 47, 101 52 
               C95 56, 88 48, 83 47 
               C76 46, 70 55, 63 56 
               C57 57, 55 56, 54 53 Z"
            fill="#171717"
          />

          {/* Glasses */}
          <circle cx="71" cy="63" r="10" fill="none" stroke="#f97316" strokeWidth="3.2" />
          <circle cx="89" cy="63" r="10" fill="none" stroke="#f97316" strokeWidth="3.2" />
          <line x1="80.5" y1="63" x2="79.5" y2="63" stroke="#f97316" strokeWidth="3.2" />

          {/* Confident Smile */}
          <path
            d="M75 79 Q80 84 85 79"
            stroke="#171717"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Minimal 100% ready tag */}
          <g transform="translate(62, 98)">
            <rect x="0" y="0" width="36" height="17" rx="8.5" fill="#171717" />
            <text x="18" y="12" fill="#ffffff" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              Prêt !
            </text>
          </g>
        </svg>
      </div>
    );
  }

  return null;
}
