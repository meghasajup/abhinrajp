import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/Header.jsx';
import ThemeCord from './components/ThemeCord.jsx';
import Hero from './components/Hero.jsx';
import DoorsSection from './components/DoorsSection.jsx';
import StorySection from './components/StorySection.jsx';
import Footer from './components/Footer.jsx';
import MenuDrawer from './components/MenuDrawer.jsx';
import HireModal from './components/HireModal.jsx';
import AppDevelopment from './components/AppDevelopment.jsx';
import UiUxDesign from './components/UX-Design.jsx';
import AppDeployment from './components/AppDeplyment.jsx';
import ContactPage from './components/ContactPage.jsx';

import { ArrowUp } from 'lucide-react';
import './styles/DoorPage.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
}

const getDoorIndexFromTarget = (target = '') => {
  if (target.includes('app-developer')) return 0;
  if (target.includes('ui-ux')) return 1;
  if (target.includes('app-deployment')) return 2;
  return -1;
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [activeDoorIndex, setActiveDoorIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '';

      if (path.includes('app-developer')) return 0;
      if (path.includes('ui-ux')) return 1;
      if (path.includes('app-deployment')) return 2;
    }

    return -1;
  });

  const [isDoorsExiting, setIsDoorsExiting] = useState(false);

  // Pending route queue for smooth chain transition
  const [pendingRoute, setPendingRoute] = useState(null);
  const [pendingDoorIndex, setPendingDoorIndex] = useState(-1);

  const isTransitioningRef = useRef(false);
  const serviceWrapperRef = useRef(null);
  const doorsSectionRef = useRef(null);

  const chainTimeoutRef = useRef(null);
  const entranceTimeoutRef = useRef(null);
  const afterExitTargetRef = useRef(null);
  const scrollWaitCleanupRef = useRef(null);

  // Cleanup timers and pending scroll animation
  useEffect(() => {
    return () => {
      if (chainTimeoutRef.current) {
        clearTimeout(chainTimeoutRef.current);
      }

      if (entranceTimeoutRef.current) {
        clearTimeout(entranceTimeoutRef.current);
      }

      if (scrollWaitCleanupRef.current) {
        scrollWaitCleanupRef.current();
      }
    };
  }, []);

  // PRELOADER
  useEffect(() => {
    let progress = 1;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5;

      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        clearInterval(interval);

        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      } else {
        setLoadingProgress(progress);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDark;

    setIsDark(nextMode);

    if (nextMode) {
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-mode');
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle scroll and active section
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      if (currentRoute === '/') {
        const worksEl = document.getElementById('doors');
        const aboutEl = document.getElementById('about');
        const scrollY = window.scrollY + 300;

        if (aboutEl && scrollY >= aboutEl.offsetTop) {
          setActiveSection('about');
        } else if (worksEl && scrollY >= worksEl.offsetTop) {
          setActiveSection('works');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentRoute]);

  // Scroll to top on service page
  useEffect(() => {
    if (currentRoute !== '/') {
      window.scrollTo(0, 0);
      setShowScrollTop(false);
      setActiveSection('');
    }
  }, [currentRoute]);

  // Service page entrance animation
  useEffect(() => {
    if (currentRoute !== '/' && serviceWrapperRef.current) {
      const prefersReducedMotion =
        window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

      if (prefersReducedMotion) {
        gsap.set(serviceWrapperRef.current, {
          opacity: 1,
          scale: 1
        });

        isTransitioningRef.current = false;
        return;
      }

      gsap.fromTo(
        serviceWrapperRef.current,
        {
          opacity: 0,
          scale: 0.94,
          borderRadius: '48px'
        },
        {
          opacity: 1,
          scale: 1,
          borderRadius: '0px',
          duration: 0.8,
          ease: 'sine.out',
          clearProps: 'borderRadius,transform',
          onComplete: () => {
            isTransitioningRef.current = false;

            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.refresh();
            }
          }
        }
      );
    }
  }, [currentRoute]);

  // Wait until smooth scrolling has actually finished
  const waitForScrollToFinish = useCallback(
    (element, callback) => {
      if (!element) {
        callback();
        return () => {};
      }

      let animationFrame = null;
      let startTime = null;
      let previousTop = element.getBoundingClientRect().top;
      let stableFrames = 0;
      let cancelled = false;

      const checkScroll = (timestamp) => {
        if (cancelled) return;

        if (startTime === null) {
          startTime = timestamp;
        }

        const currentTop =
          element.getBoundingClientRect().top;

        const difference = Math.abs(
          currentTop - previousTop
        );

        const elapsed = timestamp - startTime;

        if (difference < 0.5 && elapsed > 180) {
          stableFrames++;
        } else {
          stableFrames = 0;
        }

        previousTop = currentTop;

        // Scroll is stable for several frames
        // or maximum waiting time has been reached
        if (stableFrames >= 8 || elapsed >= 3500) {
          if (!cancelled) {
            scrollWaitCleanupRef.current = null;
            callback();
          }

          return;
        }

        animationFrame = requestAnimationFrame(checkScroll);
      };

      animationFrame = requestAnimationFrame(checkScroll);

      // Return cleanup function
      return () => {
        cancelled = true;

        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
        }
      };
    },
    []
  );

  const scrollAfterDoorClose = useCallback((scrollTarget) => {
    setTimeout(() => {
      if (scrollTarget === '#home') {
        const heroEl = document.getElementById('home');

        if (heroEl) {
          heroEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }

        return;
      }

      if (scrollTarget && scrollTarget.startsWith('#')) {
        const targetEl = document.querySelector(scrollTarget);

        if (targetEl) {
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          return;
        }
      }

      const doorsEl = document.getElementById('doors');

      if (doorsEl) {
        doorsEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 60);
  }, []);

  // COMPLETE HANDLER FOR REVERSE DOOR EXIT ANIMATION
  const handleExitComplete = useCallback(() => {
    setIsDoorsExiting(false);

    // Chain transition from one service page to another
    if (pendingRoute && pendingRoute !== '/') {
      const nextRoute = pendingRoute;
      const nextDoorIdx = pendingDoorIndex;

      setPendingRoute(null);
      setPendingDoorIndex(-1);
      setActiveDoorIndex(-1);

      afterExitTargetRef.current = null;

      const doorsEl = document.getElementById('doors');

      if (doorsEl) {
        doorsEl.scrollIntoView({
          behavior: 'instant',
          block: 'center'
        });
      }

      if (chainTimeoutRef.current) {
        clearTimeout(chainTimeoutRef.current);
      }

      chainTimeoutRef.current = setTimeout(() => {
        setActiveDoorIndex(nextDoorIdx);

        if (doorsSectionRef.current?.triggerEntrance) {
          isTransitioningRef.current = false;

          doorsSectionRef.current.triggerEntrance(
            nextDoorIdx
          );
        } else {
          setCurrentRoute(nextRoute);
          isTransitioningRef.current = false;

          try {
            window.history.pushState(
              {
                route: nextRoute,
                doorIndex: nextDoorIdx
              },
              '',
              nextRoute
            );
          } catch (e) {
            window.location.hash =
              nextRoute.replace(/\//g, '');
          }
        }
      }, 250);

      return;
    }

    const scrollTarget = afterExitTargetRef.current;
    afterExitTargetRef.current = null;

    setActiveDoorIndex(-1);
    isTransitioningRef.current = false;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    scrollAfterDoorClose(scrollTarget);
  }, [
    pendingRoute,
    pendingDoorIndex,
    scrollAfterDoorClose
  ]);

  // MASTER NAVIGATION HANDLER
  const navigateTo = useCallback(
    (target, options = {}) => {
      const {
        doorIndex,
        isBack,
        skipDoorAnimation,
        afterExitScrollTarget
      } = options;

      // Called when DoorsSection finishes its entrance animation
      if (skipDoorAnimation) {
        const resolvedIdx =
          doorIndex !== undefined
            ? doorIndex
            : getDoorIndexFromTarget(target);

        if (resolvedIdx >= 0) {
          setActiveDoorIndex(resolvedIdx);
        }

        setIsDoorsExiting(false);
        setCurrentRoute(target);
        setIsMenuOpen(false);

        try {
          window.history.pushState(
            {
              route: target,
              doorIndex: resolvedIdx
            },
            '',
            target
          );
        } catch (e) {
          window.location.hash =
            target.replace(/\//g, '');
        }

        return;
      }

      // 1. CHAIN NAVIGATION FROM SERVICE PAGE TO ANOTHER SERVICE PAGE
      if (
        currentRoute !== '/' &&
        target !== '/' &&
        target !== '#works' &&
        target !== '#doors' &&
        target !== '#home' &&
        !isBack
      ) {
        if (isTransitioningRef.current) return;

        isTransitioningRef.current = true;

        const targetDoorIdx =
          doorIndex !== undefined
            ? doorIndex
            : getDoorIndexFromTarget(target);

        const exitIdx =
          activeDoorIndex >= 0
            ? activeDoorIndex
            : 0;

        afterExitTargetRef.current = null;

        setPendingRoute(target);
        setPendingDoorIndex(targetDoorIdx);

        const prefersReducedMotion =
          window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;

        if (
          prefersReducedMotion ||
          !serviceWrapperRef.current
        ) {
          setCurrentRoute(target);
          setActiveDoorIndex(targetDoorIdx);
          isTransitioningRef.current = false;

          window.history.pushState(null, '', target);
          setIsMenuOpen(false);

          return;
        }

        const doorsEl = document.getElementById('doors');

        if (doorsEl) {
          doorsEl.scrollIntoView({
            behavior: 'instant',
            block: 'center'
          });
        } else {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'instant'
          });
        }

        gsap.to(serviceWrapperRef.current, {
          opacity: 0,
          scale: 0.94,
          borderRadius: '48px',
          duration: 0.6,
          ease: 'sine.inOut',

          onComplete: () => {
            setActiveDoorIndex(exitIdx);
            setIsDoorsExiting(true);
            setCurrentRoute('/');

            try {
              window.history.pushState(null, '', '/');
            } catch (e) {
              window.location.hash = '';
            }
          }
        });

        setIsMenuOpen(false);
        return;
      }

      // 2. STANDARD BACK TO DOORS / HOME / STORY
      if (
        currentRoute !== '/' &&
        (
          isBack ||
          target === '/' ||
          target === '#works' ||
          target === '#doors' ||
          target === '#home'
        )
      ) {
        if (isTransitioningRef.current) return;

        isTransitioningRef.current = true;

        const exitIdx =
          doorIndex !== undefined
            ? doorIndex
            : activeDoorIndex >= 0
              ? activeDoorIndex
              : 0;

        const resolvedScrollTarget =
          afterExitScrollTarget ||
          (target === '#home' ? '#home' : null);

        afterExitTargetRef.current = resolvedScrollTarget;

        const prefersReducedMotion =
          window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;

        if (
          prefersReducedMotion ||
          !serviceWrapperRef.current
        ) {
          setCurrentRoute('/');
          setActiveDoorIndex(-1);
          setIsDoorsExiting(false);
          isTransitioningRef.current = false;

          window.history.pushState(null, '', '/');
          setIsMenuOpen(false);

          scrollAfterDoorClose(resolvedScrollTarget);
          return;
        }

        // Contact page has no door
        if (currentRoute.includes('contact')) {
          gsap.to(serviceWrapperRef.current, {
            opacity: 0,
            scale: 0.94,
            borderRadius: '48px',
            duration: 0.5,
            ease: 'sine.inOut',

            onComplete: () => {
              setCurrentRoute('/');
              setActiveDoorIndex(-1);
              setIsDoorsExiting(false);
              isTransitioningRef.current = false;

              try {
                window.history.pushState(null, '', '/');
              } catch (e) {
                window.location.hash = '';
              }

              scrollAfterDoorClose(
                resolvedScrollTarget || '#home'
              );
            }
          });

          setIsMenuOpen(false);
          return;
        }

        const doorsEl = document.getElementById('doors');

        if (doorsEl) {
          doorsEl.scrollIntoView({
            behavior: 'instant',
            block: 'center'
          });
        } else {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'instant'
          });
        }

        gsap.to(serviceWrapperRef.current, {
          opacity: 0,
          scale: 0.94,
          borderRadius: '48px',
          duration: 0.6,
          ease: 'sine.inOut',

          onComplete: () => {
            setActiveDoorIndex(exitIdx);
            setIsDoorsExiting(true);
            setCurrentRoute('/');

            try {
              window.history.pushState(null, '', '/');
            } catch (e) {
              window.location.hash = '';
            }
          }
        });

        setIsMenuOpen(false);
        return;
      }

      // 3. ANCHOR SCROLL
      if (target === '#home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        setIsMenuOpen(false);
        return;
      }

      if (target.startsWith('#')) {
        const el = document.querySelector(target);

        if (el) {
          el.scrollIntoView({
            behavior: 'smooth'
          });
        }

        setIsMenuOpen(false);
        return;
      }

      // 4. FORWARD ENTRY FROM HOME PAGE
      // Scroll to doors first, then open the selected door.
      const targetDoorIdx =
        doorIndex !== undefined
          ? doorIndex
          : getDoorIndexFromTarget(target);

      if (currentRoute === '/' && targetDoorIdx >= 0) {
        if (isTransitioningRef.current) return;

        setIsMenuOpen(false);
        setIsDoorsExiting(false);
        setActiveDoorIndex(targetDoorIdx);

        const doorsEl = document.getElementById('doors');

        if (!doorsEl) {
          console.warn('Doors section not found.');
          return;
        }

        // Cancel any previous pending scroll check
        if (scrollWaitCleanupRef.current) {
          scrollWaitCleanupRef.current();
          scrollWaitCleanupRef.current = null;
        }

        const openSelectedDoor = () => {
          if (!doorsSectionRef.current?.triggerEntrance) {
            console.warn(
              'Door entrance animation is not ready.'
            );
            return;
          }

          doorsSectionRef.current.triggerEntrance(
            targetDoorIdx
          );
        };

        const prefersReducedMotion =
          window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;

        const alreadyAtDoors =
          Math.abs(
            doorsEl.getBoundingClientRect().top
          ) < 80;

        if (alreadyAtDoors || prefersReducedMotion) {
          if (!alreadyAtDoors) {
            doorsEl.scrollIntoView({
              behavior: 'instant',
              block: 'center'
            });
          }

          requestAnimationFrame(() => {
            openSelectedDoor();
          });

          return;
        }

        // Smooth scroll to door section
        doorsEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Wait for scroll completion before opening door
        scrollWaitCleanupRef.current =
          waitForScrollToFinish(
            doorsEl,
            openSelectedDoor
          );

        return;
      }

      // 5. FALLBACK NAVIGATION
      if (targetDoorIdx >= 0) {
        setActiveDoorIndex(targetDoorIdx);
      }

      if (
        currentRoute !== '/' &&
        serviceWrapperRef.current
      ) {
        isTransitioningRef.current = true;

        gsap.to(serviceWrapperRef.current, {
          opacity: 0,
          scale: 0.94,
          borderRadius: '48px',
          duration: 0.5,
          ease: 'sine.inOut',

          onComplete: () => {
            setCurrentRoute(target);

            try {
              window.history.pushState(
                {
                  route: target,
                  doorIndex: targetDoorIdx
                },
                '',
                target
              );
            } catch (e) {
              window.location.hash =
                target.replace(/\//g, '');
            }
          }
        });

        setIsMenuOpen(false);
        return;
      }

      setIsDoorsExiting(false);
      setCurrentRoute(target);

      try {
        window.history.pushState(
          {
            route: target,
            doorIndex: targetDoorIdx
          },
          '',
          target
        );
      } catch (e) {
        window.location.hash =
          target.replace(/\//g, '');
      }

      setIsMenuOpen(false);
    },
    [
      currentRoute,
      activeDoorIndex,
      scrollAfterDoorClose,
      waitForScrollToFinish
    ]
  );

  // Browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname || '/';

      if (
        currentRoute !== '/' &&
        (newPath === '/' || newPath === '')
      ) {
        navigateTo('/', {
          isBack: true
        });

        return;
      }

      if (currentRoute === '/' && newPath !== '/') {
        let doorIdx = 0;

        if (newPath.includes('ui-ux')) {
          doorIdx = 1;
        } else if (newPath.includes('app-deployment')) {
          doorIdx = 2;
        }

        navigateTo(newPath, {
          doorIndex: doorIdx
        });

        return;
      }

      setCurrentRoute(newPath);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentRoute, navigateTo]);

  const openContact = () => {
    setIsHireModalOpen(true);
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/app-developer/':
      case '/app-developer':
        return (
          <div
            ref={serviceWrapperRef}
            className="service-page-wrapper"
          >
            <AppDevelopment
              onNavigate={navigateTo}
              onOpenContact={openContact}
            />
          </div>
        );

      case '/ui-ux/':
      case '/ui-ux':
        return (
          <div
            ref={serviceWrapperRef}
            className="service-page-wrapper"
          >
            <UiUxDesign
              onNavigate={navigateTo}
              onOpenContact={openContact}
            />
          </div>
        );

      case '/app-deployment/':
      case '/app-deployment':
        return (
          <div
            ref={serviceWrapperRef}
            className="service-page-wrapper"
          >
            <AppDeployment
              onNavigate={navigateTo}
              onOpenContact={openContact}
            />
          </div>
        );

      case '/contact/':
      case '/contact':
        return (
          <div
            ref={serviceWrapperRef}
            className="service-page-wrapper"
          >
            <ContactPage onNavigate={navigateTo} />
          </div>
        );

      default:
        return (
          <main>
            <Hero
              onOpenContact={openContact}
              onNavigate={navigateTo}
            />

            <DoorsSection
              ref={doorsSectionRef}
              onNavigate={navigateTo}
              isExiting={isDoorsExiting}
              exitDoorIndex={activeDoorIndex}
              onExitComplete={handleExitComplete}
            />

            <StorySection onNavigate={navigateTo} />
          </main>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* PRELOADER */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f8f6f2] dark:bg-[#111111] transition-opacity duration-500 text-foreground">
          <div className="flex flex-col items-center gap-4">
            <span className="font-extrabold text-3xl tracking-tight">
              Abhinraj<span className="text-accent">.</span>
            </span>

            <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />

              <span>
                INITIALIZING{' '}
                {String(loadingProgress).padStart(3, '0')}%
              </span>
            </div>

            <div className="w-48 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-accent transition-all duration-75 ease-out"
                style={{
                  width: `${loadingProgress}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <Header
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenContact={openContact}
        currentRoute={currentRoute}
      />

      <ThemeCord
        isDark={isDark}
        onToggle={toggleDarkMode}
      />

      {/* CURRENT PAGE */}
      {renderCurrentPage()}

      <Footer
        onOpenContact={openContact}
        onNavigate={navigateTo}
      />

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#111111] text-[#f8f6f2] dark:bg-[#f8f6f2] dark:text-[#111111] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Scroll back to top"
          aria-label="Scroll back to top of page"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* MENU DRAWER */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={navigateTo}
        onOpenContact={openContact}
      />

      {/* HIRE MODAL */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />

    </div>
  );
}
