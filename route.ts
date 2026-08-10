import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { username, code } = body;

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Code is valid and not expired
      user.isVerified = true;
      await user.save();
      return new Response(JSON.stringify({ success: true, message: "Verification code is valid" }), { status: 200 });
    }

    if (!isCodeValid) {
      return new Response(JSON.stringify({ success: false, message: "Invalid verification code" }), { status: 400 });
    }

    if (!isCodeNotExpired) {
      return new Response(JSON.stringify({ success: false, message: "Verification code has expired,Please signUp again to get a new code" }), { status: 400 });
    }

  } catch (error) {
    console.error("Error verifying code:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }),
     { status: 500 });
  }}