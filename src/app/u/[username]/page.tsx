'use client'

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { Send, Sparkles, Loader2, MessageSquare } from "lucide-react";

import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  // Action: Send Message
  const onSubmit = async (data: MessageFormData) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      toast.add({
        title: "Message Sent! 🚀",
        description: response.data.message || "Your anonymous message was delivered.",
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
        title: "Suggestions Ready ✨",
        description: "Click any suggestion below to insert it.",
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
      <Card className="shadow-lg border-muted/80 bg-card">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              Send an Anonymous Message to @{username}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              They won't know who sent this. Keep it constructive and friendly!
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <div className="relative">
                <Textarea
                  placeholder="Write your secret message here..."
                  rows={4}
                  className="resize-none text-sm sm:text-base p-3.5 focus-visible:ring-primary"
                  {...register("content")}
                />
                <span className="absolute bottom-2.5 right-3 text-[11px] text-muted-foreground font-mono">
                  {currentContent.length} / 300
                </span>
              </div>

              {errors.content && (
                <p className="text-xs text-destructive font-medium">{errors.content.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              {/* AI Suggestion Button */}
              <Button
                type="button"
                variant="outline"
                onClick={generateAiSuggestions}
                disabled={isSuggesting}
                className="w-full sm:w-auto h-10 gap-2"
              >
                {isSuggesting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Sparkles className="h-4 w-4 text-amber-500" />
                )}
                <span>Suggest with AI</span>
              </Button>

              {/* Submit Button */}
              <Button type="submit" disabled={isSending || !currentContent.trim()} className="w-full sm:w-auto h-10 gap-2">
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Send Message</span>
              </Button>
            </div>
          </form>

          {/* AI Suggestions Display */}
          {suggestions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tap a suggestion to use:
                </p>
                <div className="grid gap-2">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="p-3 text-left text-xs sm:text-sm rounded-lg border border-border/60 bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-all border-dashed group"
                    >
                      <span className="text-muted-foreground group-hover:text-foreground italic">
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
  );
};

export default PublicProfilePage;