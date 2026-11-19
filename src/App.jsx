import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // PRELOADER
  useEffect(() => {
    let progress = 1;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5;
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 300);
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  useEffect(() => {
    if (currentRoute !== '/') {
      window.scrollTo(0, 0);
      setShowScrollTop(false);
      setActiveSection('');
    }
  }, [currentRoute]);

  useEffect(() => {
    if (currentRoute !== '/' && serviceWrapperRef.current) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        gsap.set(serviceWrapperRef.current, { opacity: 1, scale: 1 });
        isTransitioningRef.current = false;
        return;
      }

      gsap.fromTo(
        serviceWrapperRef.current,
        { opacity: 0, scale: 0.94, borderRadius: '48px' },
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
          },
        }
      );
    }
  }, [currentRoute]);

  // COMPLETE HANDLER FOR REVERSE DOOR EXIT ANIMATION
  const handleExitComplete = useCallback(() => {
    setIsDoorsExiting(false);

    // If header navigation triggered a chain transition, pause briefly after door closes, then open next door
    if (pendingRoute && pendingRoute !== '/') {
      const nextRoute = pendingRoute;
      const nextDoorIdx = pendingDoorIndex;

      setPendingRoute(null);
      setPendingDoorIndex(-1);
      setActiveDoorIndex(-1);

      setTimeout(() => {
        setActiveDoorIndex(nextDoorIdx);
        if (doorsSectionRef.current && doorsSectionRef.current.triggerEntrance) {
          doorsSectionRef.current.triggerEntrance(nextDoorIdx);
        } else {
          setCurrentRoute(nextRoute);
          try {
            window.history.pushState({ route: nextRoute, doorIndex: nextDoorIdx }, '', nextRoute);
          } catch (e) {
            window.location.hash = nextRoute.replace(/\//g, '');
          }
        }
      }, 350);
      return;
    }

    setActiveDoorIndex(-1);
    isTransitioningRef.current = false;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    setTimeout(() => {
      const doorsEl = document.getElementById('doors');
      if (doorsEl) {
        doorsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  }, [pendingRoute, pendingDoorIndex]);

  // MASTER NAVIGATION HANDLER
  const navigateTo = useCallback(
    (target, options = {}) => {
      const { doorIndex, isBack } = options;

      // 1. CHAIN NAVIGATION FROM HEADER (Service page -> Another Service page)
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

        let targetDoorIdx = doorIndex;
        if (targetDoorIdx === undefined) {
          if (target.includes('app-developer')) targetDoorIdx = 0;
          else if (target.includes('ui-ux')) targetDoorIdx = 1;
          else if (target.includes('app-deployment')) targetDoorIdx = 2;
        }

        const exitIdx = activeDoorIndex >= 0 ? activeDoorIndex : 0;

        setPendingRoute(target);
        setPendingDoorIndex(targetDoorIdx);

        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || !serviceWrapperRef.current) {
          setCurrentRoute(target);
          setActiveDoorIndex(targetDoorIdx);
          isTransitioningRef.current = false;
          window.history.pushState(null, '', target);
          return;
        }

        const doorsEl = document.getElementById('doors');
        if (doorsEl) {
          doorsEl.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
          window.scrollTo({ top: window.innerHeight, behavior: 'instant' });
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
          },
        });

        setIsMenuOpen(false);
        return;
      }

      // 2. STANDARD BACK TO DOORS
      if (
        currentRoute !== '/' &&
        (isBack ||
          target === '/' ||
          target === '#works' ||
          target === '#doors' ||
          target === '#home')
      ) {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;

        const exitIdx =
          doorIndex !== undefined
            ? doorIndex
            : activeDoorIndex >= 0
            ? activeDoorIndex
            : 0;

        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || !serviceWrapperRef.current) {
          setCurrentRoute('/');
          setActiveDoorIndex(-1);
          setIsDoorsExiting(false);
          isTransitioningRef.current = false;
          window.history.pushState(null, '', '/');
          return;
        }

        const doorsEl = document.getElementById('doors');
        if (doorsEl) {
          doorsEl.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
          window.scrollTo({ top: window.innerHeight, behavior: 'instant' });
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
          },
        });

        setIsMenuOpen(false);
        return;
      }

      // 3. ANCHOR SCROLL
      if (target.startsWith('#')) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
        return;
      }

      // 4. FORWARD ENTRY FROM HOME PAGE
      let targetDoorIdx = doorIndex;
      if (targetDoorIdx === undefined) {
        if (target.includes('app-developer')) targetDoorIdx = 0;
        else if (target.includes('ui-ux')) targetDoorIdx = 1;
        else if (target.includes('app-deployment')) targetDoorIdx = 2;
      }

      if (targetDoorIdx !== undefined && targetDoorIdx >= 0) {
        setActiveDoorIndex(targetDoorIdx);
      }

      if (currentRoute !== '/' && serviceWrapperRef.current) {
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
                { route: target, doorIndex: targetDoorIdx },
                '',
                target
              );
            } catch (e) {
              window.location.hash = target.replace(/\//g, '');
            }
          },
        });
        setIsMenuOpen(false);
        return;
      }

      setIsDoorsExiting(false);
      setCurrentRoute(target);

      try {
        window.history.pushState(
          { route: target, doorIndex: targetDoorIdx },
          '',
          target
        );
      } catch (e) {
        window.location.hash = target.replace(/\//g, '');
      }

      setIsMenuOpen(false);
    },
    [currentRoute, activeDoorIndex]
  );

  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname || '/';
      if (currentRoute !== '/' && (newPath === '/' || newPath === '')) {
        navigateTo('/', { isBack: true });
        return;
      }
      if (currentRoute === '/' && newPath !== '/') {
        let doorIdx = 0;
        if (newPath.includes('ui-ux')) doorIdx = 1;
        else if (newPath.includes('app-deployment')) doorIdx = 2;

        navigateTo(newPath, { doorIndex: doorIdx });
        return;
      }
      setCurrentRoute(newPath);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentRoute, navigateTo]);

  const openContact = () => setIsHireModalOpen(true);

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/app-developer/':
      case '/app-developer':
        return (
          <div ref={serviceWrapperRef} className="service-page-wrapper">
            <AppDevelopment onNavigate={navigateTo} onOpenContact={openContact} />
          </div>
        );
      case '/ui-ux/':
      case '/ui-ux':
        return (
          <div ref={serviceWrapperRef} className="service-page-wrapper">
            <UiUxDesign onNavigate={navigateTo} onOpenContact={openContact} />
          </div>
        );
      case '/app-deployment/':
      case '/app-deployment':
        return (
          <div ref={serviceWrapperRef} className="service-page-wrapper">
            <AppDeployment onNavigate={navigateTo} onOpenContact={openContact} />
          </div>
        );
      case '/contact/':
      case '/contact':
        return (
          <div ref={serviceWrapperRef} className="service-page-wrapper">
            <ContactPage onNavigate={navigateTo} />
          </div>
        );
      default:
        return (
          <main>
            <Hero onOpenContact={openContact} onNavigate={navigateTo} />
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
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f8f6f2] dark:bg-[#111111] transition-opacity duration-500 text-foreground">
          <div className="flex flex-col items-center gap-4">
            <span className="font-extrabold text-3xl tracking-tight">
              Abhinraj<span className="text-accent">.</span>
            </span>
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>INITIALIZING {String(loadingProgress).padStart(3, '0')}%</span>
            </div>
            <div className="w-48 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-accent transition-all duration-75 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <Header
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenContact={openContact}
        currentRoute={currentRoute}
      />

      <ThemeCord isDark={isDark} onToggle={toggleDarkMode} />

      {renderCurrentPage()}

      <Footer onOpenContact={openContact} onNavigate={navigateTo} />

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#111111] text-[#f8f6f2] dark:bg-[#f8f6f2] dark:text-[#111111] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Scroll back to top"
          aria-label="Scroll back to top of page"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={navigateTo}
        onOpenContact={openContact}
      />

      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </div>
  );
}