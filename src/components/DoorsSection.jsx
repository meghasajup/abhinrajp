import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/DoorPage.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
}

export const DOORS_DATA = [
  {
    id: 'app-developer',
    title: 'App Development',
    plateTop: 'APP',
    plateBottom: 'DEVELOPER',
    color: '#22304a',
    colorDark: '#1c2840',
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
    color: '#4a3540',
    colorDark: '#3f2d37',
    route: '/ui-ux/',
    subtitle: 'Research first, pixels second',
    features: [
      'Brand & business needs analysis',
      'User & competitor research',
      'Information architecture & flows',
      'Wireframes & high-fidelity UI',
      'Interactive prototypes & testing',
    ],
  },
  {
    id: 'app-deployment',
    title: 'App Deployment',
    plateTop: 'APP',
    plateBottom: 'DEPLOYMENT',
    color: '#7a8670',
    colorDark: '#66705d',
    route: '/app-deployment/',
    subtitle: 'From local build to app stores & cloud',
    features: [
      'Google Play & App Store publishing',
      'CI/CD pipeline configuration',
      'App signing & provisioning profiles',
      'Crash reporting & performance monitoring',
      'Post-launch maintenance & updates',
    ],
  },
];

const DoorsSection = forwardRef(function DoorsSection(
  {
    onNavigate,
    isExiting = false,
    exitDoorIndex = -1,
    onExitComplete,
  },
  ref
) {
  const [activeDoor, setActiveDoor] = useState(-1);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [openedDoor, setOpenedDoor] = useState(-1);
  const [isPressing, setIsPressing] = useState(false);
  const [headingVisible, setHeadingVisible] = useState(false);

  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const headingRef = useRef(null);
  const mobileViewportRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const wallRef = useRef(null);
  const unitsRef = useRef([]);
  const mobileUnitsRef = useRef([]);
  const doorPanelRefs = useRef([]);
  const mobileDoorPanelRefs = useRef([]);
  const leverRefs = useRef([]);
  const mobileLeverRefs = useRef([]);
  const portalOverlayRef = useRef(null);
  const footerRef = useRef(null);

  const isTransitioningRef = useRef(false);
  const activeTimelineRef = useRef(null);
  const mobileScrollTriggerRef = useRef(null);

  const [dinfoPos, setDinfoPos] = useState({
    left: 0,
    top: 0,
    width: 340,
    visible: false,
  });

  // Heading reveal animation
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
      { threshold: 0.2 }
    );

    observer.observe(headingElement);
    return () => observer.disconnect();
  }, []);

  // Mobile (< 1024px): Pin section, slide with gap between doors, complete full section before next section
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(max-width: 1023px)', () => {
        const track = mobileTrackRef.current;
        const viewport = mobileViewportRef.current;
        const section = containerRef.current;
        if (!track || !viewport || !section) return;

        const getMaxShift = () => {
          const totalWidth = track.scrollWidth;
          const visibleWidth = viewport.clientWidth;
          return Math.max(0, totalWidth - visibleWidth);
        };

        gsap.set(track, { x: 0 });

        const tween = gsap.to(track, {
          x: () => -getMaxShift(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(900, getMaxShift() * 1.45 + 350)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (isTransitioningRef.current) return;
              const stepCount = DOORS_DATA.length;
              const rawIdx = Math.round(self.progress * (stepCount - 1));
              const clampedIdx = Math.max(0, Math.min(stepCount - 1, rawIdx));
              setMobileActiveIndex((prev) => (prev !== clampedIdx ? clampedIdx : prev));
            },
          },
        });

        mobileScrollTriggerRef.current = tween.scrollTrigger;
      });
    }, containerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      mobileScrollTriggerRef.current = null;
      ctx.revert();
    };
  }, []);

  // Dot click on mobile scrolls to that door's progress in the pinned ScrollTrigger
  const handleMobileDotSelect = useCallback((targetIdx) => {
    setMobileActiveIndex(targetIdx);

    const st = mobileScrollTriggerRef.current;
    if (!st || DOORS_DATA.length <= 1) return;

    const progress = targetIdx / (DOORS_DATA.length - 1);
    const targetScrollY = st.start + (st.end - st.start) * progress;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  }, []);

  // Calculate camera zoom metrics
  const getDoorZoomMetrics = useCallback((index, isMobile = false) => {
    const doorUnit = isMobile ? mobileUnitsRef.current[index] : unitsRef.current[index];
    const camera = cameraRef.current;

    if (!doorUnit || !camera) {
      return {
        scale: 6.5,
        moveX: 0,
        moveY: 0,
        originPercentX: 50,
        originPercentY: 50,
      };
    }

    const doorRect = doorUnit.getBoundingClientRect();
    const cameraRect = camera.getBoundingClientRect();

    const doorCenterX = doorRect.left + doorRect.width * 0.5;
    const doorCenterY = doorRect.top + doorRect.height * 0.44;

    const vpCenterX = window.innerWidth * 0.5;
    const vpCenterY = window.innerHeight * 0.5;

    const openingW = doorRect.width * 0.76;
    const openingH = doorRect.height * 0.88;

    const scaleX = (window.innerWidth / Math.max(openingW, 1)) * 1.05;
    const scaleY = (window.innerHeight / Math.max(openingH, 1)) * 1.05;
    const scale = Math.max(scaleX, scaleY, 6.2);

    const originPercentX = ((doorCenterX - cameraRect.left) / cameraRect.width) * 100;
    const originPercentY = ((doorCenterY - cameraRect.top) / cameraRect.height) * 100;

    return {
      scale,
      moveX: vpCenterX - doorCenterX,
      moveY: vpCenterY - doorCenterY,
      originPercentX,
      originPercentY,
    };
  }, []);

  // Forward entrance animation (Opening door and zooming in - Smooth Opacity)
  const runDoorEntranceAnimation = useCallback(
    (index) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      if (containerRef.current) {
        containerRef.current.classList.add('is-animating');
      }

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

      setActiveDoor(index);
      setMobileActiveIndex(index);
      setIsPressing(true);
      setOpenedDoor(index);

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const doorUnit = isMobile ? mobileUnitsRef.current[index] : unitsRef.current[index];
      const doorPanel = isMobile ? mobileDoorPanelRefs.current[index] : doorPanelRefs.current[index];
      const lever = isMobile ? mobileLeverRefs.current[index] : leverRefs.current[index];
      const allUnits = isMobile ? mobileUnitsRef.current : unitsRef.current;
      const otherUnits = allUnits.filter((_, i) => i !== index && Boolean(_));

      if (prefersReducedMotion) {
        if (containerRef.current) containerRef.current.classList.remove('is-animating');
        isTransitioningRef.current = false;
        if (onNavigate) {
          onNavigate(DOORS_DATA[index].route, {
            doorIndex: index,
            skipDoorAnimation: true,
          });
        }
        return;
      }

      const metrics = getDoorZoomMetrics(index, isMobile);

      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.classList.remove('is-animating');
          }
          isTransitioningRef.current = false;
          if (onNavigate) {
            onNavigate(DOORS_DATA[index].route, {
              doorIndex: index,
              skipDoorAnimation: true,
            });
          }
        },
      });

      activeTimelineRef.current = tl;

      if (lever) {
        tl.to(lever, { rotation: -32, duration: 0.28, ease: 'sine.inOut' }, 0);
      }

      tl.to(
        ['.dinfo', doorUnit?.querySelector('.click-to-enter')],
        { opacity: 0, duration: 0.35, ease: 'sine.out', clearProps: 'transform' },
        0
      );

      if (doorPanel) {
        tl.to(
          doorPanel,
          { rotateY: 78, duration: 1.3, ease: 'power2.inOut', force3D: true },
          0.16
        );
      }

      if (cameraRef.current) {
        tl.to(
          cameraRef.current,
          {
            scale: metrics.scale,
            x: metrics.moveX,
            y: metrics.moveY,
            transformOrigin: `${metrics.originPercentX}% ${metrics.originPercentY}%`,
            duration: 1.5,
            ease: 'power2.inOut',
            force3D: true,
          },
          0.3
        );
      }

      tl.to(
        [headingRef.current, footerRef.current],
        { opacity: 0, duration: 0.85, ease: 'sine.inOut' },
        0.35
      );

      if (otherUnits.length > 0) {
        tl.to(
          otherUnits,
          { opacity: 0, duration: 0.8, ease: 'sine.inOut' },
          0.28
        );
      }

      if (portalOverlayRef.current) {
        tl.to(
          portalOverlayRef.current,
          { opacity: 1, duration: 0.75, ease: 'sine.inOut' },
          0.95
        );
      }
    },
    [getDoorZoomMetrics, onNavigate]
  );

  // Reverse exit animation (Closing door and zooming out - Smooth Opacity)
  const runDoorExitAnimation = useCallback(
    (index) => {
      const targetIndex = index >= 0 ? index : openedDoor >= 0 ? openedDoor : 0;
      isTransitioningRef.current = true;

      if (containerRef.current) {
        containerRef.current.classList.add('is-animating');
      }

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const doorUnit = isMobile ? mobileUnitsRef.current[targetIndex] : unitsRef.current[targetIndex];
      const doorPanel = isMobile ? mobileDoorPanelRefs.current[targetIndex] : doorPanelRefs.current[targetIndex];
      const lever = isMobile ? mobileLeverRefs.current[targetIndex] : leverRefs.current[targetIndex];
      const allUnits = isMobile ? mobileUnitsRef.current : unitsRef.current;
      const otherUnits = allUnits.filter((_, i) => i !== targetIndex && Boolean(_));

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        if (containerRef.current) containerRef.current.classList.remove('is-animating');
        if (cameraRef.current) gsap.set(cameraRef.current, { scale: 1, x: 0, y: 0 });
        if (doorPanel) gsap.set(doorPanel, { rotateY: 0 });
        if (lever) gsap.set(lever, { rotation: 0 });
        if (portalOverlayRef.current) gsap.set(portalOverlayRef.current, { opacity: 0 });

        setActiveDoor(-1);
        setOpenedDoor(-1);
        setIsPressing(false);
        isTransitioningRef.current = false;
        if (onExitComplete) onExitComplete();
        return;
      }

      const metrics = getDoorZoomMetrics(targetIndex, isMobile);

      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      if (cameraRef.current) {
        gsap.set(cameraRef.current, {
          scale: metrics.scale,
          x: metrics.moveX,
          y: metrics.moveY,
          transformOrigin: `${metrics.originPercentX}% ${metrics.originPercentY}%`,
          force3D: true,
        });
      }

      if (doorPanel) gsap.set(doorPanel, { rotateY: 78, force3D: true });
      if (lever) gsap.set(lever, { rotation: -32 });
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 0 });
      if (footerRef.current) gsap.set(footerRef.current, { opacity: 0 });
      if (portalOverlayRef.current) gsap.set(portalOverlayRef.current, { opacity: 1 });
      if (otherUnits.length > 0) gsap.set(otherUnits, { opacity: 0 });

      setActiveDoor(targetIndex);
      setMobileActiveIndex(targetIndex);
      setOpenedDoor(targetIndex);

      const reverseTl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.classList.remove('is-animating');
          }

          if (headingRef.current) gsap.set(headingRef.current, { clearProps: 'opacity' });
          if (footerRef.current) gsap.set(footerRef.current, { clearProps: 'opacity' });
          if (otherUnits.length > 0) gsap.set(otherUnits, { clearProps: 'opacity' });
          if (doorPanel) gsap.set(doorPanel, { clearProps: 'transform' });

          setActiveDoor(-1);
          setOpenedDoor(-1);
          setIsPressing(false);
          isTransitioningRef.current = false;

          if (doorUnit) {
            doorUnit.classList.remove('press', 'on');
          }

          if (onExitComplete) {
            onExitComplete();
          }
        },
      });

      activeTimelineRef.current = reverseTl;

      if (portalOverlayRef.current) {
        reverseTl.to(
          portalOverlayRef.current,
          { opacity: 0, duration: 0.7, ease: 'sine.inOut' },
          0
        );
      }

      if (cameraRef.current) {
        reverseTl.to(
          cameraRef.current,
          {
            scale: 1,
            x: 0,
            y: 0,
            duration: 1.5,
            ease: 'power2.inOut',
            force3D: true,
          },
          0.1
        );
      }

      reverseTl.to(
        [headingRef.current, footerRef.current],
        { opacity: 1, duration: 0.95, ease: 'sine.inOut' },
        0.55
      );

      if (otherUnits.length > 0) {
        reverseTl.to(
          otherUnits,
          { opacity: 1, duration: 0.9, ease: 'sine.inOut' },
          0.48
        );
      }

      if (doorPanel) {
        reverseTl.to(
          doorPanel,
          { rotateY: 0, duration: 1.2, ease: 'power2.inOut', force3D: true },
          0.85
        );
      }

      if (lever) {
        reverseTl.to(
          lever,
          { rotation: 0, duration: 0.4, ease: 'sine.inOut' },
          1.75
        );
      }
    },
    [getDoorZoomMetrics, openedDoor, onExitComplete]
  );

  useEffect(() => {
    if (isExiting && exitDoorIndex >= 0) {
      runDoorExitAnimation(exitDoorIndex);
    }
  }, [isExiting, exitDoorIndex, runDoorExitAnimation]);

  useImperativeHandle(ref, () => ({
    triggerEntrance: (index) => runDoorEntranceAnimation(index),
    triggerExit: (index) => runDoorExitAnimation(index),
  }));

  // Desktop Information panel positioning
  useEffect(() => {
    if (activeDoor < 0 || !wallRef.current || isTransitioningRef.current) {
      setDinfoPos((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const wallRect = wallRef.current.getBoundingClientRect();
    const currentUnit = unitsRef.current[activeDoor];
    if (!currentUnit) return;

    const doorRect = currentUnit.getBoundingClientRect();
    const cardWidth = Math.min(340, wallRect.width * 0.32);
    const gap = 28;

    const availableLeft = doorRect.left - wallRect.left;
    const availableRight = wallRect.right - doorRect.right;
    let targetLeft;

    if (availableLeft >= cardWidth + gap) {
      targetLeft = doorRect.left - wallRect.left - cardWidth - gap;
    } else if (availableRight >= cardWidth + gap) {
      targetLeft = doorRect.right - wallRect.left + gap;
    } else {
      targetLeft = (wallRect.width - cardWidth) / 2;
    }

    const targetTop = doorRect.top - wallRect.top + doorRect.height * 0.44 - 110;

    setDinfoPos({
      left: Math.max(10, Math.min(targetLeft, wallRect.width - cardWidth - 10)),
      top: Math.max(10, targetTop),
      width: cardWidth,
      visible: true,
    });
  }, [activeDoor]);

  const handleDoorClick = (index, e) => {
    if (e) e.stopPropagation();
    if (isTransitioningRef.current || openedDoor >= 0) return;
    runDoorEntranceAnimation(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDoorClick(index, e);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveDoor((prev) => (prev < 0 ? 0 : (prev + 1) % DOORS_DATA.length));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveDoor((prev) =>
        prev < 0 ? DOORS_DATA.length - 1 : (prev - 1 + DOORS_DATA.length) % DOORS_DATA.length
      );
    } else if (e.key === 'Escape') {
      if (!isTransitioningRef.current) setActiveDoor(-1);
    }
  };

  const currentMobileDoor = DOORS_DATA[mobileActiveIndex] || DOORS_DATA[0];

  return (
    <div
      ref={containerRef}
      id="doors"
      className="relative min-h-screen lg:h-screen lg:max-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col overflow-hidden select-none transition-colors duration-500 m-0 p-0"
    >
      {/* Portal Transition Overlay */}
      <div ref={portalOverlayRef} className="door-portal-overlay" aria-hidden="true" />

      {/* Main Camera Stage */}
      <div ref={cameraRef} className="doors-camera-stage">
        <main className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-20 sm:pt-24 lg:pt-8 pb-0 flex flex-col flex-1 min-h-0 justify-between">
          {/* Heading + Mobile Active Door Info & Dots */}
          <div className="w-full max-w-6xl mx-auto">
            <h1
              ref={headingRef}
              className={`doors-heading text-left lg:text-center ${headingVisible ? 'doors-heading-visible' : ''}`}
              aria-label="Magic happens behind the doors"
            >
              {'Magic happens behind the doors'.split('').map((letter, index) => (
                <span
                  key={index}
                  className="doors-heading-letter"
                  style={{ transitionDelay: `${index * 0.035}s` }}
                  aria-hidden="true"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </h1>

            {/* MOBILE (< 1024px) Active Door Details + Dots */}
            <div className="lg:hidden mt-3 mb-1 text-left">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] dark:text-white leading-snug">
                {currentMobileDoor.title}
              </h2>
              <p className="mt-0.5 text-[10px] sm:text-xs font-mono tracking-[0.14em] uppercase text-[#71717a] dark:text-[#a1a1aa]">
                {currentMobileDoor.subtitle}
              </p>

              <ul className="mt-2.5 space-y-1 text-xs sm:text-sm text-[#3f3f46] dark:text-[#d4d4d8]">
                {currentMobileDoor.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <span
                      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#171717]/10 dark:bg-white/15 text-[10px] font-bold text-[#171717] dark:text-white"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Dots */}
              <div className="mt-3 flex items-center gap-2" role="tablist" aria-label="Service doors">
                {DOORS_DATA.map((d, idx) => {
                  const isCurrent = mobileActiveIndex === idx;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Select ${d.title}`}
                      onClick={() => handleMobileDotSelect(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? 'w-6 bg-[#171717] dark:bg-white'
                          : 'w-1.5 bg-[#171717]/25 dark:bg-white/25'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* MOBILE (< 1024px) Pinned Horizontal Track With Spacing Between Doors */}
          <div
            ref={mobileViewportRef}
            className="lg:hidden relative w-full flex-1 min-h-0 flex items-end overflow-hidden pt-2 pb-0"
          >
            <div
              ref={mobileTrackRef}
              className="inline-flex items-end gap-6 sm:gap-8 pr-6 will-change-transform"
            >
              {DOORS_DATA.map((door, idx) => {
                const isSelected = mobileActiveIndex === idx;
                const isOpened = openedDoor === idx;
                const isPress = isPressing && mobileActiveIndex === idx;

                return (
                  <div
                    key={door.id}
                    ref={(el) => {
                      mobileUnitsRef.current[idx] = el;
                    }}
                    className={`unit mobile-door-unit shrink-0 ${
                      isSelected ? 'on' : ''
                    } ${isPress ? 'press' : ''}`}
                    style={{
                      '--door': door.color,
                      '--door-dk': door.colorDark,
                    }}
                  >
                    <button
                      type="button"
                      tabIndex={0}
                      aria-label={`Open the ${door.title} door`}
                      aria-expanded={isOpened}
                      className="doorway"
                      onClick={(e) => handleDoorClick(idx, e)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                    >
                      <span className="casing" />
                      <span className="opening">
                        <span className="room" />
                        <span
                          ref={(el) => {
                            mobileDoorPanelRefs.current[idx] = el;
                          }}
                          className="door"
                        >
                          <span className="door__flute" />
                          <span className="plate">
                            <span>{door.plateTop}</span>
                            <br />
                            <span>{door.plateBottom}</span>
                          </span>
                          <span className="handle">
                            <span
                              ref={(el) => {
                                mobileLeverRefs.current[idx] = el;
                              }}
                              className="handle__lever"
                            />
                            <span className="handle__lock" />
                          </span>
                        </span>
                        <span className="click-to-enter">Click to enter</span>
                        <span className="sill" />
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP (>= 1024px) Three Doors Wall */}
          <div
            ref={wallRef}
            role="region"
            aria-label="Available services"
            className={`hidden lg:flex relative w-full max-w-6xl mx-auto flex-1 min-h-0 items-end justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 pb-0 mt-auto ${
              activeDoor >= 0 ? 'doors-focus' : ''
            }`}
            onMouseLeave={() => {
              if (openedDoor < 0 && !isTransitioningRef.current) {
                setActiveDoor(-1);
              }
            }}
          >
            {/* Desktop Information Panel */}
            {activeDoor >= 0 && !isTransitioningRef.current && (
              <div
                role="tooltip"
                className={`dinfo hidden lg:block ${dinfoPos.visible ? 'on' : ''}`}
                style={{
                  left: `${dinfoPos.left}px`,
                  top: `${dinfoPos.top}px`,
                  width: `${dinfoPos.width}px`,
                }}
              >
                <h3 className="dinfo__h">{DOORS_DATA[activeDoor].title}</h3>
                <p className="dinfo__t">{DOORS_DATA[activeDoor].subtitle}</p>
                <ul className="dinfo__p">
                  {DOORS_DATA[activeDoor].features.map((feature, fIdx) => (
                    <li key={fIdx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Render Desktop Doors */}
            {DOORS_DATA.map((door, idx) => {
              const isHovered = activeDoor === idx;
              const isOpened = openedDoor === idx;
              const isPress = isPressing && activeDoor === idx;

              return (
                <div
                  key={door.id}
                  ref={(el) => {
                    unitsRef.current[idx] = el;
                  }}
                  className={`unit ${isHovered ? 'on' : ''} ${isPress ? 'press' : ''}`}
                  style={{
                    '--door': door.color,
                    '--door-dk': door.colorDark,
                  }}
                >
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={`Open the ${door.title} door`}
                    aria-expanded={isOpened}
                    className="doorway"
                    onMouseEnter={() => {
                      if (!isTransitioningRef.current) setActiveDoor(idx);
                    }}
                    onFocus={() => {
                      if (!isTransitioningRef.current) setActiveDoor(idx);
                    }}
                    onBlur={() => {
                      if (!isTransitioningRef.current && openedDoor < 0) {
                        setActiveDoor(-1);
                      }
                    }}
                    onClick={(e) => handleDoorClick(idx, e)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                  >
                    <span className="casing" />
                    <span className="opening">
                      <span className="room" />
                      <span
                        ref={(el) => {
                          doorPanelRefs.current[idx] = el;
                        }}
                        className="door"
                      >
                        <span className="door__flute" />
                        <span className="plate">
                          <span>{door.plateTop}</span>
                          <br />
                          <span>{door.plateBottom}</span>
                        </span>
                        <span className="handle">
                          <span
                            ref={(el) => {
                              leverRefs.current[idx] = el;
                            }}
                            className="handle__lever"
                          />
                          <span className="handle__lock" />
                        </span>
                      </span>
                      <span className="click-to-enter">Click to enter</span>
                      <span className="sill" />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </main>

        {/* Architectural Baseboard */}
        <footer
          ref={footerRef}
          className="architectural-baseboard w-full relative z-30 flex-shrink-0 pointer-events-none select-none"
        >
          <div className="baseboard-gold-line" />
          <div className="baseboard-upper" />
          <div className="baseboard-main" />
          <div className="baseboard-lower" />
          <div className="baseboard-shadow" />
        </footer>
      </div>
    </div>
  );
});

export default DoorsSection;