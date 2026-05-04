import type { ReactNode } from 'react';
import { TutorialPanel } from '../TutorialPanel';

interface MainLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  utilityRail: ReactNode;
  showConnectionArrow?: boolean;
  showTutorial?: boolean;
}

export function MainLayout({ children, sidebar, utilityRail, showConnectionArrow, showTutorial }: MainLayoutProps) {
  return (
    <div className="h-screen bg-[var(--bg)] text-[var(--text-h)] flex overflow-hidden selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] relative">

      <img
        src="/nature.svg"
        alt=""
        aria-hidden="true"
        className="fixed bottom-0 left-0 w-[580px] lg:w-[860px] pointer-events-none select-none opacity-[0.07] z-0 scale-x-[-1]"
      />

      <div className="shrink-0 bg-[var(--bg-subtle)] shadow-[var(--shadow)] relative z-10">
        {utilityRail}
      </div>
      <div className="flex-1 flex overflow-hidden p-4 lg:p-6 lg:pl-0 lg:pr-0 relative z-10">
        <main className="flex-1 overflow-y-auto px-6 lg:px-14 py-4 lg:py-6 scroll-smooth">
          {children}
        </main>
        {showConnectionArrow && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 pointer-events-none hidden lg:block">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M4 18h22"
                stroke="var(--border)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="animate-dash"
              />
              <path
                d="M22 11l9 7-9 7"
                stroke="var(--accent)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        )}
      </div>
      {sidebar && (
        <div className="hidden lg:block w-80 xl:w-106 shrink-0 bg-[var(--bg-subtle)] shadow-[var(--shadow)] overflow-y-auto p-6 lg:p-10 scroll-smooth relative z-20">
          {sidebar}
        </div>
      )}
      <TutorialPanel visible={showTutorial ?? false} />
    </div>
  );
}
