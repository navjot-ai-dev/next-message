'use client';

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { 
  Copy, 
  Check, 
  Loader2, 
  RefreshCw, 
  Mail, 
  MessageSquare, 
  Power, 
  Link as LinkIcon,
  Sparkles,
  ExternalLink
} from "lucide-react";

import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";

// shadcn UI Components
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import MessageCard from "@/components/MessageCard";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  const { data: session } = useSession();

  const form = useForm<{ acceptMessages: boolean }>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Get base URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  // API Call: Toggle Accept Messages Status
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", Boolean(response.data.isAcceptingMessage ?? true));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // API Call: Fetch Messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.add({
            title: "Refreshed Feed ✨",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.add({
          title: "Error",
          description: axiosError.response?.data.message || "Failed to fetch messages",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  // Toggle Message Acceptance Switch
  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.add({
        title: "Status Updated",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // API Call: Delete Message
  const handleDeleteMessage = async (messageId: string) => {
    setDeletingId(messageId);
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
      
      setMessages((prev) => prev.filter((msg) => msg._id.toString() !== messageId));

      toast.add({
        title: "Deleted",
        description: response.data.message || "Message removed successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to delete message",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh] text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <Power className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm text-sm">Please sign in to access your dashboard and manage messages.</p>
      </div>
    );
  }

  const username = session.user.username || session.user.email;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.add({
      title: "Copied to Clipboard! 📋",
      description: "Share your unique link anywhere.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Dashboard</h1>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10">
              Overview
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-foreground">@{username}</span>! Manage your feedback feed.
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
          className="w-full sm:w-auto h-10 border-border/80 hover:border-indigo-500/40 font-medium gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          ) : (
            <RefreshCw className="h-4 w-4 text-indigo-500" />
          )}
          Refresh Feed
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Total Messages */}
        <Card className="glass-card shadow-xs border-border/60 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Inbox
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{messages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Messages in your account</p>
          </CardContent>
        </Card>

        {/* Card 2: Status Toggle */}
        <Card className="glass-card shadow-xs border-border/60 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Accepting Status
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Power className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {acceptMessages && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                <Badge variant={acceptMessages ? "default" : "secondary"} className={acceptMessages ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}>
                  {acceptMessages ? "Active & Accepting" : "Paused"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Toggle link state</p>
            </div>
            <Switch
              checked={acceptMessages ?? false}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </CardContent>
        </Card>

        {/* Card 3: Profile Link Preview */}
        <Card className="glass-card shadow-xs border-border/60 sm:col-span-2 lg:col-span-1 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Public Link
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <LinkIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground truncate bg-muted/60 p-2 rounded-md border border-border/40">
              {profileUrl}
            </div>
            <a 
              href={profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Preview your public page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Shareable Link Box */}
      <div className="p-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 shadow-md">
        <Card className="border-none bg-card/90 backdrop-blur-xl rounded-[15px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Your Shareable Feedback Link
            </CardTitle>
            <CardDescription>
              Copy and post this unique link on your social media profiles to receive anonymous thoughts!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <Input
                type="text"
                value={profileUrl}
                readOnly
                className="bg-muted/40 font-mono text-xs sm:text-sm h-11 flex-1 border-border/80 focus-visible:ring-indigo-500"
              />
              <Button 
                onClick={copyToClipboard} 
                className="shrink-0 h-11 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-md shadow-indigo-500/20"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Messages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <span>Received Messages</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {messages.length}
            </Badge>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((message) => {
              const msgId = message._id.toString();
              return (
                <MessageCard
                  key={msgId}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                  isDeleting={deletingId === msgId}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border border-dashed rounded-2xl bg-muted/20 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
              <Mail className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-foreground">No messages yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Share your unique link with your audience or social media followers to start receiving secret feedback!
              </p>
            </div>
            <Button 
              onClick={copyToClipboard} 
              variant="outline"
              className="mt-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 font-semibold"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Shareable Link
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;