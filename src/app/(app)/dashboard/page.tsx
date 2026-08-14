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
  Link as LinkIcon 
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
            title: "Refreshed Messages",
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
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">Please sign in to access your dashboard and manage messages.</p>
      </div>
    );
  }

  const username = session.user.username || session.user.email;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.add({
      title: "Copied to Clipboard",
      description: "Profile URL copied successfully",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your unique link and incoming anonymous messages.
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
          className="w-full sm:w-auto h-9"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Feed
        </Button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-xs border-muted/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Messages
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold">{messages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Messages received to date</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-muted/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Message Acceptance
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Power className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <Badge variant={acceptMessages ? "default" : "secondary"} className="mb-1">
                {acceptMessages ? "Accepting Messages" : "Paused"}
              </Badge>
              <p className="text-xs text-muted-foreground">Toggle availability</p>
            </div>
            <Switch
              checked={acceptMessages ?? false}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </CardContent>
        </Card>

        <Card className="shadow-xs border-muted/80 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Public URL
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <LinkIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono text-muted-foreground truncate bg-muted/40 p-2 rounded-md border border-border/40">
              {profileUrl}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shareable Link Box */}
      <Card className="bg-card border-dashed border-primary/30 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-primary" />
            Your Shareable Feedback Link
          </CardTitle>
          <CardDescription>
            Share this link on social media or with friends to receive anonymous feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <Input
              type="text"
              value={profileUrl}
              readOnly
              className="bg-muted/20 font-mono text-xs sm:text-sm h-10 flex-1"
            />
            <Button onClick={copyToClipboard} variant="default" className="shrink-0 h-10 px-5">
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

      <Separator className="my-6" />

      {/* Messages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Received Messages ({messages.length})</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
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
          <div className="text-center py-12 px-4 border border-dashed rounded-xl bg-muted/10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
              <Mail className="h-6 w-6 opacity-70" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">No messages yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Share your link with your network to start receiving anonymous feedback and questions!
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="mt-2">
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy Shareable Link
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;