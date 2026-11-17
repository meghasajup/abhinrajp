import React from 'react';
import { ArrowUp, ArrowRight, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenContact, onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="contact-footer"
      className="sf relative pt-24 pb-12 px-5 sm:px-8 border-t border-black/10 dark:border-white/10 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--background) 0%, rgba(201, 169, 110, 0.08) 100%)'
      }}
    >
      {/* Soft decorative glows (transparent, background colour untouched) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.14) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[70rem] w-full mx-auto">

        {/* ───────── Hiring / Flutter Developer Section ───────── */}
        <div className="mb-24">
          <div className="max-w-4xl">
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill mb-6 text-xs font-mono font-medium tracking-wide">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-foreground">Open to full-time &amp; remote roles</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08] mb-6">
              Looking for a <br />
              <span className="font-cursive font-normal italic text-5xl sm:text-7xl md:text-8xl text-accent">
                Flutter Developer?
              </span>
            </h2>

            <p className="max-w-xl text-base sm:text-lg text-foreground/75 leading-relaxed mb-8">
              I'm a Flutter developer who builds fast, polished, cross-platform mobile apps for Android and iOS
              from a single codebase. I'm currently looking for a role where I can ship real products with a great team.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenContact}
                className="flex items-center gap-3 px-7 py-4 rounded-full bg-[#111111] text-[#f8f6f2] dark:bg-[#f8f6f2] dark:text-[#111111] font-medium text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl cursor-pointer"
              >
                <span>Hire Me</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('#works')}
                className="glass-pill px-6 py-4 rounded-full font-medium text-sm sm:text-base text-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                View Work
              </button>
            </div>
          </div>
        </div>

        {/* 3 Columns Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-b border-black/10 dark:border-white/10">

          {/* Col 1: Selected Work */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-muted mb-4">
              Work
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/web-developer/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/web-developer/'); }}
                  className="text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  Flutter Developer
                </a>
              </li>
              <li>
                <a
                  href="/web-developer/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/web-developer/'); }}
                  className="text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  UI/UX Developer
                </a>
              </li>
              <li>
                <a
                  href="/developer/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/developer/'); }}
                  className="text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  App Deployment
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Connect */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-muted mb-4">
              Connect
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/Abhinrajp"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/abhinraj-p/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/_abhinraj/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:abhinraj8086@gmail.com"
                  className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  <span>Email</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Status */}
          <div>
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-muted mb-4">
              Status
            </h3>
            <ul className="space-y-2.5 text-sm text-foreground/80 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Open to Flutter developer roles</span>
              </li>
              <li>10+ Projects Built</li>
              <li>Karnataka, India </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted font-medium gap-4">
          <p>© 2026 Abhinraj P · All rights reserved</p>
          <a
            href="mailto:abhinraj8086@gmail.com"
            className="hover:text-foreground transition-colors font-mono"
          >
            abhinraj8086@gmail.com
          </a>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill hover:text-foreground transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}