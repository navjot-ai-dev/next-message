import dbConnect from "@/lib/dbConnect";
import UserModel, { User, Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();
    
    // Safely decode URL components
    const decodedUsername = decodeURIComponent(username);

    // 1. Find user
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 2. Check acceptance status
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    // 3. Append message and save
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    // 4. Return success with status 200
    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}