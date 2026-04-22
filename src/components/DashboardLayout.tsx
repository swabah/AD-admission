import type { ReactNode } from "react";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckCircle,
  FileDown,
  RefreshCw,
  LogOut,
  Menu,
  X,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.jpg";

interface DashboardLayoutProps {
  children: ReactNode;
  stats: {
    label: string;
    value: number;
    icon: React.ElementType;
    accent: string;
  }[];
  onExport: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const navItems = [
  { id: "all", label: "All Applications", icon: LayoutDashboard },
  { id: "pending", label: "Pending Review", icon: Clock },
  { id: "reviewing", label: "Under Review", icon: Eye },
  { id: "approved", label: "Approved", icon: CheckCircle },
];

export function DashboardLayout({
  children,
  stats,
  onExport,
  onRefresh,
  onLogout,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="flex flex-col border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-xl border-2 border-gold bg-white/10">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-white">
              Ahlussuffa Dars
            </h2>
            <p className="text-xs text-white/50">Admission Portal</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* Stats */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Statistics
            </h3>
            <nav className="space-y-1">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${stat.accent}20`, color: stat.accent }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-lg font-semibold leading-none text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          <Separator className="bg-white/10" />

          {/* Navigation */}
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Navigation
            </h3>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/70 hover:bg-white/5 hover:text-white"
            onClick={onExport}
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/70 hover:bg-white/5 hover:text-white"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/40 hover:bg-white/5 hover:text-white"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col bg-navy lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 bg-navy p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h1 className="font-serif text-xl font-semibold text-navy lg:text-2xl">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-2 sm:flex"
              onClick={onExport}
            >
              <FileDown className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-2 sm:flex"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
