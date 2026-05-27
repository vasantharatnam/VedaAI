import { Sidebar } from "./sidebar";
import { MobileTabbar } from "./mobile-tabbar";
import { MobileTopbar, Topbar } from "./topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg p-0 lg:p-4">
      <div className="flex min-h-screen gap-4 lg:min-h-[calc(100vh-32px)]">
        <Sidebar />

        <main className="min-w-0 flex-1 pb-28 lg:pb-0">
          <MobileTopbar />
          <Topbar />

          <div className="px-5 pb-8 pt-3 lg:px-0 lg:pt-4">{children}</div>
        </main>
      </div>

      <MobileTabbar />
    </div>
  );
}