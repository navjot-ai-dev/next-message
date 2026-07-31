import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";



export async function POST(request: Request) {

    try {
         await dbConnect()


      const {username, email, password} = await request.json()

      const existingUserByUsername = await UserModel.findOne(
        {
            username,
            isVerified: true
        }
    )

    if(existingUserByUsername) {
        return Response.json({
            success: false,
            message: "Username already exists"
        },
         {
            status:400
         }
    )}

    const existingUserByEmail = await UserModel.findOne(
        {
            email,
            isVerified: true
        }
    )


     
    const verifyCode = Math.floor(100000+ Math.random()
* 900000).toString()

    if(existingUserByEmail) {

           if(existingUserByEmail.isVerified) {
            return Response.json({
                success: false,
                message: "Email already exists"
            },
             {
                status:400
             }
        )
           }else {
            existingUserByEmail.username = username
            existingUserByEmail.password = await bcrypt.hash(password, 10)
            existingUserByEmail.verifyCode = verifyCode
            const expiryDate = new Date(Date.now()+ 24*60*60*1000)
            existingUserByEmail.verifyCodeExpiry = expiryDate
            await existingUserByEmail.save()
           }

          }  else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date(Date.now()+ 24*60*60*1000)

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptedMessage: true,
            messages: []

        })

        await newUser.save()
    }
     //send verifaication email
     const emailResponse = await sendVerificationEmail(email, verifyCode ,username)

     if(!emailResponse.success) {
         return Response.json({
             success: false,
             message: emailResponse.message
         }, {
             status: 500
         })
     }

     return Response.json({
             success: true,
             message: "User registered successfully. Please check your email for verification code."
         }, {
             status: 201
         })

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