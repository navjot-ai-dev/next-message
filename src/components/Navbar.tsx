'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { 
  MessageSquare, 
  LogOut, 
  User as UserIcon, 
  LogIn, 
  UserPlus, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-75 blur-xs group-hover:opacity-100 transition-opacity" />
            <div className="relative w-9 h-9 rounded-xl bg-background border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
              Mystery Message
            </span>
          </div>
        </Link>

        {/* User Navigation / Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary font-medium"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                  Dashboard
                </Link>
              </Button>
              
              {/* User Avatar Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/60 text-xs sm:text-sm font-medium shadow-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="max-w-[130px] truncate font-semibold">
                  {user?.username || user?.email}
                </span>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
                className="gap-2 border-border/80 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="font-medium">
                <Link href="/sign-in" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-indigo-500" />
                  <span>Login</span>
                </Link>
              </Button>

              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 font-semibold">
                <Link href="/sign-up" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Register</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;