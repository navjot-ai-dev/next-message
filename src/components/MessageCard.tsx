"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
import { Trash2, Loader2, Clock, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Message } from '@/models/User';
import { Badge } from './ui/badge';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  isDeleting?: boolean;
};

const MessageCard = ({ message, onMessageDelete, isDeleting = false }: MessageCardProps) => {
  const messageId = message._id.toString();

  const handleDeleteConfirm = () => {
    onMessageDelete(messageId);
  };

  const formattedDate = new Date(message.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-all border-muted/80 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            Anonymous Message
          </Badge>
        </div>

        {/* Delete Modal Trigger */}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 transition-colors"
                disabled={isDeleting}
                type="button"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">Delete message</span>
              </Button>
            }
          />

          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete message?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this secret message from your inbox. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-sm sm:text-base text-foreground leading-relaxed break-words whitespace-pre-wrap font-medium">
          "{message.content}"
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/20">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
