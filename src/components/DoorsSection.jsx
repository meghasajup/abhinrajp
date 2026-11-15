import React, { useState } from 'react';

const DOORS_DATA = [
  {
    id: 'web-developer',
    title: 'Web Development',
    plate: 'WEB DEVELOPER',
    color: '#22304a',
    route: '/web-developer/',
    subtitle: 'END TO END, FROM SKETCH TO LIVE SITE',
    features: [
      'Discovery & planning',
      'UX & visual design',
      'Front-end & back-end development',
      'Technical SEO & performance',
      'Analytics, launch & ongoing support',
    ],
  },
  {
    id: 'app-developer',
    title: 'App Development',
    plate: 'APP DEVELOPER',
    color: '#4a3540',
    route: '/developer/',
    subtitle: 'FROM THE FIRST IDEA TO THE APP STORE',
    features: [
      'Product scoping & user flows',
      'Interface design',
      'Cross-platform development',
      'Device testing & store launch',
      'Analytics, monitoring & updates',
    ],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Design',
    plate: 'UI/UX DESIGNER',
    color: '#5a6d57',
    route: '/developer/',
    subtitle: 'RESEARCH FIRST, PIXELS SECOND',
    features: [
      'Brand & business needs analysis',
      'User & competitor research',
      'Information architecture & flows',
      'Wireframes & high-fidelity UI',
      'Interactive prototypes & testing',
    ],
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Design',
    plate: 'GRAPHIC DESIGNER',
    color: '#8c5332',
    route: '/developer/',
    subtitle: 'VISUAL CONTENT TRUE TO THE BRAND',
    features: [
      'Brand, audience & tone analysis',
      'Built around brand guidelines',
      'Posters & social media creatives',
      'Strong type & clear hierarchy',
      'Every format each platform needs',
    ],
  },
];

export default function DoorsPage({ onNavigate }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openedDoorIndex, setOpenedDoorIndex] = useState(null);
  const [isPressing, setIsPressing] = useState(false);

  const handleOpenDoor = (index, e) => {
    e.stopPropagation();
    setHoveredIndex(index);
    setIsPressing(true);
    setOpenedDoorIndex(index);

    setTimeout(() => {
      if (onNavigate) {
        onNavigate(DOORS_DATA[index].route);
      }
      setTimeout(() => {
        setOpenedDoorIndex(null);
        setIsPressing(false);
      }, 500);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-24 px-4 sm:px-8 md:px-14 flex flex-col justify-center items-center overflow-hidden">
      <div className="max-w-[75rem] w-full mx-auto flex flex-col items-center justify-center z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-full overflow-x-hidden px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] whitespace-nowrap">
            Magic happens behind the doors
          </h2>
        </div>

        {/* Doors Container */}
        <div 
          className="relative flex items-end gap-5 sm:gap-7 md:gap-9 justify-center w-full max-w-5xl perspective-[1200px]"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {DOORS_DATA.map((door, idx) => {
            const isHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;
            const isOpened = openedDoorIndex === idx;

            return (
              <div key={door.id} className="relative flex flex-col items-center">
                
                {/* Description Popup */}
                {isHovered && (
                  <div 
                    className={`hidden md:flex flex-col justify-center absolute top-1/2 -translate-y-1/2 w-[285px] z-30 p-2 pointer-events-none transition-all duration-300 ${
                      idx >= 2 ? 'right-[calc(100%+2rem)]' : 'left-[calc(100%+2rem)]'
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">{door.title}</h3>
                    <p className="text-[10px] font-mono tracking-wider text-[var(--muted)] mb-5 uppercase">{door.subtitle}</p>
                    <ul className="space-y-2.5">
                      {door.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center text-xs sm:text-sm text-[var(--foreground)] opacity-80">
                          <span className="mr-2 text-[var(--accent)]">✔</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Door Item */}
                <div 
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onClick={() => setHoveredIndex(idx)}
                  className={`relative flex flex-col items-center cursor-pointer transition-all duration-500 w-[150px] sm:w-[185px] md:w-[220px] z-10 ${
                    isAnyHovered 
                      ? (isHovered ? 'opacity-100 scale-105' : 'opacity-25') 
                      : 'opacity-100'
                  }`}
                >
                  <div className="relative w-full aspect-[1/2.0] rounded-t-[140px] p-3 sm:p-3.5 bg-neutral-200 dark:bg-neutral-800 shadow-[0_25px_50px_rgba(0,0,0,0.18)] border-2 border-white dark:border-neutral-700 flex flex-col">
                    <div className="absolute inset-3 sm:inset-3.5 rounded-t-[125px] bg-neutral-950 flex flex-col items-center justify-center p-2 text-center overflow-hidden">
                      <span className="text-[10px] font-mono text-[#c9a96e] font-semibold tracking-widest uppercase animate-pulse">
                        ENTER →
                      </span>
                    </div>

                    <div 
                      className="relative w-full h-full rounded-t-[125px] shadow-2xl flex flex-col justify-between py-10 px-3.5 border border-white/20 overflow-hidden transition-all duration-500 origin-left"
                      style={{
                        backgroundColor: door.color,
                        transform: isOpened 
                          ? 'perspective(1000px) rotateY(-80deg)' 
                          : isHovered 
                            ? 'perspective(1000px) rotateY(25deg)' 
                            : 'perspective(1000px) rotateY(0deg)',
                      }}
                    >
                      <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-25">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="w-[1px] h-full bg-black/50 shadow-sm" />
                        ))}
                      </div>

                      {isHovered && (
                        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 bg-neutral-950/90 border border-[#c9a96e]/60 px-3 py-1.5 rounded-[4px] shadow-lg pointer-events-none whitespace-nowrap z-20">
                          <span className="text-[9px] sm:text-[10px] font-mono text-[#c9a96e] tracking-widest uppercase font-semibold">
                            Click to enter
                          </span>
                        </div>
                      )}

                      <div className="relative z-10 px-2.5 py-2 rounded-[4px] text-[10px] sm:text-xs font-bold tracking-wider uppercase text-center mt-10 shadow-md border border-[#dfcda4] bg-gradient-to-r from-[#dfcda4] via-[#c9a96e] to-[#8a6a2c] text-neutral-950 mx-auto w-[90%]">
                        {door.plate}
                      </div>

                      <div 
                        onClick={(e) => handleOpenDoor(idx, e)}
                        className="relative z-10 self-end mr-3 sm:mr-5 flex flex-col items-center my-auto group/handle cursor-pointer"
                        title={`Open the ${door.title} door`}
                      >
                        <div className={`w-8 sm:w-11 h-3 rounded-full bg-gradient-to-r from-[#f5ebd6] via-[#dfcda4] to-[#8a6a2c] shadow-[0_2px_5px_rgba(0,0,0,0.3)] transition-transform duration-200 ${
                          isPressing && isHovered ? 'rotate-12 translate-y-1' : 'group-hover/handle:-rotate-6'
                        }`} />
                        <div className="w-4 h-4.5 bg-gradient-to-b from-[#dfcda4] to-[#8a6a2c] rounded-b-md -mt-0.5 flex items-center justify-center shadow-inner border border-[#f5ebd6]/40">
                          <div className="w-1 h-2 bg-neutral-950 rounded-full" />
                        </div>
                      </div>

                      <div className="w-full h-3.5 bg-black/30 rounded-sm mt-auto" />
                    </div>
                  </div>

                  <span className={`text-xs sm:text-sm font-semibold tracking-wide mt-4 text-center transition-colors ${
                    isHovered ? 'text-[var(--foreground)] font-bold' : 'text-[var(--muted)]'
                  }`}>
                    {door.title}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}