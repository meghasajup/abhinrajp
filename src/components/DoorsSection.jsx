import React, { useState, useEffect, useRef } from 'react';
import './DoorPage.css';

export const DOORS_DATA = [
  {
    id: 'web-developer',
    title: 'Web Development',
    plateTop: 'WEB',
    plateBottom: 'DEVELOPER',
    color: '#22304a',
    colorDark: '#1c2840',
    route: '/web-developer/',
    subtitle: 'End to end, from sketch to live site',
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
    plateTop: 'APP',
    plateBottom: 'DEVELOPER',
    color: '#4a3540',
    colorDark: '#3f2d37',
    route: '/app-developer/',
    subtitle: 'From the first idea to the app store',
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
    plateTop: 'UI/UX',
    plateBottom: 'DESIGNER',
    color: '#7a8670',
    colorDark: '#66705d',
    route: '/ui-ux-designer/',
    subtitle: 'Research first, pixels second',
    features: [
      'Brand & business needs analysis',
      'User & competitor research',
      'Information architecture & flows',
      'Wireframes & high-fidelity UI',
      'Interactive prototypes & testing',
    ],
  },
];

export default function DoorsPage({ onNavigate }) {
  const [activeDoor, setActiveDoor] = useState(-1);
  const [openedDoor, setOpenedDoor] = useState(-1);
  const [isPressing, setIsPressing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Heading animation
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef(null);
  const wallRef = useRef(null);
  const unitsRef = useRef([]);
  const [dinfoPos, setDinfoPos] = useState({
    left: 0,
    top: 0,
    width: 340,
    visible: false,
  });

  // Heading animation
  useEffect(() => {
    const headingElement = headingRef.current;
    if (!headingElement) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          observer.unobserve(headingElement);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(headingElement);
    return () => observer.disconnect();
  }, []);

  // Information panel
  useEffect(() => {
    if (activeDoor < 0 || !wallRef.current) {
      setDinfoPos((prev) => ({
        ...prev,
        visible: false,
      }));
      return;
    }

    const wallRect = wallRef.current.getBoundingClientRect();
    const currentUnit = unitsRef.current[activeDoor];
    if (!currentUnit) return;
    const uRect = currentUnit.getBoundingClientRect();
    const toRight = activeDoor < 2;
    let aRect;
    let bRect;
    if (toRight) {
      aRect = unitsRef.current[2]?.getBoundingClientRect() || uRect;
      bRect = unitsRef.current[3]?.getBoundingClientRect() || aRect;
    } else {
      aRect = unitsRef.current[0]?.getBoundingClientRect() || uRect;
      bRect = unitsRef.current[1]?.getBoundingClientRect() || aRect;
    }

    const leftEdge = Math.min(aRect.left, bRect.left);
    const rightEdge = Math.max(aRect.right, bRect.right);
    const cardWidth = Math.min(rightEdge - leftEdge, 24 * 16);
    const targetLeft = leftEdge - wallRect.left + (rightEdge - leftEdge - cardWidth) / 2;
    const targetTop = uRect.top - wallRect.top + uRect.height * 0.46 - 110;

    setDinfoPos({
      left: targetLeft,
      top: targetTop,
      width: cardWidth,
      visible: true,
    });
  }, [activeDoor]);


  // Door click and navigation
  const handleDoorClick = (index, e) => {
    if (e) e.stopPropagation();
    if (openedDoor >= 0) return;
    setActiveDoor(index);
    setIsPressing(true);
    setOpenedDoor(index);

    // Brass latch sound
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(340, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(
            120,
            ctx.currentTime + 0.14
          );
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.2
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        }
      } catch { }
    }

    // Navigate after opening animation
    setTimeout(() => {
      setIsPressing(false);
      if (onNavigate) {
        onNavigate(DOORS_DATA[index].route);
      }
      setTimeout(() => {
        setOpenedDoor(-1);
        setActiveDoor(-1);
      }, 600);
    }, 760);
  };

  // Keyboard controls
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDoorClick(index, e);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();

      setActiveDoor((prev) =>
        prev < 0 ? 0 : (prev + 1) % DOORS_DATA.length
      );
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();

      setActiveDoor((prev) =>
        prev < 0
          ? DOORS_DATA.length - 1
          : (prev - 1 + DOORS_DATA.length) % DOORS_DATA.length
      );
    } else if (e.key === 'Escape') {
      setActiveDoor(-1);
    }
  };

  // Render
  return (
    <div className="relative h-screen max-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col overflow-hidden select-none transition-colors duration-500 m-0 p-0">
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-0 flex flex-col flex-1 min-h-0 items-center">
        {/* Heading */}
        <h1 ref={headingRef} className={`doors-heading ${headingVisible ? 'doors-heading-visible' : ''}`} aria-label="Magic happens behind the doors">
          {"Magic happens behind the doors".split("").map(
            (letter, index) => (
              <span key={index} className="doors-heading-letter"
                style={{ transitionDelay: `${index * 0.035}s`, }} aria-hidden="true">
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            )
          )}
        </h1>

        {/* Doors Row */}
        <div ref={wallRef} role="region" aria-label="Available services" className={`relative w-full max-w-6xl flex flex-1 min-h-0 items-end justify-center gap-3 sm:gap-5 md:gap-7 lg:gap-8 pb-0 mt-auto ${activeDoor >= 0 ? 'doors-focus' : ''
          }`} onMouseLeave={() => {
            if (openedDoor < 0) {
              setActiveDoor(-1);
            }
          }}
        >

          {/* Information panel */}
          {activeDoor >= 0 && (
            <div role="tooltip" className={`dinfo hidden lg:block ${dinfoPos.visible ? 'on' : ''}`}
              style={{
                left: `${dinfoPos.left}px`,
                top: `${dinfoPos.top}px`,
                width: `${dinfoPos.width}px`,
              }}
            >
              <h3 className="dinfo__h"> {DOORS_DATA[activeDoor].title} </h3>
              <p className="dinfo__t">{DOORS_DATA[activeDoor].subtitle}</p>
              <ul className="dinfo__p">
                {DOORS_DATA[activeDoor].features.map(
                  (feature, fIdx) => (
                    <li key={fIdx}>{feature}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Three doors */}
          {DOORS_DATA.map((door, idx) => {
            const isHovered = activeDoor === idx;
            const isOpened = openedDoor === idx;
            const isPress = isPressing && activeDoor === idx;

            return (
              <div key={door.id} ref={(el) => (unitsRef.current[idx] = el)} className={`unit ${isHovered ? 'on' : ''} ${isPress ? 'press' : ''}`}
                style={{
                  '--door': door.color,
                  '--door-dk': door.colorDark,
                }}
              >
                <button type="button" tabIndex={0} aria-label={`Open the ${door.title} door`} aria-expanded={isOpened} className="doorway" onMouseEnter={() => setActiveDoor(idx)} onFocus={() => setActiveDoor(idx)} onBlur={() => setActiveDoor(-1)} onClick={(e) => handleDoorClick(idx, e)} onKeyDown={(e) => handleKeyDown(e, idx)}>
                  {/* Oiter arch */}
                  <span className="casing"></span>
                  {/* Door opening */}
                  <span className="opening">
                    <span className="room"></span>
                    {/* 3D door panel */}
                    <span className="door" style={{ transform: isOpened ? 'rotateY(72deg)' : isHovered ? 'rotateY(16deg)' : 'rotateY(0deg)', }}>
                      {/* Fluted panel */}
                      <span className="door__flute"></span>
                      {/* Nameplate */}
                      <span className="plate">
                        <span>{door.plateTop}</span>
                        <br />
                        <span>{door.plateBottom}</span>
                      </span>
                      {/* Handle */}
                      <span className="handle">
                        <span className="handle__lever"></span>
                        <span className="handle__lock"></span>
                      </span>
                    </span>
                    {/* Click to enter label */}
                    <span className="click-to-enter">
                      Click to enter
                    </span>
                    {/* Threshold */}
                    <span className="sill"></span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile imfo panel */}
        {activeDoor >= 0 && (
          <div className="w-full max-w-md lg:hidden mt-4 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 shadow-xl">
            <h3 className="text-xl font-bold mb-1 text-[var(--foreground)]">
              {DOORS_DATA[activeDoor].title}
            </h3>
            <p className="text-xs font-mono uppercase text-[#a88a4b] mb-2">
              {DOORS_DATA[activeDoor].subtitle}
            </p>
            <div className="space-y-1.5 border-t border-neutral-200 dark:border-neutral-800 pt-2">
              {DOORS_DATA[activeDoor].features.map((feature, i) => (
                <div key={i} className="flex items-center text-xs text-neutral-700 dark:text-neutral-300">
                  <span className="mr-2 text-[#a88a4b] font-bold">
                    ✔
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Baseboard */}
      <footer className="architectural-baseboard w-full relative z-30 flex-shrink-0 pointer-events-none select-none">
        <div className="baseboard-gold-line" />
        <div className="baseboard-upper" />
        <div className="baseboard-main" />
        <div className="baseboard-lower" />
        <div className="baseboard-shadow" />
      </footer>

      {/* Scroll to top */}
      <div className="fixed bottom-6 right-6 z-40">
        <button type="button" onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
          className="w-10 h-10 rounded-full bg-neutral-950 text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Scroll to top"
        >
          <svg
            className="w-4 h-4 fill-none stroke-current stroke-2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>

    </div>
  );
}
