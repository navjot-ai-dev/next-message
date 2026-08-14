'use client'

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { Send, Sparkles, Loader2, MessageSquare, ShieldCheck, LogIn, UserPlus } from "lucide-react";

import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Validation schema for sending a message
const messageSchema = z.object({
  content: z.string().min(2, "Message must be at least 2 characters long").max(300, "Message is too long"),
});

type MessageFormData = z.infer<typeof messageSchema>;

const PublicProfilePage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isSending, setIsSending] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const currentContent = watch("content") || "";
  const charPercent = Math.min(100, Math.round((currentContent.length / 300) * 100));

  // Action: Send Message
  const onSubmit = async (data: MessageFormData) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      toast.add({
        title: "Message Delivered! 🚀",
        description: response.data.message || "Your anonymous message was sent.",
      });

      // Clear input
      setValue("content", "");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Failed to Send",
        description: axiosError.response?.data.message || "Could not send message. Try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Action: Call AI API
  const generateAiSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const promptIdea = currentContent.trim() || "friendly feedback or compliments";

      const response = await axios.post("/api/suggest-message", { message: promptIdea });
      const data = response.data;

      const list = [data.suggestion1, data.suggestion2, data.suggestion3].filter(Boolean);
      setSuggestions(list);

      toast.add({
        title: "AI Suggestions Ready ✨",
        description: "Click any suggestion below to fill your message.",
      });
    } catch (error) {
      toast.add({
        title: "AI Error",
        description: "Failed to get AI suggestions. Make sure your local Ollama instance is running.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSelectSuggestion = (suggestionText: string) => {
    setValue("content", suggestionText, { shouldValidate: true });
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto my-8 sm:my-16 px-4 sm:px-6">

      {/* Outer Gradient Card Frame */}
      <div className="p-0.5 rounded-3xl bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-teal-500/30 shadow-2xl">
        <Card className="border-none bg-card/95 backdrop-blur-xl rounded-[23px] overflow-hidden">

          <CardHeader className="text-center space-y-3 pb-4 pt-8 bg-gradient-to-b from-primary/5 to-transparent">

            {/* Avatar Header Ring */}
            <div className="relative mx-auto w-14 h-14">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-500 opacity-80 blur-xs" />
              <div className="relative w-14 h-14 rounded-2xl bg-background border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-md">
                <MessageSquare className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-1.5">
              <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight">
                Send a Message to <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">@{username}</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Anonymous. No registration required.</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6 sm:p-8">
            {/* Message Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    placeholder="Write your secret message or feedback here..."
                    rows={4}
                    spellCheck={false}
                    className="resize-none text-base p-4 rounded-xl border-border/80 focus-visible:ring-blue-500 bg-muted/20"
                    {...register("content")}
                  />

                  {/* Progress bar and counter */}
                  <div className="flex items-center justify-between px-1 pt-1.5">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${charPercent > 90 ? 'bg-destructive' : 'bg-blue-600'}`}
                        style={{ width: `${charPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {currentContent.length} / 300
                    </span>
                  </div>
                </div>

                {errors.content && (
                  <p className="text-xs text-destructive font-semibold">{errors.content.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-1">
                {/* AI Suggestion Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateAiSuggestions}
                  disabled={isSuggesting}
                  className="w-full sm:w-auto h-11 px-5 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 font-semibold gap-2"
                >
                  {isSuggesting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  )}
                  <span>Suggest with AI</span>
                </Button>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSending || !currentContent.trim()}
                  className="w-full sm:w-auto h-11 px-7 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:opacity-95 text-white font-bold shadow-lg shadow-blue-500/25 gap-2"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Send Anonymous Message</span>
                </Button>
              </div>
            </form>

            {/* AI Suggestions Display */}
            {suggestions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tap any prompt to use:
                  </p>
                  <div className="grid gap-2.5">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="p-3.5 text-left text-xs sm:text-sm rounded-xl border border-border/80 bg-muted/40 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all border-dashed group flex items-start gap-2.5"
                      >
                        <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0 mt-0.5 border-blue-500/30 text-blue-600 dark:text-blue-400">
                          Idea #{idx + 1}
                        </Badge>
                        <span className="text-muted-foreground group-hover:text-foreground italic leading-relaxed">
                          "{item}"
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Your Own Link Callout Box */}
      <div className="mt-8 text-center space-y-3 p-6 rounded-2xl bg-card/80 border border-border/80 shadow-md backdrop-blur-md">
        <p className="text-sm sm:text-base font-bold text-foreground">
          Want to receive anonymous messages like @{username}?
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Create your account to get your own unique shareable feedback link in seconds.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Button variant="outline" size="sm" className="h-9 px-4 font-medium">
            <Link href="/sign-in" className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-blue-500" />
              <span>Sign In</span>
            </Link>
          </Button>

          <Button size="sm" className="h-9 px-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-xs">
            <Link href="/sign-up" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Get Your Own Link</span>
            </Link>
          </Button>
        </div>
      </div>

    </div>
  );
};

export default PublicProfilePage;