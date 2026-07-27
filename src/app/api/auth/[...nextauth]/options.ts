import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();
                const user = await UserModel.findOne({ email: credentials?.email });
                if (!user) {
                    throw new Error("Invalid email or password");
                }
                const isPasswordCorrect = await bcrypt.compare(credentials?.password || "", user.password);
                if (!isPasswordCorrect) {
                    throw new Error("Invalid email or password");
                }
                return user;
            }
        })
    ]
};