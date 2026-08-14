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
  Inbox,
  Lock,
  Bot,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample messages for the dynamic feature box
const sampleMessages = [
  { title: "Secret Admirer", content: "I really love your recent coding projects & design style!", time: "2m ago", badge: "Compliment" },
  { title: "Honest Feedback", content: "You should host more live streams on tech and web design.", time: "10m ago", badge: "Feedback" },
  { title: "Anonymous Friend", content: "Keep being amazing! Hope you have a great week ahead.", time: "1h ago", badge: "Friendly" },
];

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-rotate sample messages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % sampleMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden bg-grid-pattern">
      
      {/* Dynamic Ambient Background Light Blobs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[600px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-violet-500/15 to-indigo-500/15 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col items-center justify-center space-y-20">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 max-w-3xl">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-semibold tracking-wide shadow-sm hover:scale-105 transition-transform cursor-default">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Powered by Smart AI Message Assistant</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Share Thoughts <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                Completely Anonymously
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Mystery Message lets your friends, fans, and coworkers send you genuine feedback, secret questions, and compliments without revealing who they are.
            </p>
          </div>

          {/* Interactive Preview Card Carousel */}
          <div className="w-full max-w-md my-2">
            <div className="p-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 shadow-xl">
              <Card className="border-none bg-card/90 backdrop-blur-xl rounded-[15px] p-2">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-bold text-foreground text-left">
                        {sampleMessages[currentIdx].title}
                      </CardTitle>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                        {sampleMessages[currentIdx].badge}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md">
                    {sampleMessages[currentIdx].time}
                  </span>
                </CardHeader>
                <CardContent className="pt-2 pb-4 text-left">
                  <p className="text-sm sm:text-base font-medium text-foreground italic leading-relaxed">
                    "{sampleMessages[currentIdx].content}"
                  </p>
                </CardContent>
                
                {/* Carousel Indicator Dots */}
                <div className="flex justify-center items-center gap-1.5 pb-2">
                  {sampleMessages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIdx ? 'w-6 bg-indigo-600' : 'w-1.5 bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center pt-2">
            <Button 
              size="lg" 
              className="px-8 text-base h-12 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25 font-bold group"
            >
              <Link href="/sign-up" className="flex items-center">
                Get Your Free Link <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="px-8 text-base h-12 border-border/80 hover:bg-muted/60 font-semibold">
              <Link href="/sign-in" className="flex items-center">
                Sign In to Dashboard
              </Link>
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full space-y-10 pt-10 border-t border-border/60">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
              Simple Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How Mystery Message Works</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Start collecting anonymous thoughts in 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-3 right-3 text-4xl font-black text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                01
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Create Your Account</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sign up in seconds to receive your personalized shareable URL.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-3 right-3 text-4xl font-black text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                02
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Share Your Link</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste your link in your Instagram bio, X/Twitter, or WhatsApp status.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-3 right-3 text-4xl font-black text-pink-500/10 group-hover:text-pink-500/20 transition-colors">
                03
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Read Incoming Feed</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  View messages safely in your private dashboard anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-10 border-t border-border/60">
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-xs space-y-3 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">100% Privacy Guaranteed</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No tracking, no identity revealing. Senders write with total confidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-xs space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">AI Suggestion Helper</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stuck on what to ask? Click to generate creative prompts instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-xs space-y-3 hover:border-pink-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">Instant Toggle Control</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Turn off message acceptance anytime from your dashboard with one switch.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/60 bg-card/60 backdrop-blur-md py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-bold text-foreground">Mystery Message</span>
          </div>
          <p>© {new Date().getFullYear()} Mystery Message. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}