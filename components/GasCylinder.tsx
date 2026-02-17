
import React from 'react';

interface GasCylinderProps {
  level: number;
  className?: string;
}

const GasCylinder: React.FC<GasCylinderProps> = ({ level, className = "" }) => {
  const fillHeight = Math.max(0, Math.min(100, level));
  
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 160"
        className="w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Valve */}
        <rect x="42" y="5" width="16" height="15" rx="2" fill="#e5e7eb" />
        <rect x="45" y="0" width="10" height="5" rx="1" fill="#4b5563" />
        
        {/* Main Body Background */}
        <rect x="15" y="25" width="70" height="130" rx="35" fill="#e5e7eb" />
        
        {/* Gas Level Fill */}
        <mask id="cylinderMask">
          <rect x="15" y="25" width="70" height="130" rx="35" fill="white" />
        </mask>
        
        <rect
          x="15"
          y={25 + (130 * (1 - fillHeight / 100))}
          width="70"
          height={130 * (fillHeight / 100)}
          fill="#3b82f6"
          mask="url(#cylinderMask)"
          className="transition-all duration-1000 ease-in-out"
        />

        {/* Glossiness/Shadows */}
        <rect x="15" y="25" width="70" height="130" rx="35" fill="none" stroke="#d1d5db" strokeWidth="2" />
        <path d="M40 35 Q50 30 60 35" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    </div>
  );
};

export default GasCylinder;
