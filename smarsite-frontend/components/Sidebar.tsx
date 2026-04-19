'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  BarChart3,
  Users,
  Wallet,
  AlertCircle,
  FileText,
  Camera,
  Menu,
  X,
  Home,
  Clipboard,
  Briefcase,
  UserCircle,
  Wrench,
  Handshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { id: 'clients', label: 'Espace client', icon: Handshake, href: '/dashboard/clients' },
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/home' },
  { id: 'projects', label: 'Projects', icon: Building2, href: '/projects' },
  { id: 'tasks', label: 'Tasks', icon: Clipboard, href: '/tasks' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, href: '/jobs' },
  { id: 'humans', label: 'Humans', icon: UserCircle, href: '/humans' },
  { id: 'equipment', label: 'Equipment', icon: Wrench, href: '/equipment' },
  {
    id: 'progress-photos',
    label: 'Progress Photos',
    icon: Camera,
    href: '/progress-photos',
  },
  { id: 'documents', label: 'Documents', icon: FileText, href: '/documents' },
  { id: 'reports', label: 'Reports', icon: BarChart3, href: '/reports' },
  { id: 'team', label: 'Team', icon: Users, href: '/team' },
  { id: 'budget', label: 'Budget', icon: Wallet, href: '/budget' },
  { id: 'alerts', label: 'Alerts', icon: AlertCircle, href: '/alerts' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="contents" data-a11y-focus-follow="">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        className="fixed left-4 top-4 z-50 rounded-xl bg-gradient-to-r from-accent to-accent/85 p-2.5 text-accent-foreground shadow-lg shadow-black/25 transition-all duration-300 ease-out hover:brightness-110 hover:shadow-xl active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
      >
        {open ? <X size={22} aria-hidden strokeWidth={2.25} /> : <Menu size={22} aria-hidden strokeWidth={2.25} />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen min-h-0 flex-col overflow-hidden border-r border-sidebar-border/60 bg-sidebar shadow-[4px_0_24px_-4px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 ease-out md:relative md:translate-x-0',
          open
            ? 'w-[min(13rem,85vw)] translate-x-0 md:w-[13rem]'
            : '-translate-x-full md:translate-x-0 md:w-[13rem]',
        )}
      >
        <div className="relative shrink-0 overflow-hidden border-b border-sidebar-border/50 px-2.5 pb-2 pt-3 md:px-2.5 md:pb-2 md:pt-3">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              background:
                'radial-gradient(ellipse 80% 120% at 20% -20%, var(--sidebar-accent), transparent 55%), radial-gradient(ellipse 70% 100% at 100% 100%, var(--sidebar-primary), transparent 50%)',
            }}
          />
          <div className="relative flex items-start gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent/20 text-sidebar-accent shadow-inner shadow-black/10 ring-1 ring-sidebar-accent/25 md:size-9">
              <Building2 size={18} strokeWidth={2} aria-hidden className="drop-shadow-sm" />
            </div>
            <div className="min-w-0 pt-0.5">
              <h1 className="text-base font-semibold leading-tight tracking-tight text-sidebar-foreground">
                Smart<span className="text-sidebar-primary">Site</span>
              </h1>
              <p className="mt-0.5 text-[10px] font-medium uppercase leading-tight tracking-wider text-sidebar-foreground/55">
                Construction Management
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0 overflow-hidden px-1.5 pb-2 pt-2" aria-label="Main">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group relative flex min-h-0 shrink-0 items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-tight transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-accent/70 focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar md:py-1 md:text-[11.5px]',
                  isActive
                    ? 'bg-sidebar-accent/12 text-sidebar-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)] ring-1 ring-sidebar-border/40'
                    : 'text-sidebar-foreground/72 hover:bg-sidebar-accent/[0.08] hover:text-sidebar-foreground hover:ring-1 hover:ring-sidebar-border/30',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-md transition-all duration-200 md:size-[1.65rem]',
                    isActive
                      ? 'bg-sidebar-primary/25 text-sidebar-primary'
                      : 'bg-sidebar-accent/8 text-sidebar-accent/90 group-hover:bg-sidebar-accent/18 group-hover:text-sidebar-accent',
                  )}
                >
                  <Icon size={14} strokeWidth={2} aria-hidden className="shrink-0" />
                </span>
                <span className="min-w-0 flex-1 truncate tracking-tight">{item.label}</span>
                {isActive ? (
                  <span
                    className="absolute right-1 size-1 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)]"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
