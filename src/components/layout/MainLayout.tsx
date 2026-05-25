import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  utilityRail: ReactNode;
}

export function MainLayout({ children, sidebar, utilityRail }: MainLayoutProps) {
  return (
    <div className="min-h-dvh text-[var(--text-h)] flex flex-col overflow-x-hidden selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] relative lg:h-screen lg:flex-row lg:overflow-hidden">
      <div className="sticky top-0 shrink-0 bg-[var(--bg-subtle)] shadow-[var(--shadow)] relative z-30 lg:static lg:z-10">
        {utilityRail}
      </div>

      <div className="flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-3 py-4 [scrollbar-width:none] sm:px-5 lg:hidden [&::-webkit-scrollbar]:hidden">
        <main className="w-[calc(100vw-1.5rem)] shrink-0 snap-center sm:w-[calc(100vw-2.5rem)]">
          {children}
        </main>
        {sidebar && (
          <aside className="card w-[calc(100vw-1.5rem)] shrink-0 snap-center p-4 sm:w-[calc(100vw-2.5rem)]">
            {sidebar}
          </aside>
        )}
      </div>

      <div className="relative z-10 hidden min-w-0 flex-1 overflow-hidden lg:flex">
        <main className="min-w-0 flex-1 overflow-hidden px-10 py-6">
          {children}
        </main>
      </div>

      {sidebar && (
        <div className="hidden lg:block w-80 xl:w-96 shrink-0 bg-[var(--bg-soft)] backdrop-blur-2 shadow-[var(--shadow)] overflow-hidden p-6 relative z-20">
          {sidebar}
        </div>
      )}
    </div>
  );
}
