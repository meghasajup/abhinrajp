import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function MenuDrawer({
  isOpen,
  onClose,
  onNavigate,
  onOpenContact,
  currentRoute = '/',
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { num: '01', title: 'Home', target: '#home', route: '/' },
    {
      num: '02',
      title: 'App Development',
      target: '#door',
      route: '/app-developer/',
      doorIndex: 0,
    },
    {
      num: '03',
      title: 'UI/UX Design',
      target: '#door',
      route: '/ui-ux/',
      doorIndex: 1,
    },
    {
      num: '04',
      title: 'App Deployment',
      target: '#door',
      route: '/app-deployment/',
      doorIndex: 2,
    },
    { num: '05', title: 'My story', target: '#about', route: '/' },
    { num: '06', title: 'Contact', target: '#contact-footer', isContact: true },
  ];

  const handleItemClick = (item) => {
    onClose();

    if (item.isContact) {
      if (onOpenContact) {
        onOpenContact();
      } else if (onNavigate) {
        onNavigate('#contact-footer');
      }
      return;
    }

    if (!onNavigate) return;

    if (item.route && item.route !== '/') {
      if (currentRoute === item.route) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onNavigate(item.route, { doorIndex: item.doorIndex });
      }
      return;
    }

    if (currentRoute !== '/' && item.route === '/') {
      onNavigate('/', {
        isBack: true,
        afterExitScrollTarget: item.target,
      });
      return;
    }

    if (item.target === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (item.target.startsWith('#')) {
      onNavigate(item.target);
    } else {
      onNavigate(item.route || '/');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10001] flex flex-col justify-between p-6 sm:p-12 bg-[#0d0d0d]/95 backdrop-blur-2xl text-[#f8f6f2] transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation Menu"
    >
      {/* Top Header with Close Button */}
      <div className="flex items-center justify-between max-w-[88rem] w-full mx-auto">
        <span className="font-extrabold text-2xl tracking-tight">
          Abhinraj<span className="text-accent">.</span>
        </span>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8f6f2] text-[#111111] hover:bg-white text-xs font-mono uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>

      {/* Center Links */}
      <nav className="max-w-[88rem] w-full mx-auto my-auto py-8" aria-label="Mobile Navigation">
        <ul className="flex flex-col gap-2 sm:gap-4">
          {menuItems.map((item) => (
            <li key={item.num}>
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className="group flex items-baseline gap-4 sm:gap-8 text-left transition-transform hover:translate-x-3 cursor-pointer py-1 w-full"
              >
                <span className="font-mono text-sm sm:text-lg text-accent font-semibold tracking-wider opacity-80 group-hover:opacity-100">
                  {item.num}
                </span>
                <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#f8f6f2]/85 group-hover:text-white transition-colors">
                  {item.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Status Line (without Start a project button) */}
      <div className="flex items-center justify-center sm:justify-start max-w-[88rem] w-full mx-auto pt-6 border-t border-white/10 text-xs text-neutral-400">
        <span>Available for worldwide remote freelance projects</span>
      </div>
    </div>
  );
}