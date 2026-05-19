import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  utilityRail: ReactNode;
}

export function MainLayout({ children, sidebar, utilityRail }: MainLayoutProps) {
  return (
    <div className="h-screen text-[var(--text-h)] flex overflow-hidden selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] relative">
      <div className="shrink-0 bg-[var(--bg-subtle)]  shadow-[var(--shadow)] relative z-10">
        {utilityRail}
      </div>
      <div className="flex-1 flex overflow-hidden relative z-10">
        <main className="flex-1 lg:overflow-hidden overflow-y-auto px-6 lg:px-10 py-6">
          {children}
        </main>
      </div>
      {sidebar && (
        <div className="hidden lg:block w-80 xl:w-96 shrink-0 bg-[var(--bg-subtle)] shadow-[var(--shadow)] overflow-hidden p-6 relative z-20">
          {sidebar}
        </div>
      )}
    </div>
  );
}
