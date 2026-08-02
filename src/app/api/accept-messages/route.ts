import {getServerSession} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
     const user: User = session?.user as User;
    if (!session || !session.user) {
        return new Response(JSON.stringify
            (
                { success: false, message: "Unauthorized" }
            ), 
            { status: 401 }
        );
    }

    const userId = user._id;
    const {acceptedMessages} = await req.json();

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
           {isAcceptingMessages: acceptedMessages},
            {new: true}
        );
        if (!updatedUser) {
            return new Response(JSON.stringify(
            { success: false,
             message: "Failed to update accepted messages" }), 
            { status: 404 });
        }

        return new Response(JSON.stringify
            ({ success: true, 
            message: "Accepted messages updated successfully" }),
         { status: 200 }
       
        );  
    } catch (error) {
        console.error("Error updating accepted messages:", error);
        return new Response(JSON.stringify(
            { success: false,
             message: "Internal Server Error"
                 }),
         { status: 500 });
    }
 
}
    export async function GET(req: Request) {
        await dbConnect();

        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

           if (!session || !session.user) {
            
        return new Response(JSON.stringify
            (
                {
                     success: false,
                     message: "Unauthorized" }
            ), 
            { status: 401 }
        );
    }
    const userId = user._id;
    
   try {
     const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
            return new Response(JSON.stringify(
            { success: false,
             message: "User not found" }), 
            { status: 404 });
        }

        return new Response(JSON.stringify
            ({ success: true, 
            isAcceptedMessages: foundUser.isAcceptingMessage }),
         { status: 200 })
    
   } catch (error) {
     console.error("Error updating accepted messages:", error);
        return new Response(JSON.stringify(
            { success: false,
             message: "Error in getting message"
                 }),
         { status: 500 });
    
   }

     } 