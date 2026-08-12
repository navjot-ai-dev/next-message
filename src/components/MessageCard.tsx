"use client";
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from 'lucide-react';
import { Button } from './ui/button';
import { Message } from '@/models/User';
import { toast } from './ui/toast';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps ={
  message: Message;
  onMessageDelete: (messageId:string) => void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

  const handeleDeleteConfirm = async () => {
   const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    toast.add({
            title: response.data.message 
          });
          onMessageDelete(message._id)
  }

  return (
    
      <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
                     <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete Chat</Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View{" "}
            <a href="#">Settings</a> delete any memories saved during this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
               <CardDescription>Card Description</CardDescription>
           
                </CardHeader>
          <CardContent>
                  
              </CardContent>
  
                 </Card>
  )
}

export default MessageCard
