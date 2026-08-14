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

  const currentContent = watch("content");

  // 1. Action: Send Message to Database
  const onSubmit = async (data: MessageFormData) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      toast.add({
        title: "Message Sent!",
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

  // 2. Action: Call your Ollama AI API
  const generateAiSuggestions = async () => {
    setIsSuggesting(true);
    try {
      // Passes the current text or a fallback topic if empty
      const promptIdea = currentContent.trim() || "friendly feedback or compliments";
      
      const response = await axios.post("/api/suggest-message", { message: promptIdea });
      const data = response.data;

      // Extract suggestions from response
      const list = [data.suggestion1, data.suggestion2, data.suggestion3].filter(Boolean);
      setSuggestions(list);

      toast.add({
        title: "Suggestions Ready ✨",
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

  // 3. Action: Select an AI suggestion
  const handleSelectSuggestion = (suggestionText: string) => {
    setValue("content", suggestionText, { shouldValidate: true });
  };

  return (
    <div className="container max-w-2xl mx-auto my-12 px-4">
      <Card className="shadow-lg border-muted">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <MessageSquare className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Send an Anonymous Message to @{username}
          </CardTitle>
          <CardDescription>
            They won't know who sent this. Keep it clean and friendly!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Write your secret message here..."
                rows={4}
                className="resize-none text-base"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-destructive font-medium">{errors.content.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              {/* AI Suggestion Button */}
              <Button
                type="button"
                variant="outline"
                onClick={generateAiSuggestions}
                disabled={isSuggesting}
                className="w-full sm:w-auto"
              >
                {isSuggesting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                )}
                Suggest with AI
              </Button>

              {/* Submit Button */}
              <Button type="submit" disabled={isSending} className="w-full sm:w-auto">
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Message
              </Button>
            </div>
          </form>

          {/* AI Suggestions Display */}
          {suggestions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Click a suggestion to use it:
                </p>
                <div className="grid gap-2">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="p-3 text-left text-sm rounded-lg border bg-muted/30 hover:bg-muted transition-colors border-dashed"
                    >
                      "{item}"
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