'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Mail,
  UserPlus,
  Share2,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample messages for the dynamic feature box
const sampleMessages = [
  { title: "Secret Admirer", content: "I really love your recent coding projects!", time: "2m ago" },
  { title: "Honest Feedback", content: "You should host more live streams on tech topics.", time: "10m ago" },
  { title: "Anonymous Friend", content: "Keep being amazing! Hope you have a great week.", time: "1h ago" },
];

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-rotate sample messages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % sampleMessages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col items-center justify-center space-y-16">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 max-w-3xl">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide shadow-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Powered by Local AI Suggestions</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Dive into the World of <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Anonymous Feedback
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Mystery Message – Where your identity remains a secret. Send feedback, compliments, or secret questions completely anonymously.
          </p>

          {/* Interactive Preview Card Carousel */}
          <div className="w-full max-w-md my-4">
            <Card className="border-muted/80 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {sampleMessages[currentIdx].title}
                </CardTitle>
                <span className="text-xs text-muted-foreground/80 font-mono">
                  {sampleMessages[currentIdx].time}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base font-medium text-foreground italic">
                  "{sampleMessages[currentIdx].content}"
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center pt-2">
            <Button size="lg" className="px-8 text-base shadow-md hover:shadow-primary/25 h-12">
              <Link href="/sign-up" className="flex items-center">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="px-8 text-base h-12">
              <Link href="/sign-in" className="flex items-center">
                Sign In to Dashboard
              </Link>
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full space-y-8 pt-8 border-t border-border/60">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How Mystery Message Works</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Start receiving secret feedback in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-muted text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">1. Create Account</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign up in seconds to get your unique public link for receiving messages.
              </p>
            </Card>

            <Card className="bg-card/50 border-muted text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">2. Share Your Link</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Post your unique URL on social media, portfolios, or bios to invite thoughts.
              </p>
            </Card>

            <Card className="bg-card/50 border-muted text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">3. Read & Manage</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check your private dashboard to read, refresh, or clear your incoming messages.
              </p>
            </Card>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 border-t border-border/60">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/20 border border-border/40 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">100% Anonymous</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your real identity is never attached to sent messages. Total privacy guaranteed.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/20 border border-border/40 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">AI Prompt Helper</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stuck on what to write? Generate fun, engaging message ideas with one click.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/20 border border-border/40 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Instant Control</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage your personal feedback link, view responses, and toggle availability anytime.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-muted-foreground border-t border-border/60 bg-muted/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Mystery Message. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:underline">Login</Link>
            <Link href="/sign-up" className="hover:underline">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}