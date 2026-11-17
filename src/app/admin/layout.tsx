'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Library,
  UserCheck,
  BarChart3,
  Menu,
  X,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Evidence Library', href: '/admin/evidence', icon: Library },
  { label: 'Peer Volunteers', href: '/admin/volunteers', icon: UserCheck },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname.startsWith(href);
}

function SidebarContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b border-midnight-800/40">
        <Link
          href="/admin"
          className="flex items-center gap-2.5"
          onClick={onLinkClick}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-verified/15 border border-verified/25">
            <Shield className="w-4 h-4 text-verified" />
          </div>
          <div>
            <span className="text-base font-semibold text-ivory-50 tracking-tight">
              ProofDesk
            </span>
            <span className="block text-[10px] font-medium text-midnight-500 uppercase tracking-widest leading-none mt-0.5">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'nav-link',
                active ? 'nav-link-active' : 'nav-link-idle'
              )}
            >
              <Icon
                className={cn(
                  'w-[18px] h-[18px] flex-shrink-0',
                  active ? 'text-verified' : 'text-midnight-500'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-midnight-800/40">
        <p className="text-[11px] text-midnight-600 leading-tight">
          ProofDesk v1.0
        </p>
        <p className="text-[10px] text-midnight-700 mt-0.5">
          Clarity before commitment
        </p>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-midnight-950 border-r border-midnight-800/30 z-30">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="overlay-backdrop lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-midnight-950 border-r border-midnight-800/30 z-50 transform transition-transform duration-200 ease-out lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent pathname={pathname} onLinkClick={closeMobileMenu} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-midnight-950 border-b border-midnight-800/30">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-md text-midnight-400 hover:text-ivory-50 hover:bg-midnight-800/50 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-verified" />
            <span className="text-sm font-semibold text-ivory-50 tracking-tight">
              ProofDesk
            </span>
          </div>
        </header>

        {/* Demo Mode Banner */}
        <div className="bg-pending/10 border-b border-pending/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-pending flex-shrink-0" />
              <p className="text-xs font-medium text-pending">
                <span className="font-semibold">Demonstration Mode</span>
                <span className="hidden sm:inline">
                  {' '}
                  — All data shown is fictional and illustrative.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 bg-ivory-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
