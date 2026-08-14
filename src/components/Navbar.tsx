'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { 
  MessageSquare, 
  LogOut, 
  User as UserIcon, 
  LogIn, 
  UserPlus, 
  LayoutDashboard,
  Sun,
  Moon,
  X,
  Home,
  MoreVertical,
  Check,
  Palette
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user: User | undefined = session?.user;

  // Check if current route is a public profile page (/u/[username])
  const isPublicProfilePage = pathname?.startsWith('/u/');

  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sync and persist Dark Mode state
  useEffect(() => {
    const isDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      document.documentElement.classList.contains('dark');

    if (isDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const selectTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setTheme('light');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left Container: Three Dots Button (hidden on /u/[username]) + Brand Logo */}
          <div className="flex items-center gap-3">
            {!isPublicProfilePage && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsLeftDrawerOpen(true)}
                className="h-9 w-9 border-border/80 hover:bg-muted transition-colors rounded-xl shrink-0"
                title="Open drawer menu"
              >
                <MoreVertical className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Open left menu drawer</span>
              </Button>
            )}

            {/* Brand Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group transition-transform active:scale-95"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-75 blur-xs group-hover:opacity-100 transition-opacity" />
                <div className="relative w-9 h-9 rounded-xl bg-background border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                  Mystery Message
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                {/* Dashboard button (hidden on /u/[username]) */}
                {!isPublicProfilePage && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-blue-500/10 hover:text-blue-600 font-medium"
                  >
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-blue-500" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                
                {/* User Avatar Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/60 text-xs sm:text-sm font-medium shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="max-w-[130px] truncate font-semibold">
                    {user?.username || user?.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="font-medium">
                  <Link href="/sign-in" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-blue-500" />
                    <span>Login</span>
                  </Link>
                </Button>

                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-500/20 font-semibold">
                  <Link href="/sign-up" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {!session && (
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs h-8 px-2.5">
                <Link href="/sign-in">Login</Link>
              </Button>
            )}
          </div>

        </div>
      </header>

      {/* Short Slide-Over Left Side Drawer */}
      {isLeftDrawerOpen && !isPublicProfilePage && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsLeftDrawerOpen(false)}
          />

          {/* Left Drawer Container */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-card border-r border-border/80 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-base">Quick Drawer</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLeftDrawerOpen(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Theme Mode Option Buttons Section */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Palette className="w-3.5 h-3.5 text-blue-500" />
                  <span>Choose Theme</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Light Theme Option Button */}
                  <button
                    type="button"
                    onClick={() => selectTheme('light')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      theme === 'light'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'border-border/80 bg-muted/30 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Light</span>
                    </div>
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>

                  {/* Dark Theme Option Button */}
                  <button
                    type="button"
                    onClick={() => selectTheme('dark')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'border-border/80 bg-muted/30 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span>Dark</span>
                    </div>
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                </div>
              </div>

              {/* Navigation Links Section */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Navigation
                </p>

                <Link 
                  href="/" 
                  onClick={() => setIsLeftDrawerOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted font-medium text-sm transition-colors"
                >
                  <Home className="w-4 h-4 text-blue-500" />
                  <span>Home Page</span>
                </Link>

                {session && (
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsLeftDrawerOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted font-medium text-sm transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-500" />
                    <span>Dashboard</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom User / Auth Action Section */}
            <div className="pt-4 border-t border-border/60 space-y-3">
              {session ? (
                <>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-foreground truncate">
                        {user?.username || user?.email}
                      </p>
                      <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Signed in
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsLeftDrawerOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold text-xs transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsLeftDrawerOpen(false)}>
                    <Link href="/sign-in" className="flex items-center justify-center gap-1.5 w-full">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Login</span>
                    </Link>
                  </Button>

                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white" onClick={() => setIsLeftDrawerOpen(false)}>
                    <Link href="/sign-up" className="flex items-center justify-center gap-1.5 w-full">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;