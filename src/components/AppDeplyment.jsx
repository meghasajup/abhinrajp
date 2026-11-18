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
    category: 'IOS APP · FINANCE',
    title: 'Expense Tracker',
    subtitle: 'Personal finance · Expense management',
    description:
      'A smart personal finance application designed to make money management effortless. Users can organise their finances into separate books, track daily expenses, manage budgets and monitor their spending habits. Features include intuitive expense tracking, organised financial records, and convenient iOS Shortcuts and Back Tap integration for a smoother experience.',
    tags: ['Budget Management', 'Expense Books', 'iOS Shortcuts'],
    badge: 'iPhone application · Screen recording available',
    phoneUrl: '/images/apps/phone-expense-tracker.png',
    reverse: false,
  },
  {
    id: 'secret-vault',
    category: 'IOS APP · PRIVACY',
    title: 'Secret Vault',
    subtitle: 'Privacy protection · Secure photo storage',
    description:
      'A privacy-focused application that allows users to securely store their personal photos behind a calculator interface. Designed to look like an ordinary calculator, the app provides a discreet way to protect private content using an equation-based passcode. A simple interface combines privacy, convenience and secure personal storage.',
    tags: ['Privacy Protection', 'Equation Passcode', 'Photo Vault'],
    badge: 'iPhone application · Screen recording available',
    phoneUrl: '/images/apps/phone-secret-vault.png',
    reverse: true,
  },
  {
    id: 'brick-breaker',
    category: 'IOS GAME · ARCADE',
    title: 'Brick Breaker',
    subtitle: 'Arcade gaming · Pixel-art experience',
    description:
      'A fun and engaging arcade game inspired by the classic brick-breaking experience. Players control a paddle to bounce the ball, destroy colourful brick formations and progress through challenging levels. Featuring pixel-art visuals, interactive gameplay, exciting power-ups and carefully designed levels for an entertaining mobile gaming experience.',
    tags: ['Game Design', 'Power-ups', 'Level Design'],
    badge: 'iPhone game · Gameplay recording available',
    phoneUrl: '/images/apps/phone-brick-breaker.png',
    reverse: false,
  },
  {
    id: 'dice',
    category: 'IOS APP · UTILITY',
    title: 'Dice',
    subtitle: 'Everyday utility · Digital dice roller',
    description:
      'A colourful and easy-to-use digital dice rolling application designed for quick and convenient everyday use. With a clean interface and simple interactions, users can roll dice instantly with a single tap. The application focuses on simplicity, smooth interactions and an enjoyable visual experience.',
    tags: ['Utility App', 'Minimal UI', 'Tap to Roll'],
    badge: 'iPhone application · Screen recording available',
    phoneUrl: '/images/apps/phone-dice.png',
    reverse: true,
  },
];

export default function AppDeployment({
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
            // Clear transform and willChange so container does NOT act as a
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
      onNavigate('/', { doorIndex: 2, isBack: true });
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
        onNavigate('/', { doorIndex: 2, isBack: true });
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

          tl.to(
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
            const targetScale = Math.max(0.85, 1 - depth * 0.04);
            const targetY = -depth * 14;
            const targetOverlay = Math.min(0.48, depth * 0.15);

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
            const targetScale = Math.max(0.88, 1 - depth * 0.035);
            const targetY = -depth * 10;
            const targetOverlay = Math.min(0.42, depth * 0.14);

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
      id="door"
      className="service-page-wrapper min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 md:px-12 max-w-[84rem] mx-auto relative overflow-hidden"
    >
      <div className="mb-8">
        <button
          type="button"
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-mono font-medium hover:text-accent transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to the doors</span>
        </button>
      </div>

      <div className="max-w-3xl mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4">
          App Deployment
        </h1>
        <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed font-normal">
          From everyday utilities to engaging mobile experiences. We build intuitive, functional and beautifully crafted
          applications designed to make everyday interactions simpler and smarter.
        </p>
      </div>

      <div
        ref={cardsContainerRef}
        className="relative w-full h-[660px] sm:h-[680px] lg:h-[710px] mb-20 overflow-visible"
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
              <div
                ref={(el) => (overlayRefs.current[idx] = el)}
                className="absolute inset-0 rounded-[32px] sm:rounded-[36px] bg-black pointer-events-none opacity-0 z-20 transition-opacity"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8 h-full">
                <div
                  className={`flex flex-col justify-between h-full ${
                    project.reverse ? 'lg:col-span-5 lg:order-2' : 'lg:col-span-5 lg:order-1'
                  }`}
                >
                  <div className="pt-1 sm:pt-3">
                    <div className="mb-3 sm:mb-5">
                      <span className="text-xs sm:text-[13px] font-mono font-semibold tracking-wider text-foreground/60 dark:text-foreground/50 uppercase">
                        {project.category}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-2 sm:mb-3">
                      {project.title}
                    </h2>
                    <p className="text-sm sm:text-base font-normal text-foreground/65 dark:text-foreground/60 mb-4 sm:mb-6">
                      {project.subtitle}
                    </p>
                    <p className="text-sm sm:text-[15px] lg:text-base text-foreground/80 dark:text-foreground/75 leading-relaxed max-w-xl mb-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3.5 py-1.5 rounded-full text-xs font-sans bg-black/5 dark:bg-white/5 text-foreground/75 dark:text-foreground/70 border border-black/5 dark:border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.badge && (
                    <div className="flex items-center gap-2 pt-2 text-xs font-mono text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 inline-block" />
                      <span>{project.badge}</span>
                    </div>
                  )}
                </div>

                <div
                  className={`relative flex items-center justify-center select-none ${
                    project.reverse ? 'lg:col-span-7 lg:order-1' : 'lg:col-span-7 lg:order-2'
                  }`}
                >
                  <div className="relative w-full max-w-[260px] sm:max-w-[310px] lg:max-w-[350px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)]">
                    <img
                      src={project.phoneUrl}
                      onError={(e) => {
                        if (!e.target.dataset.triedFallback) {
                          e.target.dataset.triedFallback = 'true';
                          e.target.src = '.' + project.phoneUrl;
                        }
                      }}
                      alt={`${project.title} mobile application preview`}
                      className="w-full h-auto object-contain select-none pointer-events-none"
                      loading="eager"
                      draggable="false"
                      onLoad={() => ScrollTrigger.refresh()}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

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