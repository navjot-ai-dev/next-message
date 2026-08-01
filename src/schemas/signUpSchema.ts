import {z} from "zod";

export const usernameSchema = z.string().min(2).max(100).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const signUpSchema = z.object({  
    username:usernameSchema,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6).max(100)
});