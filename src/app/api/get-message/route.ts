import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Safely cast string ID to Mongoose ObjectId
    const userId = new mongoose.Types.ObjectId(user._id);

    const foundUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // IF USER HAS NO MESSAGES AT ALL:
    // $unwind returns an empty array []. We should check if the user actually exists 
    // and return an empty array instead of throwing a 404 error.
    if (!foundUser || foundUser.length === 0) {
      // Double check if the user actually exists in DB
      const existingUser = await UserModel.findById(userId);
      
      if (!existingUser) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      // User exists, but simply has no messages yet
      return Response.json(
        { success: true, messages: [] },
        { status: 200 }
      );
    }

    // Return aggregated messages sorted newest-first
    return Response.json(
      { success: true, messages: foundUser[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}