import {getServerSession} from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";


export async function DELETE(request:Request, { params }: { params: { messageId: string } }) {
    const messageId  = params.messageId;
    await dbConnect()
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

    try {
       const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updatedResult.modifiedCount === 0) {
            return new Response(JSON.stringify(
                { success: false, message: "Message not found or already deleted" }),
                { status: 404 }
            );
        }
        return new Response(JSON.stringify(
            { success: true, message: "Message deleted successfully" }),
            { status: 200 }
        );


    } catch (error) {
        console.error("Error deleting message:", error);
        return new Response(JSON.stringify(
            { success: false, message: "Error deleting message" }),
            { status: 500 }
        );
    }

}