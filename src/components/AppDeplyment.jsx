import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowUp, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PROJECTS = [
  {
    id: 'thelearnyn',
    num: '01 / 05',
    title: 'TheLearnyn',
    category: 'ANDROID APP · AI EDTECH PLATFORM',
    subtitle: 'AI-driven study tools, video courses & mock exams',
    description:
      'A comprehensive educational ecosystem built on MVVM with Provider—featuring automated AI note generation, a conversational study chatbot, and a Mock Exam engine with dynamic AI explanations. Includes a multi-category video library with digital note-taking, dynamic PDF certificate generation, QR-based scorecard analytics, Cashfree payments, Deep Linking, and FCM notifications.',
    tags: [
      'Flutter & Provider (MVVM)',
      'AI Study Suite & Mock Exams',
      'PDF Engine & QR Analytics',
      'Cashfree, Deep Links & FCM',
    ],
    badge: 'Live on Google Play',
    websiteUrl: 'https://www.thelearnyn.com',
    iconUrl: '/images/apps/icon-thelearnyn.png',
    phoneUrl: '/images/apps/phone-thelearnyn.png',
  },
  {
    id: 'namodeva',
    num: '02 / 05',
    title: 'NamoDeva',
    category: 'ANDROID APP · CULTURAL PLATFORM',
    subtitle: 'Cultural content, interactive gaming & media',
    description:
      'A full-featured cultural platform with immersive animations, in-app gaming, and rich media content—built end-to-end in an Agile environment using MVC with GetX. Features custom Flutter animations, Unreal Engine video integrations, Firebase Authentication (Google Sign-In & Email), and FCM push notifications, deployed to Google Play with zero critical bugs across the first 3 sprints.',
    tags: [
      'Flutter & GetX (MVC)',
      'In-App Gaming & Unreal Video',
      'Firebase Auth & FCM',
      'Google Play Live',
    ],
    badge: 'Live on Google Play',
    websiteUrl: 'https://namodeva.com',
    iconUrl: '/images/apps/icon-namodeva.png',
    phoneUrl: '/images/apps/phone-namodeva.png',
  },
  {
    id: 'anyskill',
    num: '03 / 05',
    title: 'AnySkill',
    category: 'ANDROID APP · AI EDTECH PLATFORM',
    subtitle: 'AI-driven study tools, video courses & mock exams',
    description:
      'A comprehensive educational ecosystem built on MVVM with Provider—featuring automated AI note generation, a conversational study chatbot, and a Mock Exam engine with dynamic AI explanations. Includes a multi-category video library with digital note-taking, dynamic PDF certificate generation, QR-based scorecard analytics, Cashfree payments, Deep Linking, and FCM notifications.',
    tags: [
      'Flutter & Provider (MVVM)',
      'AI Study Suite & Mock Exams',
      'PDF Engine & QR Analytics',
      'Cashfree, Deep Links & FCM',
    ],
    badge: 'Live on Google Play',
    websiteUrl: 'https://anyskill.com/',
    iconUrl: '/images/apps/icon-anyskill.png',
    phoneUrl: '/images/apps/phone-anyskill.png',
  },
  {
    id: 'taskpro',
    num: '04 / 05',
    title: 'Taskpro',
    category: 'MOBILE APP · SERVICE MARKETPLACE',
    subtitle: 'Freelance worker booking across user, worker & admin sides',
    description:
      'An advanced service booking platform connecting users with freelance workers—built with Clean Architecture and SOLID principles across user, worker, and admin experiences. Features BLoC, GetX, and Provider state management, Firebase (Firestore, Auth, Storage), Razorpay payments, Google Maps SDK discovery, real-time messaging, and adaptive UI for Android and iOS.',
    tags: [
      'Clean Architecture & SOLID',
      'BLoC, GetX & Provider',
      'Razorpay, Maps & Messaging',
      'Firebase · Android & iOS',
    ],
    badge: 'Amazon Appstore · GitHub',
    websiteUrl: 'https://www.amazon.com/abhinraj-Taskpro/dp/B0DFWZY8GT',
    iconUrl: '/images/apps/icon-taskpro.png',
    phoneUrl: '/images/apps/phone-taskpro.png',
  },
  {
    id: 'pt-portal',
    num: '05 / 05',
    title: 'PT Portal',
    category: 'MOBILE APP · FITNESS & COACHING',
    subtitle: 'Personal trainer workflow, reminders & progress tracking',
    description:
      'A personal trainer and client management app built on MVVM architecture for clean UI-to-business-logic data binding. Uses Hive for fast local storage alongside a custom notification system for training reminders and ongoing progress tracking.',
    tags: [
      'MVVM Architecture',
      'Hive Local Storage',
      'Custom Reminders',
      'Progress Tracking',
    ],
    badge: 'Amazon Appstore · GitHub',
    websiteUrl: 'https://www.amazon.com/abhinraj-PT-Portal/dp/B0CW1B2Q8M',
    iconUrl: '/images/apps/icon-pt-portal.png',
    phoneUrl: '/images/apps/phone-pt-portal.png',
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

  // Always start this page from the top
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

  // Entrance through the door portal
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
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reliable stacked-card animation
  useEffect(() => {
    const stage = cardsContainerRef.current;
    if (!stage) return undefined;

    let refreshFrame = 0;
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const overlays = overlayRefs.current;
      const totalCards = cards.length;
      if (!totalCards) return undefined;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 768px)',
          mobile: '(max-width: 767px)',
        },
        (context) => {
          const isMobile = context.conditions.mobile;
          const stackStep = isMobile ? 8 : 14;
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
            if (overlays[index]) gsap.set(overlays[index], { opacity: 0 });
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
                  scale: Math.max(isMobile ? 0.9 : 0.86, 1 - depth * scaleStep),
                  duration: entranceDuration,
                },
                position
              );

              if (overlays[previous]) {
                timeline.to(
                  overlays[previous],
                  {
                    opacity: Math.min(maxDim, depth * (isMobile ? 0.1 : 0.12)),
                    duration: entranceDuration,
                  },
                  position
                );
              }
            }

            timeline.to({}, { duration: readingPause });
          }
          return () => timeline.scrollTrigger?.kill();
        }
      );
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => mm.revert();
    }, containerRef);

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', handleLoad);
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* Main surface */}
      <div
        ref={containerRef}
        className="service-page-wrapper bg-[var(--background)] text-[var(--foreground)] min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 w-full max-w-[84rem] mx-auto relative overflow-visible flex flex-col justify-between rounded-[28px] sm:rounded-[36px] md:rounded-[40px]"
      >
        <div className="w-full">
          {/* Page Header */}
          <div className="max-w-3xl mb-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4">
              App Development
            </h1>
            <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed font-normal">
              Cross-platform mobile apps, designed and built end to end: from the first screen and smooth interactions to the native details that make an app feel right at home on both iOS and Android.
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
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  style={{ zIndex }}
                  className="absolute top-0 inset-x-0 w-full h-full rounded-[32px] sm:rounded-[36px] bg-white dark:bg-[#1e1b1b] border border-black/[0.06] dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-between select-none"
                >
                  {/* card recedes into stack */}
                  <div
                    ref={(el) => {
                      overlayRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 rounded-[32px] sm:rounded-[36px] bg-black pointer-events-none opacity-0 z-20"
                  />
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 h-full">
                    {/* Text Content Column */}
                    <div
                      className={`flex flex-col justify-between h-full ${
                        idx % 2 === 0
                          ? 'lg:col-span-7 lg:order-1'
                          : 'lg:col-span-7 lg:order-2'
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

                      <div className="flex flex-wrap items-center gap-3 pt-2">
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

                    {/* Phone Mockup Column */}
                    <div
                      className={`relative flex items-center justify-center select-none ${
                        idx % 2 === 0
                          ? 'lg:col-span-5 lg:order-2'
                          : 'lg:col-span-5 lg:order-1'
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