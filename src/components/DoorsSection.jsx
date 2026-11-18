import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import gsap from 'gsap';
import '../styles/DoorPage.css';

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
  const [openedDoor, setOpenedDoor] = useState(-1);
  const [isPressing, setIsPressing] = useState(false);
  const [headingVisible, setHeadingVisible] = useState(false);

  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const headingRef = useRef(null);
  const wallRef = useRef(null);
  const unitsRef = useRef([]);
  const doorPanelRefs = useRef([]);
  const leverRefs = useRef([]);
  const portalOverlayRef = useRef(null);
  const footerRef = useRef(null);

  const isTransitioningRef = useRef(false);
  const activeTimelineRef = useRef(null);

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
      { threshold: 0.3 }
    );

    observer.observe(headingElement);
    return () => observer.disconnect();
  }, []);

  // Calculate camera zoom metrics
  const getDoorZoomMetrics = useCallback((index) => {
    const doorUnit = unitsRef.current[index];
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

  // Forward entrance animation (Opening door and zooming in)
  const runDoorEntranceAnimation = useCallback(
    (index) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      setActiveDoor(index);
      setIsPressing(true);
      setOpenedDoor(index);

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const doorUnit = unitsRef.current[index];
      const doorPanel = doorPanelRefs.current[index];
      const lever = leverRefs.current[index];
      const otherUnits = unitsRef.current.filter((_, i) => i !== index && Boolean(_));

      if (prefersReducedMotion) {
        if (onNavigate) {
          onNavigate(DOORS_DATA[index].route, { doorIndex: index });
        }
        isTransitioningRef.current = false;
        return;
      }

      const metrics = getDoorZoomMetrics(index);

      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (onNavigate) {
            onNavigate(DOORS_DATA[index].route, { doorIndex: index });
          }
        },
      });

      activeTimelineRef.current = tl;

      // 1. Lever depress
      if (lever) {
        tl.to(lever, { rotation: -32, duration: 0.16, ease: 'power2.inOut' }, 0);
      }

      // 2. Hide info panel
      tl.to(['.dinfo', doorUnit?.querySelector('.click-to-enter')], { opacity: 0, duration: 0.15, ease: 'power1.out' }, 0);

      // 3. Door swing
      if (doorPanel) {
        tl.to(doorPanel, { rotateY: 78, duration: 0.78, ease: 'power2.inOut' }, 0.1);
      }

      // 4. Camera zoom
      if (cameraRef.current) {
        tl.to(
          cameraRef.current,
          {
            scale: metrics.scale,
            x: metrics.moveX,
            y: metrics.moveY,
            transformOrigin: `${metrics.originPercentX}% ${metrics.originPercentY}%`,
            duration: 0.95,
            ease: 'power2.inOut',
          },
          0.2
        );
      }

      // 5. Fade heading and footer
      tl.to([headingRef.current, footerRef.current], { opacity: 0, duration: 0.45, ease: 'power1.inOut' }, 0.3);

      // 6. Hide other doors
      if (otherUnits.length > 0) {
        tl.to(otherUnits, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 0.2);
      }

      // 7. Portal overlay
      if (portalOverlayRef.current) {
        tl.to(portalOverlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.in' }, 0.75);
      }
    },
    [getDoorZoomMetrics, onNavigate]
  );

  // Reverse exit animation (Closing door and zooming out)
  const runDoorExitAnimation = useCallback(
    (index) => {
      const targetIndex = index >= 0 ? index : openedDoor >= 0 ? openedDoor : 0;
      isTransitioningRef.current = true;

      const doorUnit = unitsRef.current[targetIndex];
      const doorPanel = doorPanelRefs.current[targetIndex];
      const lever = leverRefs.current[targetIndex];
      const otherUnits = unitsRef.current.filter((_, i) => i !== targetIndex && Boolean(_));

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
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

      const metrics = getDoorZoomMetrics(targetIndex);

      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      // Start zoomed in at the door
      if (cameraRef.current) {
        gsap.set(cameraRef.current, {
          scale: metrics.scale,
          x: metrics.moveX,
          y: metrics.moveY,
          transformOrigin: `${metrics.originPercentX}% ${metrics.originPercentY}%`,
        });
      }

      if (doorPanel) gsap.set(doorPanel, { rotateY: 78 });
      if (lever) gsap.set(lever, { rotation: -32 });
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 0 });
      if (footerRef.current) gsap.set(footerRef.current, { opacity: 0 });
      if (portalOverlayRef.current) gsap.set(portalOverlayRef.current, { opacity: 1 });
      if (otherUnits.length > 0) gsap.set(otherUnits, { opacity: 0 });

      setActiveDoor(targetIndex);
      setOpenedDoor(targetIndex);

      const reverseTl = gsap.timeline({
        onComplete: () => {
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

      // 1. Fade portal overlay
      if (portalOverlayRef.current) {
        reverseTl.to(portalOverlayRef.current, { opacity: 0, duration: 0.28, ease: 'power1.out' }, 0);
      }

      // 2. Camera zooms out to normal view
      if (cameraRef.current) {
        reverseTl.to(
          cameraRef.current,
          {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.95,
            ease: 'power2.inOut',
          },
          0.04
        );
      }

      // 3. Fade heading and footer back in
      reverseTl.to([headingRef.current, footerRef.current], { opacity: 1, duration: 0.55, ease: 'power1.out' }, 0.45);

      // 4. Fade neighboring doors back in
      if (otherUnits.length > 0) {
        reverseTl.to(otherUnits, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0.4);
      }

      // 5. Door swings closed
      if (doorPanel) {
        reverseTl.to(doorPanel, { rotateY: 0, duration: 0.62, ease: 'power2.inOut' }, 0.62);
      }

      // 6. Lever handle returns to resting position
      if (lever) {
        reverseTl.to(lever, { rotation: 0, duration: 0.22, ease: 'power2.out' }, 0.9);
      }
    },
    [getDoorZoomMetrics, openedDoor, onExitComplete]
  );

  // Watch for exit trigger prop changes from App.jsx
  useEffect(() => {
    if (isExiting && exitDoorIndex >= 0) {
      runDoorExitAnimation(exitDoorIndex);
    }
  }, [isExiting, exitDoorIndex, runDoorExitAnimation]);

  // Expose imperative methods to parent (App.jsx)
  useImperativeHandle(ref, () => ({
    triggerEntrance: (index) => runDoorEntranceAnimation(index),
    triggerExit: (index) => runDoorExitAnimation(index),
  }));

  // Information panel positioning
  useEffect(() => {
    if (activeDoor < 0 || !wallRef.current || isTransitioningRef.current) {
      setDinfoPos((prev) => ({ ...prev, visible: false }));
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
      setActiveDoor((prev) => (prev < 0 ? DOORS_DATA.length - 1 : (prev - 1 + DOORS_DATA.length) % DOORS_DATA.length));
    } else if (e.key === 'Escape') {
      if (!isTransitioningRef.current) setActiveDoor(-1);
    }
  };

  return (
    <div
      ref={containerRef}
      id="doors"
      className="relative h-screen max-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col overflow-hidden select-none transition-colors duration-500 m-0 p-0"
    >
      {/* Portal Transition Overlay */}
      <div ref={portalOverlayRef} className="door-portal-overlay" aria-hidden="true" />

      {/* Main Camera Stage */}
      <div ref={cameraRef} className="doors-camera-stage">
        <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-0 flex flex-col flex-1 min-h-0 items-center justify-between">
          
          {/* Heading */}
          <h1
            ref={headingRef}
            className={`doors-heading ${headingVisible ? 'doors-heading-visible' : ''}`}
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

          {/* Three Doors Wall */}
          <div
            ref={wallRef}
            role="region"
            aria-label="Available services"
            className={`relative w-full max-w-6xl flex flex-1 min-h-0 items-end justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 pb-0 mt-auto ${
              activeDoor >= 0 ? 'doors-focus' : ''
            }`}
            onMouseLeave={() => {
              if (openedDoor < 0 && !isTransitioningRef.current) {
                setActiveDoor(-1);
              }
            }}
          >
            {/* Desktop Information Panel */}
            {activeDoor >= 0 && (
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

            {/* Render Doors */}
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
                        style={{
                          transform: isOpened
                            ? 'rotateY(78deg)'
                            : isHovered
                            ? 'rotateY(16deg)'
                            : 'rotateY(0deg)',
                        }}
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

          {/* Mobile Information Drawer */}
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
                    <span className="mr-2 text-[#a88a4b] font-bold">✔</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
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