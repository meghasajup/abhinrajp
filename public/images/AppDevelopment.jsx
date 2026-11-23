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
    websiteUrl: 'https://www.thelearnyn.com/',
    phoneUrl: '/images/apps/phone-thelearnyn.png',
    videoUrl: '/videos/thelearnyn-preview.mp4',
    accentColor: '#6366f1',
    screenTheme: 'dark',
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
    websiteUrl: 'https://namodeva.com/',
    phoneUrl: '/images/apps/phone-namodeva.png',
    videoUrl: '/videos/namodeva-preview.mp4',
    accentColor: '#f59e0b',
    screenTheme: 'dark',
  },
  {
    id: 'anyskill',
    num: '03 / 05',
    title: 'AnySkill',
    category: 'ANDROID APP · SKILLS & TECH PLATFORM',
    subtitle: 'Interactive tech tracks, coding ground & career hub',
    description:
      'A next-generation tech upskilling and career development app built on MVVM with Provider. Features curated learning tracks across Full Stack, AI, and Mobile engineering, an interactive code execution sandbox ("Coding Ground"), dynamic progress analytics, verified certification generation, Cashfree payments, and placement assistance.',
    tags: [
      'Flutter & Provider (MVVM)',
      'Coding Ground Sandbox',
      'Job Hub & Certifications',
      'Cashfree & Deep Links',
    ],
    badge: 'Live on Google Play',
    websiteUrl: 'https://anyskill.com/',
    phoneUrl: '/images/apps/phone-anyskill.png',
    videoUrl: '/videos/anyskill-preview.mp4',
    accentColor: '#10b981',
    screenTheme: 'dark',
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
    websiteUrl: '',
    phoneUrl: '/images/apps/phone-taskpro.png',
    logoUrl: '/images/apps/taskpro-logo.png',
    screenshotUrls: [1, 2, 3, 4].map((n) => `/images/apps/taskpro-screen-${n}.jpg`),
    videoUrl: '/videos/taskpro-preview.mp4',
    accentColor: '#1e293b',
    screenTheme: 'light',
  },
  {
    id: 'pt-portal',
    num: '05 / 05',
    title: 'PT Portal',
    category: 'MOBILE APP · FITNESS & COACHING',
    subtitle: 'Personal trainer workflow, reminders & progress tracking',
    description:
      'A personal trainer and client management app built on MVVM architecture for clean UI-to-business-logic data binding. Uses Hive for fast local storage alongside a custom notification system for training reminders, muscle group workout routines, and ongoing client progress tracking.',
    tags: [
      'MVVM Architecture',
      'Hive Local Storage',
      'Custom Reminders',
      'Progress Tracking',
    ],
    badge: 'Amazon Appstore · GitHub',
    websiteUrl: '',
    phoneUrl: '/images/apps/phone-pt-portal.png',
    logoUrl: '/images/apps/pt-portal-logo.png',
    screenshotUrls: [1, 2, 3, 4].map((n) => `/images/apps/pt-portal-screen-${n}.jpg`),
    videoUrl: '/videos/pt-portal-preview.mp4',
    accentColor: '#ef4444',
    screenTheme: 'dark',
  },
];

function TheLearnynWebsitePreview() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    let frame;
    let last = 0;

    const tick = (time) => {
      if (time - last > 28) {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += 0.55;
        }
        last = time;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const features = [
    ['🌐', 'Multi-language explanation', 'Learn in a language you understand'],
    ['🎯', 'Personalized panel', 'Your learning journey in one place'],
    ['✍️', 'Homework assistance', 'Get help with your assignments'],
    ['🧠', 'Learnyn Buddy', 'AI-powered learning support'],
    ['📝', 'Short notes', 'Quick revision-ready study notes'],
    ['📊', 'Mock exam', 'Practice and prepare with confidence'],
    ['🎥', 'Theory classes', 'Learn concepts step by step'],
    ['🧪', 'Practical classes', 'Build skills through practice'],
  ];

  const boards = [
    'CBSE',
    'ICSE',
    'KSEEB',
    'NEET',
    'IIT-JEE',
    'BCOM',
    'BCA',
    'Spoken English',
  ];

  return (
    <div className="w-full h-full bg-[#f7f9ff] text-slate-800 overflow-hidden select-none">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100 px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-black">
              L
            </div>
            <div className="leading-tight">
              <div className="text-[12px] font-extrabold tracking-tight text-slate-900">
                TheLearnyn
              </div>
              <div className="text-[7px] text-slate-500">
                LEARN • GROW • SUCCEED
              </div>
            </div>
          </div>

          <div className="rounded-full bg-indigo-50 text-indigo-700 px-2 py-1 text-[8px] font-bold">
            Explore Courses
          </div>
        </div>

        <section className="px-3 pt-4 pb-4 bg-gradient-to-br from-indigo-700 via-blue-700 to-sky-500 text-white">
          <div className="text-[8px] font-bold tracking-[.16em] uppercase text-blue-100">
            Your learning journey starts here
          </div>

          <h3 className="text-[19px] leading-tight font-black mt-2">
            What do you want to learn?
          </h3>

          <p className="text-[9px] leading-relaxed text-blue-100 mt-1.5">
            Explore academic, competitive, degree and skill-based courses.
          </p>

          <div className="mt-3 rounded-xl bg-white p-2.5 text-slate-500 flex items-center justify-between">
            <span className="text-[9px]">
              Choose your course or category
            </span>
            <span className="rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-[8px] font-bold">
              NEXT
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {['Academic', 'Competitive', 'Degree', 'Technical'].map((x) => (
              <span
                key={x}
                className="rounded-full border border-white/30 bg-white/10 px-2 py-1 text-[7px]"
              >
                {x}
              </span>
            ))}
          </div>
        </section>

        <section className="px-3 py-4">
          <div className="text-center text-[13px] font-extrabold text-slate-900">
            Our Statistics
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              ['27,000+', 'Video Classes', '🎬'],
              ['62,000+', 'Question Bank', '📚'],
              ['2,00,000+', 'Students', '🎓'],
              ['4.7/5', 'Google Ratings', '⭐'],
            ].map(([n, l, ic]) => (
              <div
                key={l}
                className="rounded-xl bg-white border border-slate-100 p-2.5 shadow-sm"
              >
                <div className="text-sm">{ic}</div>
                <div className="text-[15px] font-black text-indigo-700 mt-1">
                  {n}
                </div>
                <div className="text-[8px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-3 py-4 bg-white">
          <div className="text-[13px] font-extrabold text-slate-900">
            Special Features
          </div>

          <p className="text-[8px] text-slate-500 mt-1">
            Everything you need to make learning easier
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {features.map(([ic, title, desc]) => (
              <div
                key={title}
                className="rounded-xl border border-indigo-50 bg-[#f8f9ff] p-2.5 min-h-[83px]"
              >
                <div className="text-base">{ic}</div>
                <div className="text-[9px] leading-tight font-bold text-slate-800 mt-1">
                  {title}
                </div>
                <div className="text-[7px] leading-snug text-slate-500 mt-1">
                  {desc}
                </div>
                <div className="text-[7px] font-bold text-indigo-600 mt-2">
                  Explore Now ↗
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-3 py-4">
          <div className="text-[13px] font-extrabold text-slate-900">
            Explore Certified Courses & Boards
          </div>

          <p className="text-[8px] text-slate-500 mt-1">
            Find the right learning path for you
          </p>

          <div className="grid grid-cols-4 gap-2 mt-3">
            {boards.map((b, i) => (
              <div
                key={b}
                className="rounded-lg bg-white border border-slate-100 py-3 px-1 text-center shadow-sm"
              >
                <div className="mx-auto w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[8px] font-black">
                  {i + 1}
                </div>
                <div className="text-[7px] font-bold mt-1.5">
                  {b}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-3 py-4 bg-indigo-50">
          <div className="text-[13px] font-extrabold text-slate-900">
            A Guide For Your Education
          </div>

          <div className="text-[8px] text-indigo-700 font-semibold mt-1">
            More than 14 years of experience
          </div>

          {[
            [
              'Streamlining Success',
              'Focus on what matters and make the most of your study time.',
            ],
            [
              'Effortless Learning',
              'Learning resources brought together in one place.',
            ],
            [
              'Economizing Education',
              'Quality learning at affordable prices.',
            ],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl bg-white p-3 mt-2">
              <div className="text-[9px] font-extrabold">{t}</div>
              <p className="text-[7px] leading-relaxed text-slate-500 mt-1">
                {d}
              </p>
            </div>
          ))}
        </section>

        <section className="px-3 py-4 bg-white">
          <div className="text-[13px] font-extrabold text-slate-900">
            Successful Learner Stories
          </div>

          <div className="rounded-xl bg-[#f8f9ff] border border-slate-100 p-3 mt-3">
            <div className="text-amber-400 text-[10px]">
              ★★★★★
            </div>
            <p className="text-[8px] leading-relaxed text-slate-600 mt-2">
              “Affordable institute, clear explanations and easy doubt clarification. Highly recommended.”
            </p>
            <div className="text-[9px] font-bold mt-2">
              — TheLearnyn Student
            </div>
          </div>
        </section>

        <section className="px-3 py-4 bg-slate-900 text-white">
          <div className="text-[13px] font-extrabold">
            TheLearnyn
          </div>
          <p className="text-[8px] text-slate-300 mt-1">
            Learn anytime, anywhere. Build your future with the right knowledge.
          </p>
          <div className="text-[8px] text-indigo-200 mt-3">
            Academic Courses · Computer Courses · FAQs · Contact
          </div>
          <div className="text-[7px] text-slate-400 mt-4">
            www.thelearnyn.com
          </div>
        </section>
      </div>
    </div>
  );
}


function ScreenshotPhonePreview({ project }) {
  const [activeScreen, setActiveScreen] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActiveScreen((current) => (current + 1) % project.screenshotUrls.length), 2600);
    return () => window.clearInterval(timer);
  }, [project.screenshotUrls.length]);
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <div className="h-9 shrink-0 flex items-center gap-2 px-2 bg-white border-b border-black/10">
        <img src={project.logoUrl} alt={`${project.title} logo`} className="w-6 h-6 object-contain rounded" />
        <span className="text-[9px] font-bold text-slate-900">{project.title}</span>
        <span className="ml-auto text-[7px] text-slate-500">APP PREVIEW</span>
      </div>
      <div className="relative flex-1 min-h-0 bg-black">
        {project.screenshotUrls.map((src, index) => (
          <img key={src} src={src} alt={`${project.title} app screen ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === activeScreen ? 'opacity-100' : 'opacity-0'}`} />
        ))}
      </div>
      <div className="h-5 shrink-0 bg-white flex items-center justify-center gap-1.5">
        {project.screenshotUrls.map((src, index) => <span key={src} className={`h-1 rounded-full transition-all ${index === activeScreen ? 'w-4 bg-slate-900' : 'w-1 bg-slate-300'}`} />)}
      </div>
    </div>
  );
}

function AnimatedPhoneScreenContent({ project }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  if (project.id === 'taskpro' || project.id === 'pt-portal') {
    return <ScreenshotPhonePreview project={project} />;
  }

  const appSlides = {
    thelearnyn: [
      {
        label: 'AI Notes & Chatbot',
        detail: 'Instant smart summaries',
        tag: 'AI Suite',
      },
      {
        label: 'Mock Exam Engine',
        detail: 'Dynamic AI explanations',
        tag: 'Live Test',
      },
      {
        label: 'PDF Cert & QR Score',
        detail: 'Cashfree + Deep Links',
        tag: 'Analytics',
      },
    ],
    namodeva: [
      {
        label: 'Explore Divine Wisdom',
        detail: 'Puja · Bhajans · Sacred Stories',
        tag: 'Devotional Hub',
      },
      {
        label: 'Adhyatmic Gyan',
        detail: 'Spiritual quizzes & learning',
        tag: 'Interactive',
      },
      {
        label: 'NamoDeva TV',
        detail: 'Devotional videos & media',
        tag: 'Media',
      },
    ],
    anyskill: [
      {
        label: 'Live Classes & Courses',
        detail: 'Technical and career skills',
        tag: 'Learning',
      },
      {
        label: 'Practical Skill Learning',
        detail: 'Projects, practice & progress',
        tag: 'Interactive',
      },
      {
        label: 'Certificates & Job Hub',
        detail: 'Career growth and opportunities',
        tag: 'Career',
      },
    ],
  };

  const slides = appSlides[project.id] || appSlides.thelearnyn;
  const current = slides[activeStep];

  return (
    <div className="w-full h-full bg-[#0d0f17] text-white flex flex-col justify-between p-3 pt-7 select-none">
      <div>
        <div className="flex items-center justify-between text-[8px] font-mono text-white/60 mb-2">
          <span className="truncate max-w-[75px]">
            {project.title}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full font-semibold text-white"
            style={{
              backgroundColor: `${project.accentColor}55`,
            }}
          >
            {current.tag}
          </span>
        </div>

        <div
          className="rounded-xl p-2.5 mb-2.5 border border-white/10 transition-all"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}33, rgba(255,255,255,0.03))`,
          }}
        >
          <div className="text-[11px] font-bold leading-snug">
            {current.label}
          </div>
          <div className="text-[9px] text-white/70 mt-0.5">
            {current.detail}
          </div>
        </div>

        <div className="space-y-1.5">
          {slides.map((item, i) => (
            <div
              key={item.label}
              className={`h-5 rounded-md px-2 flex items-center justify-between text-[8px] font-mono transition-all ${
                i === activeStep
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/[0.04] text-white/50'
              }`}
            >
              <span className="truncate">{item.label}</span>
              <span>{i === activeStep ? '●' : '○'}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-lg text-[9px] font-semibold py-1.5 px-2.5 text-center text-white"
        style={{
          backgroundColor: project.accentColor,
        }}
      >
        Previewing {project.title}
      </div>
    </div>
  );
}

function StationaryPhoneFrame({ project, index }) {
  const phoneRef = useRef(null);
  const videoRef = useRef(null);
  const [videoAvailable, setVideoAvailable] = useState(false);

  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return undefined;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return undefined;

    const tiltDirection = index % 2 === 0 ? -7 : 7;

    gsap.set(el, {
      rotateY: tiltDirection,
      rotateX: 4,
      rotateZ: index % 2 === 0 ? -1.5 : 1.5,
      transformPerspective: 1000,
    });

    const floatTween = gsap.to(el, {
      y: -7,
      rotateY: tiltDirection * 0.65,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => floatTween.kill();
  }, [index]);

  return (
    <div
      ref={phoneRef}
      className="relative w-[112px] sm:w-[175px] lg:w-[196px] aspect-[9/19.2] rounded-[20px] sm:rounded-[28px] lg:rounded-[30px] bg-[#141416] p-[4px] sm:p-[6px] shadow-[0_20px_42px_rgba(0,0,0,0.26)] dark:shadow-[0_24px_52px_rgba(0,0,0,0.72)] border border-white/15"
    >
      <div className="absolute top-[8px] sm:top-[11px] left-1/2 -translate-x-1/2 z-30 w-[36px] sm:w-[52px] h-[9px] sm:h-[13px] rounded-full bg-black flex items-center justify-end pr-1.5">
        <span className="w-1 h-1 rounded-full bg-white/20" />
      </div>

      <div className="relative w-full h-full rounded-[16px] sm:rounded-[22px] lg:rounded-[24px] overflow-hidden bg-black">
        {project.id === 'thelearnyn' ? (
          <TheLearnynWebsitePreview />
        ) : project.id === 'namodeva' || project.id === 'anyskill' ? (
          <iframe
            src={project.websiteUrl}
            title={`${project.title} website`}
            className="w-full h-full border-0 bg-white"
            loading="lazy"
            allow="fullscreen"
          />
        ) : project.id === 'taskpro' || project.id === 'pt-portal' ? (
          <ScreenshotPhonePreview project={project} />
        ) : (
          <>
            {project.videoUrl && (
              <video
                ref={videoRef}
                src={project.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={() => setVideoAvailable(true)}
                onError={() => setVideoAvailable(false)}
                className={`w-full h-full object-cover ${
                  videoAvailable
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none absolute inset-0'
                }`}
              />
            )}

            {!videoAvailable && (
              <AnimatedPhoneScreenContent project={project} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AppDevelopment({
  onNavigate = () => {},
  onOpenContact = () => {},
}) {
  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);
  const scrollTriggerRef = useRef(null);

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

  const navigateToDoors = () => {
    onNavigate('/#doors', {
      hash: '#doors',
      doorIndex: 0,
      isBack: true,
      preserveScroll: true,
      skipDoorCenter: true,
    });
  };

  const handleBackClick = (event) => {
    event?.preventDefault();
    if (isLeaving) return;
    setIsLeaving(true);

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill(false);
      scrollTriggerRef.current = null;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !containerRef.current) {
      navigateToDoors();
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
      onComplete: navigateToDoors,
    });
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stage = cardsContainerRef.current;
    if (!stage) return undefined;

    const cards = cardRefs.current.filter(Boolean);
    const overlays = overlayRefs.current.filter(Boolean);
    const totalCards = cards.length;

    if (totalCards < 2) return undefined;

    const mm = gsap.matchMedia();

    const buildStack = (isMobile) => {
      const transitionDuration = 1;
      const getStageHeight = () => stage.getBoundingClientRect().height || 640;

      cards.forEach((card, index) => {
        gsap.set(card, {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          x: 0,
          y: index === 0 ? 0 : getStageHeight(),
          scale: 1,
          opacity: 1,
          visibility: 'visible',
          transformOrigin: 'top center',
          force3D: true,
          zIndex: 100 + index,
        });

        if (overlays[index]) {
          gsap.set(overlays[index], { opacity: 0 });
        }
      });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
      });

      for (let index = 1; index < totalCards; index += 1) {
        const startAt = timeline.duration();

        timeline.fromTo(
          cards[index],
          { y: () => getStageHeight(), opacity: 1 },
          {
            y: 0,
            opacity: 1,
            duration: transitionDuration,
            ease: 'power1.inOut',
          },
          startAt
        );

        for (let previous = 0; previous < index; previous += 1) {
          const depth = index - previous;
          const targetScale = isMobile
            ? Math.max(0.94, 1 - depth * 0.025)
            : Math.max(0.88, 1 - depth * 0.04);
          const targetY = isMobile ? -depth * 7 : -depth * 12;
          const targetOverlay = Math.min(isMobile ? 0.24 : 0.3, depth * 0.09);

          timeline.to(
            cards[previous],
            {
              scale: targetScale,
              y: targetY,
              opacity: 1,
              duration: transitionDuration,
              ease: 'power1.inOut',
            },
            startAt
          );

          if (overlays[previous]) {
            timeline.to(
              overlays[previous],
              {
                opacity: targetOverlay,
                duration: transitionDuration,
                ease: 'power1.inOut',
              },
              startAt
            );
          }
        }
      }

      const trigger = ScrollTrigger.create({
        trigger: stage,
        animation: timeline,
        start: isMobile ? 'top top+=72' : 'top top+=88',
        end: () => `+=${Math.ceil(window.innerHeight * (totalCards - 1))}`,
        scrub: 0.45,
        pin: stage,
        pinSpacing: true,
        pinType: 'fixed',
        pinReparent: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        fastScrollEnd: true,
      });

      scrollTriggerRef.current = trigger;

      return () => {
        if (scrollTriggerRef.current === trigger) {
          scrollTriggerRef.current = null;
        }
        trigger.kill(false);
        timeline.kill();
      };
    };

    mm.add('(min-width: 768px)', () => buildStack(false));
    mm.add('(max-width: 767px)', () => buildStack(true));

    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refresh, 250);

    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      mm.revert();
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="service-page-wrapper bg-[var(--background)] text-[var(--foreground)] min-h-screen pt-20 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 w-full max-w-[84rem] mx-auto relative overflow-visible flex flex-col justify-between rounded-[28px] sm:rounded-[36px] md:rounded-[40px]"
      >
        <div className="w-full">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4">
              App Development
            </h1>

            <p className="text-base sm:text-xl text-foreground/75 leading-relaxed font-normal">
              Cross-platform mobile apps, designed and built end to end: from the first screen and smooth interactions to the native details that make an app feel right at home on both iOS and Android.
            </p>
          </div>

          <div
            ref={cardsContainerRef}
            className="relative isolate w-full h-[640px] sm:h-[660px] lg:h-[640px] mb-8 overflow-visible"
          >
            {PROJECTS.map((project, idx) => {
              const zIndex = 10 * (idx + 1);
              const isEven = idx % 2 === 0;

              return (
                <article
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  style={{ zIndex }}
                  className="absolute top-0 inset-x-0 w-full h-full rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#1e1b1b] border border-black/[0.06] dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] p-4 sm:p-10 lg:p-12 overflow-hidden flex flex-col justify-center select-none"
                >
                  <div
                    ref={(el) => {
                      overlayRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 rounded-[28px] sm:rounded-[36px] bg-black pointer-events-none opacity-0 z-20"
                  />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-3 sm:gap-6 lg:gap-10 w-full">
                    {/* PROJECT DETAILS (vertically centered) */}
                    <div
                      className={`order-2 flex flex-col justify-center min-w-0 ${
                        isEven
                          ? 'lg:col-span-7 lg:order-1'
                          : 'lg:col-span-7 lg:order-2'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                        <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-foreground/60 dark:text-foreground/50 uppercase truncate">
                          {project.category}
                        </span>

                        <span className="text-[10px] sm:text-xs font-mono text-muted flex-shrink-0">
                          {project.num}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-1 sm:mb-2">
                        {project.title}
                      </h2>

                      <p className="text-[11px] sm:text-sm font-mono text-accent font-medium mb-2 sm:mb-4">
                        {project.subtitle}
                      </p>

                      <p className="text-xs sm:text-base text-foreground/80 dark:text-foreground/75 leading-relaxed max-w-xl mb-3 sm:mb-5 line-clamp-4 sm:line-clamp-none">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono bg-black/[0.04] dark:bg-white/5 text-foreground/75 dark:text-foreground/70 border border-black/5 dark:border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-muted">
                          <span className="w-2 h-2 rounded-full bg-foreground/35 dark:bg-foreground/45 inline-block flex-shrink-0" />
                          <span>{project.badge}</span>
                        </div>

                        {project.websiteUrl && (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#333333] hover:scale-105 active:scale-95 dark:bg-[#f8f6f2] dark:text-[#111111] dark:hover:bg-white cursor-pointer"
                          >
                            <span>Visit</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* PHONE PREVIEW */}
                    <div
                      className={`order-1 relative flex h-[200px] sm:h-[240px] lg:h-auto items-center justify-center select-none ${
                        isEven
                          ? 'lg:col-span-5 lg:order-2'
                          : 'lg:col-span-5 lg:order-1'
                      }`}
                    >
                      <div className="scale-[0.78] sm:scale-95 lg:scale-100 origin-center flex items-center justify-center">
                        <StationaryPhoneFrame
                          project={project}
                          index={idx}
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
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
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