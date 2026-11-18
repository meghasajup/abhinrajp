import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PROJECTS = [
  {
    id: 'expense-tracker',
    num: '01 / 04',
    title: 'Expense Tracker',
    category: 'IOS APP · FINANCE',
    subtitle: 'Personal finance, organised into books',
    description:
      'Spending is grouped into expense books such as Personal, Travel and Business, each with its own budget. Add income or an expense in a couple of taps, see the balance, spend and budget used at a glance, and search across every entry.',
    tags: ['Budgets', 'Expense books', 'Shortcuts & Back Tap'],
    badge: 'Screen recording on iPhone',
    iconUrl: '/images/apps/icon-expense-tracker.png',
    phoneUrl: '/images/apps/phone-expense-tracker.png',
    reverse: false,
  },
  {
    id: 'secret-vault',
    num: '02 / 04',
    title: 'Secret Vault',
    category: 'IOS APP · PRIVACY',
    subtitle: 'A photo vault disguised as a calculator',
    description:
      'It looks and works like an ordinary calculator. Type your secret equation and double-tap % to open a private vault; photos you import are hidden there and can be removed from your photo library.',
    tags: ['Privacy', 'Equation passcode', 'Photos access'],
    badge: 'Recorded on iPhone with sample photos',
    iconUrl: '/images/apps/icon-secret-vault.png',
    phoneUrl: '/images/apps/phone-secret-vault.png',
    reverse: true,
  },
  {
    id: 'brick-breaker',
    num: '03 / 04',
    title: 'Brick Breaker',
    category: 'IOS GAME · ARCADE',
    subtitle: 'Arcade game with pixel-art levels',
    description:
      'A fast arcade brick breaker: pixel-art levels, multi-ball power-ups that flood the screen, combos and a live score, with a pause menu and level-by-level progression.',
    tags: ['Game design', 'Power-ups', 'Level design'],
    badge: 'Gameplay recorded on iPhone',
    iconUrl: '/images/apps/icon-brick-breaker.png',
    phoneUrl: '/images/apps/phone-brick-breaker.png',
    reverse: false,
  },
  {
    id: 'dice',
    num: '04 / 04',
    title: 'Dice',
    category: 'IOS APP · UTILITY',
    subtitle: 'A colourful dice roller',
    description:
      'Roll several dice at once: each die fits its own block of colour and the total updates instantly, so a board-game night needs nothing but a phone.',
    tags: ['Utility', 'Minimal UI', 'Tap to roll'],
    badge: 'Screen recording on iPhone',
    iconUrl: '/images/apps/icon-dice.png',
    phoneUrl: '/images/apps/phone-dice.png',
    reverse: true,
  },
];

export default function AppDevelopment({
  onNavigate = () => {},
  onOpenContact = () => {},
}) {
  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Always start this page from the top
  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });
  }, []);

  // Cinematic page entrance through the door portal
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.94, borderRadius: '48px' },
        {
          opacity: 1,
          scale: 1,
          borderRadius: '0px',
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => {
            // CRITICAL: Clear transform and willChange so container does NOT act as a
            // containing block for ScrollTrigger position:fixed pinning.
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                clearProps: 'transform,borderRadius',
              });
              containerRef.current.style.willChange = 'auto';
            }
            ScrollTrigger.refresh();
          },
        }
      );
    }
  }, []);

  const handleBackClick = (e) => {
    if (e) e.preventDefault();
    if (isLeaving) return;
    setIsLeaving(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !containerRef.current) {
      onNavigate('/', { doorIndex: 0, isBack: true });
      return;
    }

    if (window.scrollY > 100) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.94,
      borderRadius: '48px',
      duration: 0.38,
      ease: 'power2.in',
      onComplete: () => {
        onNavigate('/', { doorIndex: 0, isBack: true });
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Stacked Card Scrub Animation matching reference video exactly
  useEffect(() => {
    if (!cardsContainerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const overlays = overlayRefs.current.filter(Boolean);
      const totalCards = cards.length;

      if (totalCards <= 1) return;

      const mm = gsap.matchMedia();

      // Desktop and Tablet
      mm.add('(min-width: 768px)', () => {
        cards.forEach((card, i) => {
          gsap.set(card, {
            top: 0,
            left: '50%',
            xPercent: -50,
            x: 0,
            transformOrigin: 'top center',
            force3D: true,
          });

          if (i > 0) {
            gsap.set(card, {
              yPercent: 100,
              scale: 1,
              y: 0,
              opacity: 1,
            });
          } else {
            gsap.set(card, {
              yPercent: 0,
              scale: 1,
              y: 0,
              opacity: 1,
            });
          }
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top top+=90',
            end: () => `+=${window.innerHeight * (totalCards - 1)}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < totalCards; i++) {
          const stepLabel = `step-${i}`;

          // Active incoming card smoothly slides upward to stack on top
          tl.to(
            cards[i],
            {
              yPercent: 0,
              ease: 'none',
              duration: 1,
            },
            stepLabel
          );

          // All cards underneath progressively scale down, shift upward, and dim
          for (let p = 0; p < i; p++) {
            const depth = i - p;
            const targetScale = Math.max(0.88, 1 - depth * 0.04);
            const targetY = -depth * 14;
            const targetOverlay = Math.min(0.35, depth * 0.12);

            tl.to(
              cards[p],
              {
                scale: targetScale,
                y: targetY,
                ease: 'none',
                duration: 1,
              },
              stepLabel
            );

            if (overlays[p]) {
              tl.to(
                overlays[p],
                {
                  opacity: targetOverlay,
                  ease: 'none',
                  duration: 1,
                },
                stepLabel
              );
            }
          }
        }
      });

      // Mobile
      mm.add('(max-width: 767px)', () => {
        cards.forEach((card, i) => {
          gsap.set(card, {
            top: 0,
            left: '50%',
            xPercent: -50,
            x: 0,
            transformOrigin: 'top center',
            force3D: true,
          });

          if (i > 0) {
            gsap.set(card, {
              yPercent: 100,
              scale: 1,
              y: 0,
              opacity: 1,
            });
          } else {
            gsap.set(card, {
              yPercent: 0,
              scale: 1,
              y: 0,
              opacity: 1,
            });
          }
        });

        const tlMobile = gsap.timeline({
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top top+=70',
            end: () => `+=${window.innerHeight * (totalCards - 1)}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < totalCards; i++) {
          const stepLabel = `mob-step-${i}`;

          tlMobile.to(
            cards[i],
            {
              yPercent: 0,
              ease: 'none',
              duration: 1,
            },
            stepLabel
          );

          for (let p = 0; p < i; p++) {
            const depth = i - p;
            const targetScale = Math.max(0.92, 1 - depth * 0.03);
            const targetY = -depth * 8;
            const targetOverlay = Math.min(0.3, depth * 0.1);

            tlMobile.to(
              cards[p],
              {
                scale: targetScale,
                y: targetY,
                ease: 'none',
                duration: 1,
              },
              stepLabel
            );

            if (overlays[p]) {
              tlMobile.to(
                overlays[p],
                {
                  opacity: targetOverlay,
                  ease: 'none',
                  duration: 1,
                },
                stepLabel
              );
            }
          }
        }
      });
    }, containerRef);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    const handleWindowLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleWindowLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleWindowLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="service-page-wrapper min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 w-full max-w-[84rem] mx-auto relative overflow-hidden flex flex-col justify-between"
    >
      <div className="w-full">
        {/* Navigation back button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-mono font-medium hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to the doors</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4">
            App Development
          </h1>
          <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed font-normal">
            iOS apps and games, designed and built end to end: from the first screen and the small
            interactions to the details that make an app feel at home on iPhone.
          </p>
        </div>

        {/* Stacked Cards Parent Stage */}
        <div
          ref={cardsContainerRef}
          className="relative w-full h-[580px] sm:h-[620px] lg:h-[640px] mb-8 overflow-visible"
        >
          {PROJECTS.map((project, idx) => {
            const zIndex = 10 * (idx + 1);
            return (
              <article
                key={project.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                style={{ zIndex }}
                className="absolute top-0 left-1/2 w-full h-full rounded-[32px] sm:rounded-[36px] bg-[#f5f3ee] dark:bg-[#1a1818] border border-black/[0.08] dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between select-none"
              >
                {/* Dimming overlay when card recedes into stack */}
                <div
                  ref={(el) => (overlayRefs.current[idx] = el)}
                  className="absolute inset-0 rounded-[32px] sm:rounded-[36px] bg-black pointer-events-none opacity-0 z-20 transition-opacity"
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 h-full">
                  {/* Text Content Column */}
                  <div
                    className={`flex flex-col justify-between h-full ${
                      project.reverse ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7 lg:order-1'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                            <img
                              src={project.iconUrl}
                              onError={(e) => {
                                if (!e.target.dataset.triedFallback) {
                                  e.target.dataset.triedFallback = 'true';
                                  e.target.src = '.' + project.iconUrl;
                                }
                              }}
                              alt={`${project.title} icon`}
                              className="w-full h-full object-cover"
                              loading="eager"
                            />
                          </div>
                          <span className="text-xs font-mono font-semibold tracking-wider text-foreground/60 dark:text-foreground/50 uppercase">
                            {project.category}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-muted">{project.num}</span>
                      </div>

                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-2">
                        {project.title}
                      </h2>
                      <p className="text-xs sm:text-sm font-mono text-accent font-medium mb-4 sm:mb-6">
                        {project.subtitle}
                      </p>
                      <p className="text-sm sm:text-base text-foreground/80 dark:text-foreground/75 leading-relaxed max-w-xl mb-6">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-black/5 dark:bg-white/5 text-foreground/75 dark:text-foreground/70 border border-black/5 dark:border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-xs font-mono text-muted">
                      <span className="w-2 h-2 rounded-full bg-foreground/35 dark:bg-foreground/45 inline-block" />
                      <span>{project.badge}</span>
                    </div>
                  </div>

                  {/* Phone Mockup Column */}
                  <div
                    className={`relative flex items-center justify-center select-none ${
                      project.reverse ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5 lg:order-2'
                    }`}
                  >
                    <div className="relative w-[220px] sm:w-[250px] lg:w-[270px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)]">
                      <img
                        src={project.phoneUrl}
                        onError={(e) => {
                          if (!e.target.dataset.triedFallback) {
                            e.target.dataset.triedFallback = 'true';
                            e.target.src = '.' + project.phoneUrl;
                          }
                        }}
                        alt={`${project.title} preview`}
                        className="w-full h-auto object-contain select-none pointer-events-none"
                        loading="eager"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Floating Scroll To Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#111111] text-white dark:bg-[#f8f6f2] dark:text-[#111111] shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
}