import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  utilityRail: ReactNode;
}

export function MainLayout({ children, sidebar, utilityRail }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[--bg] text-[--text-h] flex overflow-hidden selection:bg-[--accent-soft] selection:text-[--accent]">
      {utilityRail}
      <div className="flex-1 flex overflow-hidden relative p-4 lg:p-6 lg:pl-0">
        {/* Main content area - Floating Card */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white rounded-3xl shadow-[var(--shadow)] border border-[--border]">
          {/* Primary Workspace */}
          <main className="col-span-1 lg:col-span-8 overflow-y-auto p-6 lg:p-14 scroll-smooth">
            {children}
          </main>
          
          {/* Secondary Sidebar (Selection/Gallery) */}
          {sidebar && (
            <aside className="hidden lg:block col-span-4 border-l border-[--border] bg-[--bg-subtle] overflow-y-auto p-6 lg:p-10 scroll-smooth">
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
