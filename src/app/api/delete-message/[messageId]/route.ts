import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; // Double-check this relative path matches your directory structure!
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

// 1. In Next.js 15+, params is a Promise and must be awaited
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  // 2. Un-wrap params
  const { messageId } = await params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // 3. Authentication Check
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 4. Pull message from array matching the user's ID and message ID
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}