import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Menu } from 'lucide-react';

export default function Header({
  activeSection = 'home',
  onNavigate,
  onOpenMenu,
  onOpenContact,
  currentRoute = '/',
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  const [timeInfo, setTimeInfo] = useState({
    time: '2:37pm',
    date: '12 November, 2026',
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 150);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Indian Standard Time.
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      try {
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        const dateFormatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        setTimeInfo({
          time: timeFormatter.format(now).toLowerCase().replace(' ', ''),
          date: dateFormatter.format(now),
        });
      } catch {
        // Keep the last valid time.
      }
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Home', target: '#home', route: '/' },
    {
      label: 'App Development',
      target: '#door',
      route: '/app-developer/',
      doorIndex: 0,
    },
    {
      label: 'UI/UX Design',
      target: '#door',
      route: '/ui-ux/',
      doorIndex: 1,
    },
    {
      label: 'App Deployment',
      target: '#door',
      route: '/app-deployment/',
      doorIndex: 2,
    },
    { label: 'My story', target: '#about', route: '/' },
    { label: 'Contact', target: '#contact-footer', isContact: true },
  ];

  const handleLinkClick = (event, link) => {
    event.preventDefault();

    if (link.isContact) {
      if (onOpenContact) onOpenContact();
      else if (onNavigate) onNavigate('#contact-footer');
      return;
    }

    if (!onNavigate) return;

    if (link.route && link.route !== '/') {
      if (currentRoute === link.route) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onNavigate(link.route, { doorIndex: link.doorIndex });
      }
      return;
    }

    if (currentRoute !== '/' && link.route === '/') {
      onNavigate('/', {
        isBack: true,
        afterExitScrollTarget: link.target,
      });
      return;
    }

    if (link.target === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (link.target.startsWith('#')) onNavigate(link.target);
    else onNavigate(link.route || '/');
  };

  const isHomePage = currentRoute === '/';

  return (
    <header
      className={`fixed left-0 right-0 z-[10000] flex items-center justify-center px-4 pointer-events-none transition-all duration-300 ${
        isHomePage ? 'top-4 sm:top-6' : 'top-4'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto relative w-full md:w-auto justify-center">

        {/* Desktop Navigation */}
        <nav
          className="glass-pill hidden md:flex items-center gap-1 p-1.5 rounded-full"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const isActive =
              (currentRoute === '/' &&
                link.label === 'Home' &&
                activeSection === 'home') ||
              (currentRoute === '/' &&
                link.label === 'My story' &&
                activeSection === 'about') ||
              (currentRoute === '/app-developer/' &&
                link.label === 'App Development') ||
              (currentRoute === '/ui-ux/' &&
                link.label === 'UI/UX Design') ||
              (currentRoute === '/app-deployment/' &&
                link.label === 'App Deployment');

            return (
              <a
                key={link.label}
                href={link.target}
                onClick={(event) => handleLinkClick(event, link)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#111111] text-[#f8f6f2] shadow-sm dark:bg-[#f8f6f2] dark:text-[#111111]'
                    : 'text-foreground/75 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Time Pill */}
        <div
          className={`glass-pill items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm text-foreground/80 font-medium ${
            isHomePage ? 'flex' : 'hidden'
          } md:flex`}
          title="Indian Standard Time (IST UTC+5:30)"
        >
          <Clock className="w-3.5 h-3.5 text-accent opacity-90" />

          <span>
            Local time{' '}
            <strong className="font-semibold text-foreground">
              {timeInfo.time}
            </strong>
          </span>

          <span className="opacity-40">·</span>

          <Calendar className="w-3.5 h-3.5 text-accent opacity-90 hidden sm:inline" />

          <span className="hidden sm:inline">
            {timeInfo.date}
          </span>
        </div>

        {/* Mobile Menu - Right Side */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="md:hidden glass-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-foreground cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ml-auto"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>

      </div>
    </header>
  );
}