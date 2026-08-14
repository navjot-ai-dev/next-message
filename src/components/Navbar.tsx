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
  LayoutDashboard 
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Mystery Message
          </span>
        </Link>

        {/* User Navigation / Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
              
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 text-xs sm:text-sm font-medium">
                <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="max-w-[140px] truncate">
                  {user?.username || user?.email}
                </span>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Link href="/sign-in" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </Button>

              <Button size="sm">
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