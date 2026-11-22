import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowUp, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import theLearnyn from '/images/ui-ux/TheLearnyn.png';
import namodeva from '/images/ui-ux/namodeva.png';
import anyskill from '/images/ui-ux/anyskill.png';
import taskpro from '/images/ui-ux/taskpro.png';
import ptportal from '/images/ui-ux/pt-portal.png';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PROJECTS = [
  {
    id: 'thelearnyn',
    num: '01',
    category: 'APP DEVELOPMENT',
    title: 'TheLearnyn',
    subtitle: 'AI-powered education · Android app',
    description:
      'An AI-powered learning platform built around study tools and exam preparation. The app brings together mock exams, PDF and QR-based analytics, payment flows, deep links and push notifications in one mobile experience.',
    tags: ['Flutter', 'Provider · MVVM', 'AI learning', 'Mock exams'],
    badge: 'Live on Google Play',
    websiteUrl: '', // Add the official project URL here.
    phoneUrl: theLearnyn,
  },
  {
    id: 'namodeva',
    num: '02',
    category: 'APP DEVELOPMENT',
    title: 'NamoDeva',
    subtitle: 'Cultural platform · Android app',
    description:
      'A cultural mobile platform combining content and interactive experiences. The app includes in-app gaming, video experiences, Firebase authentication and push notifications, with its app architecture built using Flutter and GetX.',
    tags: ['Flutter', 'GetX · MVC', 'Firebase', 'Interactive experiences'],
    badge: 'Live on Google Play',
    websiteUrl: '', // Add the official project URL here.
    phoneUrl: namodeva,
  },
  {
    id: 'anyskill',
    num: '03',
    category: 'APP DEVELOPMENT',
    title: 'AnySkill',
    subtitle: 'Skill learning · Mobile app',
    description:
      'A mobile learning experience focused on making skill development accessible through a clear, easy-to-use app interface. The project details and visual assets currently reuse the AnySkill information available in the existing App Development project data.',
    tags: ['Mobile UI', 'Learning experience', 'App interface'],
    badge: 'Project details to be refined',
    websiteUrl: '', // Add the official project URL here.
    phoneUrl: anyskill,
  },
  {
    id: 'taskpro',
    num: '04',
    category: 'APP DEVELOPMENT',
    title: 'Taskpro',
    subtitle: 'Service marketplace · Android & iOS',
    description:
      'A mobile service marketplace connecting customers with service providers. The app brings together service discovery, messaging, maps and payments, supported by Firebase integrations and a maintainable architecture.',
    tags: ['Clean Architecture', 'BLoC · GetX · Provider', 'Razorpay', 'Maps & messaging'],
    badge: 'Amazon Appstore · GitHub',
    websiteUrl: '', // Add the official project URL here.
    phoneUrl: taskpro,
  },
  {
    id: 'pt-portal',
    num: '05',
    category: 'APP DEVELOPMENT',
    title: 'PT Portal',
    subtitle: 'Fitness & coaching · Mobile app',
    description:
      'A fitness and coaching app designed to help users follow their progress and stay consistent. The experience includes progress tracking, reminders and locally stored app data, built around an MVVM approach.',
    tags: ['MVVM', 'Hive', 'Progress tracking', 'Reminders'],
    badge: 'Amazon Appstore · GitHub',
    websiteUrl: '', // Add the official project URL here.
    phoneUrl: ptportal,
  },
];

export default function UiUxDesign({
  onNavigate = () => {},
  onOpenContact = () => {},
}) {
  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isMobileBackButton, setIsMobileBackButton] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updatePosition = () => setIsMobileBackButton(mediaQuery.matches);

    updatePosition();
    mediaQuery.addEventListener('change', updatePosition);
    return () => mediaQuery.removeEventListener('change', updatePosition);
  }, []);

  // Start this page at the top and restore the previous scroll behavior.
  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const frame = requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });

    return () => {
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  // Entrance animation.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return undefined;

    const entranceTween = gsap.fromTo(
      container,
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
          }
          ScrollTrigger.refresh();
        },
      }
    );

    return () => entranceTween.kill();
  }, []);

  const handleBackClick = (event) => {
    event?.preventDefault();

    if (isLeaving) return;
    setIsLeaving(true);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !containerRef.current) {
      onNavigate('/', { doorIndex: 1, isBack: true });
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
        onNavigate('/', { doorIndex: 1, isBack: true });
      },
    });
  };

  // Track scroll position for the scroll-to-top button.
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Stacked project-card scroll animation.
  useEffect(() => {
    const stage = cardsContainerRef.current;
    if (!stage) return undefined;

    let refreshFrame = 0;

    const context = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const overlays = overlayRefs.current;
      const totalCards = cards.length;

      if (!totalCards) return;

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: '(min-width: 768px)',
          mobile: '(max-width: 767px)',
        },
        (mediaContext) => {
          const isMobile = mediaContext.conditions.mobile;
          const stackStep = isMobile ? 10 : 14;
          const scaleStep = isMobile ? 0.035 : 0.04;
          const maxDim = isMobile ? 0.3 : 0.35;
          const entranceDuration = 1;
          const readingPause = 0.42;
          const stepDuration = entranceDuration + readingPause;

          cards.forEach((card, index) => {
            gsap.set(card, {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              x: 0,
              xPercent: 0,
              y: 0,
              yPercent: index === 0 ? 0 : 100,
              scale: 1,
              opacity: 1,
              transformOrigin: 'top center',
              force3D: true,
              zIndex: (index + 1) * 10,
            });

            if (overlays[index]) {
              gsap.set(overlays[index], { opacity: 0 });
            }
          });

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage,
              start: isMobile ? 'top top+=16' : 'top top+=24',
              end: () => {
                const perCardScroll = Math.max(
                  window.innerHeight * 1.2,
                  stage.offsetHeight * 1.15
                );

                return `+=${perCardScroll * Math.max(1, totalCards - 1)}`;
              },
              pin: stage,
              pinSpacing: true,
              pinReparent: true,
              pinType: 'fixed',
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: false,
            },
          });

          for (let index = 1; index < totalCards; index += 1) {
            const position = (index - 1) * stepDuration;

            timeline.to(
              cards[index],
              { yPercent: 0, duration: entranceDuration },
              position
            );

            for (let previous = 0; previous < index; previous += 1) {
              const depth = index - previous;

              timeline.to(
                cards[previous],
                {
                  y: -depth * stackStep,
                  scale: Math.max(
                    isMobile ? 0.9 : 0.86,
                    1 - depth * scaleStep
                  ),
                  duration: entranceDuration,
                },
                position
              );

              if (overlays[previous]) {
                timeline.to(
                  overlays[previous],
                  {
                    opacity: Math.min(
                      maxDim,
                      depth * (isMobile ? 0.1 : 0.12)
                    ),
                    duration: entranceDuration,
                  },
                  position
                );
              }
            }

            timeline.to({}, { duration: readingPause });
          }

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        }
      );

      refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => media.revert();
    }, containerRef);

    return () => {
      cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="service-page-wrapper bg-[var(--background)] text-[var(--foreground)] min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 w-full max-w-[84rem] mx-auto relative overflow-visible flex flex-col justify-between rounded-[28px] sm:rounded-[36px] md:rounded-[40px]"
      >
        <div className="w-full">
          <div className="max-w-3xl mb-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4">
              UI/UX Design
            </h1>

            <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed font-normal">
              Thoughtful mobile experiences designed alongside development:
              from clear user flows and accessible interfaces to the details
              that make each app feel intuitive and consistent.
            </p>
          </div>

          <div
            ref={cardsContainerRef}
            className="relative isolate w-full h-[660px] sm:h-[680px] lg:h-[640px] mb-8 overflow-visible"
          >
            {PROJECTS.map((project, idx) => {
              const textFirst = idx % 2 === 0;

              return (
                <article
                  key={project.id}
                  ref={(element) => {
                    cardRefs.current[idx] = element;
                  }}
                  style={{ zIndex: 10 * (idx + 1) }}
                  className="absolute top-0 inset-x-0 w-full h-full rounded-[32px] sm:rounded-[36px] bg-white dark:bg-[#1e1b1b] border border-black/[0.06] dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] p-4 sm:p-8 lg:p-12 overflow-hidden flex flex-col justify-between select-none"
                >
                  <div
                    ref={(element) => {
                      overlayRefs.current[idx] = element;
                    }}
                    className="absolute inset-0 rounded-[32px] sm:rounded-[36px] bg-black pointer-events-none opacity-0 z-20"
                  />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-3 sm:gap-4 lg:gap-10 h-full">
                    {/* Project details */}
                    <div
                      className={`order-2 flex flex-col justify-center min-w-0 ${
                        textFirst
                          ? 'lg:col-span-7 lg:order-1'
                          : 'lg:col-span-7 lg:order-2'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="text-xs font-mono font-semibold tracking-wider text-foreground/60 dark:text-foreground/50 uppercase">
                            {project.category}
                          </span>

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

                        <p className="text-xs sm:text-base text-foreground/80 dark:text-foreground/75 leading-relaxed max-w-xl mb-3 sm:mb-4">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-0">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono bg-black/[0.04] dark:bg-white/5 text-foreground/75 dark:text-foreground/70 border border-black/5 dark:border-white/5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-mono text-muted">
                          <span className="w-2 h-2 rounded-full bg-foreground/35 dark:bg-foreground/45 inline-block flex-shrink-0" />
                          <span>{project.badge}</span>
                        </div>

                        <a
                          href={project.websiteUrl || '#'}
                          target={project.websiteUrl ? '_blank' : undefined}
                          rel={project.websiteUrl ? 'noopener noreferrer' : undefined}
                          onClick={(e) => {
                            if (!project.websiteUrl) e.preventDefault();
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#333333] hover:scale-105 active:scale-95 dark:bg-[#f8f6f2] dark:text-[#111111] dark:hover:bg-white cursor-pointer"
                        >
                          <span>Visit</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Phone preview */}
                    <div
                      className={`order-1 relative flex h-[190px] sm:h-[220px] lg:h-auto items-center justify-center select-none ${
                        textFirst
                          ? 'lg:col-span-5 lg:order-2'
                          : 'lg:col-span-5 lg:order-1'
                      }`}
                    >
                      <div className="relative h-full w-auto max-w-full lg:h-auto lg:w-[400px] xl:w-[440px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)]">
                        <img
                          src={project.phoneUrl}
                          alt={`${project.title} app preview`}
                          className="h-full w-auto max-w-full object-contain select-none pointer-events-none lg:h-auto lg:w-full"
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          draggable={false}
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
            <div
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                boxSizing: 'border-box',
                border: '2px solid #d5d0cd',
                borderRadius: 'clamp(44px, 5vw, 88px)',
                boxShadow:
                  '0 0 0 100vmax #ffffff, inset 0 10px 24px -6px rgba(130, 118, 112, 0.28), inset 0 3px 8px -2px rgba(255, 255, 255, 0.9), inset 0 -10px 22px -6px rgba(130, 118, 112, 0.2), inset 10px 0 22px -6px rgba(130, 118, 112, 0.16), inset -10px 0 22px -6px rgba(130, 118, 112, 0.16)',
                pointerEvents: 'none',
              }}
            />

            <button
              type="button"
              onClick={handleBackClick}
              disabled={isLeaving}
              style={{
                position: 'fixed',
                left: isMobileBackButton ? '16px' : '24px',
                top: isMobileBackButton ? '16px' : 'auto',
                bottom: isMobileBackButton ? 'auto' : '24px',
                zIndex: 9999,
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-mono font-medium hover:text-accent transition-colors cursor-pointer shadow-sm disabled:opacity-60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to the doors</span>
            </button>

            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
              style={{
                position: 'fixed',
                right: '24px',
                bottom: '24px',
                zIndex: 9999,
              }}
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