import React, { useState, useEffect, useRef } from 'react';
import { History } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

//ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TIMELINE_STEPS = [
  {
    id: 1,
    year: '2026',
    period: 'OCT 2026 — NOW',
    badge: 'CURRENT FOCUS',
    role: 'Independent freelancer',
    org: 'Working for myself, remote-first',
    angle: 45,
    bullets: [
      'Websites, iOS apps, interfaces and brand creatives, carried from the first sketch to launch.',
      'Working directly with clients, wherever they are.'
    ]
  },
  {
    id: 2,
    year: '2026',
    period: 'JUL 2026 — SEP 2026',
    badge: 'DESIGN',
    role: 'Graphic designer',
    org: 'Himspring LLC',
    angle: 135,
    bullets: [
      'Managed visual content across social media handles for real estate, luxury water bottle and clothing brands.',
      'Designed social media creatives, stories and carousels in'
    ]
  },
  {
    id: 3,
    year: '2024',
    period: 'FREELANCE',
    badge: 'INTERNATIONAL',
    role: 'Web Developer',
    org: 'International Client Projects (UAE)',
    angle: 225,
    bullets: [
      'Designed and developed a corporate web platform for a UAE-based company.',
      'Delivered modern and responsive solutions based on client requirements.'
    ]
  },
  {
    id: 4,
    year: '2023',
    period: 'EDUCATION',
    badge: 'FOUNDATION',
    role: 'Bachelor of Computer Applications (BCA)',
    org: 'BCA Graduate (2026) · 10+ Projects Built',
    angle: 315,
    bullets: [
      'Rigorous computer science foundations: data structures, algorithms, system architecture.',
      'Built 10+ complete full-stack and software projects throughout academic journey.'
    ]
  }
];

const AMBIENT_GRADIENTS = [
  'radial-gradient(circle at 25% 25%, rgba(255, 175, 120, 0.42) 0%, rgba(255, 215, 175, 0.18) 38%, transparent 68%)',
  'radial-gradient(circle at 25% 25%, rgba(255, 160, 140, 0.38) 0%, rgba(255, 205, 190, 0.16) 38%, transparent 68%)',
  'radial-gradient(circle at 25% 25%, rgba(255, 190, 150, 0.38) 0%, rgba(255, 220, 180, 0.16) 38%, transparent 68%)',
  'radial-gradient(circle at 25% 25%, rgba(160, 185, 220, 0.38) 0%, rgba(200, 218, 240, 0.16) 38%, transparent 68%)'
];

function OdometerReel({ digit }) {
  const num = parseInt(digit, 10);
  const isValid = !isNaN(num);

  if (!isValid) {
    return <span className="inline-block">{digit}</span>;
  }

  return (
    <span className="inline-block h-[1em] overflow-hidden leading-none relative align-baseline">
      <span className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ transform: `translateY(-${num * 10}%)` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1em] flex items-center justify-center select-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function YearDisplay({ value }) {
  const isNumeric = /^\d{4}$/.test(String(value));

  if (isNumeric) {
    const digits = String(value).split('');
    return (
      <div className="flex items-center justify-center text-6xl sm:text-7xl lg:text-[7.5rem] font-black tracking-tight text-[#171717] dark:text-white leading-none select-none font-sans">
        {digits.map((d, i) => (
          <OdometerReel key={i} digit={d} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#171717] dark:text-white leading-none select-none uppercase px-4 text-center transition-all duration-500">
      {value}
    </div>
  );
}

export default function StorySection() {
  const [activeStep, setActiveStep] = useState(0);
  // Animation & Layout Refs
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightColRef = useRef(null);
  const dialRef = useRef(null);
  const spineFillRef = useRef(null);
  const itemRefs = useRef([]);

  // Refs for the 3 expanding clock layers
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);

  const currentStep = TIMELINE_STEPS[activeStep];
  const displayYear = currentStep.year || (currentStep.period.match(/\b(20\d\d)\b/)?.[1]) || currentStep.period;

  //GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        // Pin the Left Panel
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: leftPanelRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        });

        //Circular Dial Rotation
        if (dialRef.current) {
          gsap.to(dialRef.current, {
            rotation: 90,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            }
          });
        }

        //Clock Expansion
        if (ring1Ref.current && ring2Ref.current && ring3Ref.current && containerRef.current) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            }
          });

          tl.to(ring1Ref.current, { scale: 1.15, transformOrigin: 'center center', ease: 'none' }, 0)
            .to(ring2Ref.current, { scale: 1.25, transformOrigin: 'center center', ease: 'none' }, 0)
            .to(ring3Ref.current, { scale: 1.35, transformOrigin: 'center center', ease: 'none' }, 0);
        }

        if (spineFillRef.current && rightColRef.current) {
          gsap.to(spineFillRef.current, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: rightColRef.current,
              start: 'top 40%',
              end: 'bottom 60%',
              scrub: true,
            }
          });
        }
      });

      // Scroll-Triggered 
      itemRefs.current.forEach((el, index) => {
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });

    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const handleStepClick = (index) => {
    const target = itemRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section ref={sectionRef} id="about" className="relative w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#0c0d10] text-[#171717] dark:text-[#f3f4f6] transition-colors duration-700">
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.02] mix-blend-multiply dark:mix-blend-overlay z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      {/* Top-left shade */}
      <div className="absolute top-0 left-0 w-[500px] sm:w-[700px] h-full pointer-events-none blur-3xl transition-all duration-1000 ease-out z-0 opacity-70 dark:opacity-30" style={{ background: 'radial-gradient(circle at 0% 15%, rgba(255, 150, 90, 0.35) 0%, rgba(255, 200, 150, 0.12) 40%, transparent 70%)' }} />
      {/* Bottom-right shade */}
      <div className="absolute bottom-0 right-0 w-[500px] sm:w-[700px] h-full pointer-events-none blur-3xl transition-all duration-1000 ease-out z-0 opacity-70 dark:opacity-30" style={{ background: 'radial-gradient(circle at 100% 85%, rgba(255, 140, 80, 0.3) 0%, rgba(255, 190, 130, 0.1) 40%, transparent 70%)' }} />
      {/* Active Step-based Dynamic Glow Accent */}
      <div className="absolute top-1/3 left-1/4 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full pointer-events-none blur-3xl transition-all duration-1000 ease-out z-0 opacity-50" style={{ background: AMBIENT_GRADIENTS[activeStep] || AMBIENT_GRADIENTS[0] }} />
      {/* Main Split Screen Container */}
      <div ref={containerRef} className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start z-10">
        {/* Left column */}
        <div ref={leftPanelRef} className="w-full lg:w-1/2 lg:min-h-screen lg:flex lg:flex-col lg:justify-center py-16 lg:py-0 pr-0 lg:pr-12 select-none">
          {/* Centerpiece */}
          <div className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-square flex flex-col justify-center my-2 mx-auto p-8">
            <svg
              ref={dialRef}
              className="absolute inset-0 w-full h-full pointer-events-none origin-center overflow-visible"
              viewBox="0 0 400 400"
            >
              {/* Layer 1 (Inner Circle) */}
              <circle ref={ring1Ref} cx="200" cy="200" r="135" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-[#e5e7eb] dark:text-white/10 origin-center" />
              {/* Layer 2 (Middle Circle) */}
              <circle ref={ring2Ref} cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 5" className="text-[#d4d4d8] dark:text-white/15 origin-center" />
              {/* Layer 3 (Outer Circle) */}
              <circle ref={ring3Ref} cx="200" cy="200" r="185" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#e5e7eb] dark:text-white/10 origin-center" />

              <line x1="200" y1="10" x2="200" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-[#a1a1aa] dark:text-white/30" />
              <line x1="200" y1="376" x2="200" y2="390" stroke="currentColor" strokeWidth="1.5" className="text-[#a1a1aa] dark:text-white/30" />
              <line x1="10" y1="200" x2="24" y2="200" stroke="currentColor" strokeWidth="1.5" className="text-[#a1a1aa] dark:text-white/30" />
              <line x1="376" y1="200" x2="390" y2="200" stroke="currentColor" strokeWidth="1.5" className="text-[#a1a1aa] dark:text-white/30" />

              <g>
                {Array.from({ length: 72 }).map((_, i) => {
                  const angle = (i * 360) / 72;
                  const isMajor = i % 6 === 0;
                  const isMid = i % 3 === 0;
                  const len = isMajor ? 12 : isMid ? 8 : 5;
                  const strokeWidth = isMajor ? 1.5 : isMid ? 1 : 0.75;
                  return (
                    <line
                      key={i}
                      x1="200"
                      y1="16"
                      x2="200"
                      y2={16 + len}
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      className={isMajor ? 'text-[#a1a1aa] dark:text-white/40' : 'text-[#d4d4d8] dark:text-white/20'}
                      transform={`rotate(${angle} 200 200)`}
                    />
                  );
                })}
              </g>

              <text x="200" y="38" textAnchor="middle" className="text-[7px] font-mono fill-[#a1a1aa] dark:fill-white/30 select-none">000°</text>
              <text x="368" y="203" textAnchor="middle" className="text-[7px] font-mono fill-[#a1a1aa] dark:fill-white/30 select-none">090°</text>
              <text x="200" y="372" textAnchor="middle" className="text-[7px] font-mono fill-[#a1a1aa] dark:fill-white/30 select-none">180°</text>
              <text x="32" y="203" textAnchor="middle" className="text-[7px] font-mono fill-[#a1a1aa] dark:fill-white/30 select-none">270°</text>
            </svg>

            {/* Content inside the circle */}
            <div className="relative z-10 flex flex-col items-start px-8 sm:px-10">
              {/* My story */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#171717]/80 dark:bg-white/80" />
                <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#737373] dark:text-[#a1a1aa] uppercase font-semibold">
                  My story
                </span>
              </div>

              {/* Main Heading inside circle */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] dark:text-white leading-[1.1] mb-3">
                Let's go back in time.
              </h2>

              {/* Year */}
              <div className="my-1">
                <YearDisplay value={displayYear} />
              </div>

              {/* Period & Counter matching */}
              <div className="w-full flex items-center justify-between font-mono text-[11px] sm:text-xs tracking-widest text-[#71717a] dark:text-[#a1a1aa] uppercase font-medium mt-3 pt-3 border-t border-[#171717]/10 dark:border-white/10">
                <span>{currentStep.period.toUpperCase()}</span>
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-[#71717a]" />
                  <span>0{activeStep + 1} / 0{TIMELINE_STEPS.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Step Buttons Below Dial */}
          <div className="w-full max-w-[380px] sm:max-w-[440px] mx-auto px-4 mt-4 flex justify-center gap-2">
            {TIMELINE_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${activeStep === idx
                    ? 'bg-[#171717] dark:bg-white text-white dark:text-black shadow-sm scale-105'
                    : 'bg-black/5 dark:bg-white/10 text-[#71717a] hover:text-[#171717] dark:hover:text-white'
                  }`}
                aria-label={`Jump to step 0${step.id}`}
              >
                0{step.id}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div ref={rightColRef} className="w-full lg:w-1/2 lg:ml-auto relative py-12 lg:pt-[25vh] lg:pb-24 pl-6 sm:pl-10 lg:pl-16">
          {/* Vertical Timeline Spine Line */}
          <div className="absolute left-3 sm:left-4 lg:left-6 top-16 bottom-24 w-[1px] bg-[#e5e7eb] dark:bg-white/10">
            <div ref={spineFillRef} className="w-full bg-[#171717] dark:bg-white origin-top h-0"/>
          </div>

          {/* Timeline Items Stack */}
          <div className="flex flex-col gap-24 sm:gap-32">
            {TIMELINE_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.id}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => handleStepClick(idx)}
                  className={`timeline-item relative pl-8 sm:pl-12 cursor-pointer transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                    }`}
                >
                  {/* Timeline Node on Spine */}
                  <div className="absolute left-[-24px] sm:left-[-32px] lg:left-[-40px] top-1.5 flex items-center justify-center">
                    {isActive ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center border border-emerald-500/50 bg-emerald-500/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#d4d4d8] dark:bg-white/20 transition-all duration-300" />
                      </div>
                    )}
                  </div>

                  {/* Period Tag */}
                  <div className="text-xs font-mono font-medium tracking-widest text-[#71717a] dark:text-[#a1a1aa] uppercase mb-2">
                    {step.period}
                  </div>

                  {/* Role Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold tracking-tight text-[#171717] dark:text-white mb-2 leading-snug">
                    {step.role}
                  </h3>

                  {/* Organization */}
                  <p className="text-sm sm:text-base text-[#525252] dark:text-[#a1a1aa] font-medium mb-6">
                    {step.org}
                  </p>

                  {/* Editorial Bullets */}
                  <ul className="space-y-3 max-w-xl">
                    {step.bullets.map((b, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 text-sm sm:text-[15px] leading-relaxed text-[#525252] dark:text-[#cbd5e1]"
                      >
                        <span className="text-[#a1a1aa] select-none mt-0.5 font-mono">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}