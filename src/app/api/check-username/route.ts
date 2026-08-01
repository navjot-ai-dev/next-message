import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod";
import{usernameSchema} from '@/schemas/signUpSchema';


const usernameValidation = z.object({
    username:usernameSchema
});

export async function GET(request:Request) {
    await dbConnect()

    try {

        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = usernameValidation.safeParse(queryParam)
        console.log(result)
        
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message:"Error checking username"
        },
    {status:500}
    )
        
    }


}