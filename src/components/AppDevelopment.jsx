import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const scrollTriggerRef = useRef(null);

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

  // Entrance through the door portal
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                clearProps: 'transform,willChange',
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

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill(false);
      scrollTriggerRef.current = null;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !containerRef.current) {
      onNavigate('/', {
        doorIndex: 0,
        isBack: true,
        preserveScroll: true,
        skipDoorCenter: true,
      });
      return;
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        onNavigate('/', {
          doorIndex: 0,
          isBack: true,
          preserveScroll: true,
          skipDoorCenter: true,
        });
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stage = cardsContainerRef.current;
    if (!stage) return;

    const cards = cardRefs.current.filter(Boolean);
    const overlays = overlayRefs.current.filter(Boolean);
    const totalCards = cards.length;
    if (totalCards < 2) return;
    const mm = gsap.matchMedia();
    const buildStack = (isMobile) => {
      const transitionDuration = 1;
      const holdDuration = isMobile ? 0.55 : 0.7;
      const stageHeight = () => stage.getBoundingClientRect().height;
      cards.forEach((card, index) => {
        gsap.set(card, {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          x: 0,
          y: index === 0 ? 0 : stageHeight(),
          scale: 1,
          opacity: 1,
          visibility: 'visible',
          transformOrigin: 'top center',
          force3D: true,
          zIndex: 100 + index,
        });
        if (overlays[index]) gsap.set(overlays[index], { opacity: 0 });
      });

      const timeline = gsap.timeline({ defaults: { ease: 'none' } });

      for (let index = 1; index < totalCards; index += 1) {
        const startAt = timeline.duration();

        // Bring the next card fully into the stage.
        timeline.to(
          cards[index],
          {
            y: 0,
            duration: transitionDuration,
            ease: 'power1.inOut',
          },
          startAt
        );

        // Build the previous cards into a compact stack underneath it.
        for (let previous = 0; previous < index; previous += 1) {
          const depth = index - previous;
          const targetScale = isMobile
            ? Math.max(0.94, 1 - depth * 0.025)
            : Math.max(0.88, 1 - depth * 0.04);
          const targetY = isMobile ? -depth * 7 : -depth * 12;
          const targetOverlay = Math.min(isMobile ? 0.24 : 0.3, depth * 0.09);

          timeline.to(
            cards[previous],
            {
              scale: targetScale,
              y: targetY,
              duration: transitionDuration,
            },
            startAt
          );

          if (overlays[previous]) {
            timeline.to(
              overlays[previous],
              {
                opacity: targetOverlay,
                duration: transitionDuration,
              },
              startAt
            );
          }
        }

        // A real hold gives the viewer time to read the fully revealed card.
        timeline.to({}, { duration: holdDuration });
      }

      const trigger = ScrollTrigger.create({
        trigger: stage,
        animation: timeline,
        start: isMobile ? 'top top+=72' : 'top top+=88',
        end: () => `+=${Math.ceil(window.innerHeight * timeline.duration())}`,
        scrub: 0.65,
        pin: stage,
        pinSpacing: true,
        pinType: 'fixed',
        pinReparent: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        fastScrollEnd: true,
      });

      scrollTriggerRef.current = trigger;

      return () => {
        if (scrollTriggerRef.current === trigger) {
          scrollTriggerRef.current = null;
        }
        trigger.kill(false);
        timeline.kill();
      };
    };

    mm.add('(min-width: 768px)', () => buildStack(false));
    mm.add('(max-width: 767px)', () => buildStack(true));

    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refresh, 250);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      mm.revert();
    };
  }, []);

  return (
    <>
      {/* Main surface */}
      <div
        ref={containerRef}
        className="service-page-wrapper bg-[#faf5f2] dark:bg-[#1a1818] min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 w-full max-w-[84rem] mx-auto relative overflow-visible flex flex-col justify-between rounded-[28px] sm:rounded-[36px] md:rounded-[40px]"
      >
        <div className="w-full">
          {/* Page Header */}
          <div className="max-w-3xl mb-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4">
              App Development
            </h1>
            <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed font-normal">
              iOS apps and games, designed and built end to end: from the first screen and the small interactions to the details that make an app feel at home on iPhone.
            </p>
          </div>

          {/* Stacked Cards Parent Stage */}
          <div
            ref={cardsContainerRef}
            className="relative isolate w-full h-[580px] sm:h-[620px] lg:h-[640px] mb-8 overflow-visible"
          >
            {PROJECTS.map((project, idx) => {
              const zIndex = 10 * (idx + 1);
              return (
                <article
                  key={project.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  style={{ zIndex }}
                  className="absolute top-0 inset-x-0 w-full h-full rounded-[32px] sm:rounded-[36px] bg-white dark:bg-[#1e1b1b] border border-black/[0.06] dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between select-none"
                >
                  {/* card recedes into stack */}
                  <div
                    ref={(el) => (overlayRefs.current[idx] = el)}
                    className="absolute inset-0 rounded-[32px] sm:rounded-[36px] bg-black pointer-events-none opacity-0 z-20"
                  />
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 h-full">
                    {/* Text Content Column */}
                    <div
                      className={`flex flex-col justify-between h-full ${
                        project.reverse
                          ? 'lg:col-span-7 lg:order-2'
                          : 'lg:col-span-7 lg:order-1'
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
                          <span className="text-xs font-mono text-muted">
                            {project.num}
                          </span>
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
                              className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-black/[0.04] dark:bg-white/5 text-foreground/75 dark:text-foreground/70 border border-black/5 dark:border-white/5"
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
                        project.reverse
                          ? 'lg:col-span-5 lg:order-1'
                          : 'lg:col-span-5 lg:order-2'
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
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <>
            {/* Outer surround */}
            <div
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                boxSizing: 'border-box',
                border: '2px solid #d5d0cd',
                borderRadius: 'clamp(44px, 5vw, 88px)',
                boxShadow: `0 0 0 100vmax #ffffff, inset 0 10px 24px -6px rgba(130, 118, 112, 0.28), inset 0 3px 8px -2px rgba(255, 255, 255, 0.9), inset 0 -10px 22px -6px rgba(130, 118, 112, 0.2), inset 10px 0 22px -6px rgba(130, 118, 112, 0.16), inset -10px 0 22px -6px rgba(130, 118, 112, 0.16)`,
                pointerEvents: 'none',
              }}
            />

            <button
              type="button"
              onClick={handleBackClick}
              style={{ position: 'fixed', left: '16px', bottom: '56px', zIndex: 9999 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-mono font-medium hover:text-accent transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to the doors</span>
            </button>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ position: 'fixed', right: '24px', bottom: '24px', zIndex: 9999 }}
              className={`w-11 h-11 rounded-full bg-[#111111] text-white dark:bg-[#f8f6f2] dark:text-[#111111] shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
                showScrollTop
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </>,
          document.body
        )}
    </>
  );
}