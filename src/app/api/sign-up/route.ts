import dbConnet from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";



export async function POST(request: Request) {
    await dbConnet()

    try {
      const {username, email, password} = await request.json()

      
        
    } catch (error) {
        console.error('Error registering user' , error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
         {
            status:500
         }
    )
    }
}