'use client'

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
  Trash2, 
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  const { data: session } = useSession();

  // ✅ 1. Fix: Added defaultValues so `acceptMessages` starts as `false` instead of `undefined`
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
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
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 md:p-8 bg-background rounded-xl border max-w-6xl shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your feedback link and incoming messages.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
          className="w-fit"
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
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Badge variant={acceptMessages ? "default" : "secondary"}>
              {acceptMessages ? "Active" : "Paused"}
            </Badge>
            {/* ✅ 2. Fix: Fallback `?? false` ensures strictly boolean value passed */}
            <Switch
              checked={acceptMessages ?? false}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </CardContent>
        </Card>

        <Card className="shadow-none sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Link Sharing
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground truncate">{profileUrl}</div>
          </CardContent>
        </Card>
      </div>

      {/* Shareable Link Bar */}
      <Card className="bg-muted/30 border-dashed shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Your Unique Public Link</CardTitle>
          <CardDescription>
            Share this link to receive anonymous messages from anyone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={profileUrl}
              readOnly
              className="bg-background font-mono text-sm"
            />
            <Button onClick={copyToClipboard} variant="default" className="shrink-0">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
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

      <Separator />

      {/* Messages Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Received Messages</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.map((message) => {
              const msgId = message._id.toString();
              const isDeletingThis = deletingId === msgId;

              return (
                <Card key={msgId} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      Received
                    </Badge>

                    {/* Delete Confirmation Modal */}
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                          disabled={isDeletingThis}
                          type="button"
                        >
                          {isDeletingThis ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This message will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMessage(msgId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <p className="text-sm text-foreground whitespace-pre-wrap mb-4">
                      {message.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-xl bg-muted/10">
            <Mail className="mx-auto h-10 w-10 text-muted-foreground mb-3 opacity-60" />
            <p className="text-base font-semibold text-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Share your link above to start receiving feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;