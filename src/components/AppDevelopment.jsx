import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Smartphone, Video } from 'lucide-react';

const PROJECTS = [
  {
    id: 'expense-tracker',
    tag: 'iOS App · Finance',
    title: 'Expense Tracker',
    org: 'Personal finance, organised into books',
    description: 'Spending is grouped into expense books such as Personal, Travel and Business, each with its own budget. Add income or an expense in a couple of taps, see the balance, spend and budget used at a glance, and search across every entry.',
    caseStudyUrl: '/expense-tracker/',
    stack: ['Budgets', 'Expense books', 'Shortcuts & Back Tap'],
    hasCaseStudy: true,
    meta: 'Screen recording on iPhone'
  },
  {
    id: 'secret-vault',
    tag: 'iOS App · Privacy',
    title: 'Secret Vault',
    org: 'A photo vault disguised as a calculator',
    description: 'It looks and works like an ordinary calculator. Type your secret equation and double-tap % to open a private vault: photos you import are hidden there and can be removed from your photo library.',
    caseStudyUrl: '/secret-vault/',
    stack: ['Privacy', 'Equation passcode', 'Photos access'],
    hasCaseStudy: false,
    meta: 'Recorded on iPhone with sample photos'
  },
  {
    id: 'brick-breaker',
    tag: 'iOS Game · Arcade',
    title: 'Brick Breaker',
    org: 'Arcade game with pixel-art levels',
    description: 'A fast arcade brick breaker: pixel-art levels, multi-ball power-ups that flood the screen, combos and a live score, with a pause menu and level-by-level progression.',
    caseStudyUrl: '/brick-breaker/',
    stack: ['Game design', 'Power-ups', 'Level design'],
    hasCaseStudy: false,
    meta: 'Gameplay recorded on iPhone'
  },
  {
    id: 'dice',
    tag: 'iOS App · Utility',
    title: 'Dice',
    org: 'A colourful dice roller',
    description: 'Roll several dice at once: each die fills its own block of colour and the total updates instantly, so a board-game night needs nothing but a phone.',
    caseStudyUrl: '/dice/',
    stack: ['Utility', 'Minimal UI', 'Tap to roll'],
    hasCaseStudy: false,
    meta: 'Screen recording on iPhone'
  }
];

export default function AppDeveloperPage({ onNavigate, onOpenContact }) {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 md:px-14 max-w-[88rem] mx-auto animate-fadeIn">
      {/* Back to doors button */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('#works')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-mono font-medium hover:text-accent transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to the doors</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4">
          App Development
        </h1>
        <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed font-normal">
          iOS apps and games, designed and built end to end: from the first screen and the small interactions to the delicate math that keep an app feel at home on iPhone.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="space-y-12 mb-24">
        {PROJECTS.map((project, idx) => (
          <article
            key={project.id}
            className="glass-pill rounded-[32px] p-8 sm:p-12 border border-white/60 dark:border-white/10 shadow-xl transition-all duration-300 hover:border-accent/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-accent/15 text-accent border border-accent/25 uppercase tracking-wider">
                {project.tag}
              </span>
              <span className="text-xs font-mono text-muted">
                0{idx + 1} / 0{PROJECTS.length}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-1">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-accent font-medium mb-6">
              {project.org}
            </p>

            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-4xl mb-8">
              {project.description}
            </p>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.stack.map((item) => (
                <span 
                  key={item} 
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-black/5 dark:bg-white/5 text-foreground/70 border border-black/5 dark:border-white/5"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Video / Screen Recording Note */}
            <div className="flex items-center gap-2 mb-8 text-xs font-mono text-muted">
              <Video className="w-4 h-4 text-accent" />
              <span>{project.meta}</span>
            </div>

            {/* Case Study Link */}
            {project.hasCaseStudy ? (
              <button
                onClick={() => onNavigate(project.caseStudyUrl)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-[#f8f6f2] dark:bg-[#f8f6f2] dark:text-[#111111] text-xs sm:text-sm font-semibold tracking-wide hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Explore Case Study</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs font-mono text-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Production Project · Live Deployment</span>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Got a project banner */}
      <div className="glass-pill rounded-[32px] p-8 sm:p-14 text-center border border-accent/30 shadow-2xl flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase mb-2">
          Available for new work
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4 max-w-xl">
          Got a project? <span className="font-cursive italic font-normal">Let's build it together.</span>
        </h2>
        <p className="max-w-xl text-base text-foreground/75 leading-relaxed mb-8">
          I'm taking on new freelance work: websites, apps, interfaces and visual content. Tell me what you're building and I'll get back to you within a day.
        </p>
        <button
          onClick={onOpenContact}
          className="px-8 py-4 rounded-full bg-[#111111] text-[#f8f6f2] dark:bg-[#f8f6f2] dark:text-[#111111] text-sm sm:text-base font-semibold tracking-wide hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
        >
          Start a project
        </button>
      </div>
    </div>
  );
}