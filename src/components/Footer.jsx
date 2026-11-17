
import React from 'react';
import { ArrowUp, ArrowRight, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenContact, onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="contact-footer"
      className="sf relative pt-12 pb-5 px-5 sm:px-8
      bg-[#191717] text-[#eee9e6]
      rounded-t-[28px] border-t border-[#d6c6a8]/40
      overflow-hidden"
      style={{
        background: `
          radial-gradient(
            ellipse at 15% 0%,
            rgba(201,169,110,0.09) 0%,
            transparent 42%
          ),
          linear-gradient(
            180deg,
            #1c1918 0%,
            #191717 45%,
            #151414 100%
          )
        `
      }}
    >
      {/* Ambient Gradient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32
        w-[32rem] h-[32rem] rounded-full blur-[120px] opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(201,169,110,0.22), transparent 70%)'
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-32
        w-[28rem] h-[28rem] rounded-full blur-[120px] opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(201,169,110,0.16), transparent 70%)'
        }}
      />

      {/* Decorative Hanging Bulb */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-[17%] hidden md:flex
        flex-col items-center pointer-events-none z-10"
      >
        <div className="w-[2px] h-[85px] bg-gradient-to-b from-[#d8d0bd] to-[#8d806a]" />

        <div
          className="relative w-[15px] h-[38px]
          rounded-[50%_50%_45%_45%]
          bg-gradient-to-r from-[#4b3321] via-[#a47a4d] to-[#49301f]
          shadow-[0_5px_18px_rgba(201,169,110,0.18)]"
        >
          <div
            className="absolute top-[5px] left-1/2
            -translate-x-1/2 w-[3px] h-[22px]
            rounded-full bg-[#d0a675]/30 blur-[2px]"
          />
        </div>
      </div>

      <div className="relative max-w-[70rem] w-full mx-auto">

        {/* Hiring / Flutter Developer Section */}
        <div className="mb-12">
          <div className="max-w-4xl">

            {/* Availability Pill */}
            <div
              className="inline-flex items-center gap-2
              px-3.5 py-1.5 rounded-full
              border border-white/10 bg-white/[0.035]
              mb-4 text-xs font-mono font-medium tracking-wide
              text-[#aaa3a0]"
            >
              <span className="relative flex w-2 h-2">
                <span
                  className="absolute inline-flex h-full w-full
                  rounded-full bg-emerald-400 opacity-75 animate-ping"
                />
                <span
                  className="relative inline-flex w-2 h-2
                  rounded-full bg-emerald-400"
                />
              </span>

              <span>Open to full-time &amp; remote roles</span>
            </div>

            {/* Heading */}
            <h2
              className="text-4xl sm:text-6xl md:text-7xl
              font-black tracking-tight text-[#eee9e6]
              leading-[1.02] mb-4"
            >
              Looking for a <br />

              <span
                className="font-cursive font-normal italic
                text-5xl sm:text-7xl md:text-8xl
                text-[#a49e9c]"
              >
                Flutter Developer?
              </span>
            </h2>

            {/* Description */}
            <p
              className="max-w-xl text-sm sm:text-base
              text-[#aaa3a0] leading-relaxed mb-5"
            >
              I'm a Flutter developer who builds fast, polished,
              cross-platform mobile apps for Android and iOS
              from a single codebase. I'm currently looking for a
              role where I can ship real products with a great team.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">

              <button
                onClick={onOpenContact}
                className="group flex items-center gap-3
                px-6 py-3 rounded-full
                bg-[#eee9e6] text-[#191717]
                font-medium text-sm sm:text-base
                transition-all duration-300
                hover:scale-[1.03]
                active:scale-[0.98]
                cursor-pointer"
              >
                <span>Hire Me</span>

                <span
                  className="w-8 h-8 rounded-full
                  bg-[#191717] text-white
                  flex items-center justify-center
                  transition-transform duration-300
                  group-hover:translate-x-1"
                >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

              <button
                onClick={() => onNavigate('#door')}
                className="px-5 py-3 rounded-full
                border border-white/20
                text-[#e5dfdc]
                font-medium text-sm sm:text-base
                transition-all duration-300
                hover:border-[#c9a96e]/60
                hover:text-[#c9a96e]
                hover:bg-white/[0.035]
                active:scale-[0.98]
                cursor-pointer"
              >
                View Work
              </button>

            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3
          gap-6 md:gap-10 py-6
          border-t border-b border-white/[0.12]"
        >

          {/* Col 1: Work */}
          <div>
            <h3
              className="text-xs font-mono font-bold
              tracking-widest uppercase
              text-[#918987] mb-3"
            >
              Work
            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <a
                  href="/web-developer/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/web-developer/');
                  }}
                  className="text-[#c7c0bd]
                  hover:text-[#c9a96e]
                  transition-colors font-medium"
                >
                  Flutter Developer
                </a>
              </li>

              <li>
                <a
                  href="/web-developer/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/web-developer/');
                  }}
                  className="text-[#c7c0bd]
                  hover:text-[#c9a96e]
                  transition-colors font-medium"
                >
                  UI/UX Developer
                </a>
              </li>

              <li>
                <a
                  href="/developer/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/developer/');
                  }}
                  className="text-[#c7c0bd]
                  hover:text-[#c9a96e]
                  transition-colors font-medium"
                >
                  App Deployment
                </a>
              </li>

            </ul>
          </div>

          {/* Col 2: Connect */}
          <div>
            <h3
              className="text-xs font-mono font-bold
              tracking-widest uppercase
              text-[#918987] mb-3"
            >
              Connect
            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <a
                  href="https://github.com/Abhinrajp"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5
                  text-[#c7c0bd] hover:text-[#c9a96e]
                  transition-colors font-medium"
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
                  className="inline-flex items-center gap-1.5
                  text-[#c7c0bd] hover:text-[#c9a96e]
                  transition-colors font-medium"
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
                  className="inline-flex items-center gap-1.5
                  text-[#c7c0bd] hover:text-[#c9a96e]
                  transition-colors font-medium"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>

              <li>
                <a
                  href="mailto:abhinraj8086@gmail.com"
                  className="inline-flex items-center gap-1.5
                  text-[#c7c0bd] hover:text-[#c9a96e]
                  transition-colors font-medium"
                >
                  <span>Email</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>

            </ul>
          </div>

          {/* Col 3: Status */}
          <div>
            <h3
              className="text-xs font-mono font-bold
              tracking-widest uppercase
              text-[#918987] mb-3"
            >
              Status
            </h3>

            <ul
              className="space-y-2 text-sm
              text-[#c7c0bd] font-medium"
            >
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Open to Flutter developer roles</span>
              </li>

              <li>10+ Projects Built</li>

              <li>Karnataka, India</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          className="pt-5 flex flex-col sm:flex-row
          items-center justify-between
          text-xs text-[#918987] font-medium gap-3"
        >

          <p>© 2026 Abhinraj P · All rights reserved</p>

          <a
            href="mailto:abhinraj8086@gmail.com"
            className="hover:text-[#eee9e6]
            transition-colors font-mono"
          >
            abhinraj8086@gmail.com
          </a>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5
            px-3 py-1.5 rounded-full
            border border-white/10
            hover:border-[#c9a96e]/40
            hover:text-[#c9a96e]
            transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </footer>
  );
}
