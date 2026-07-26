import {Message} from "@/models/User"

export interface ApiResponse{
    success: boolean;
    message: string;
    isAccesptingMessage?: boolean;
    messages?: Array<Message>
}