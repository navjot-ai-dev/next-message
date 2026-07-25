import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt: Date;
};

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
});


export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    message: Message[],
    match: RegExp | string
}

const UserSchema : Schema<User> = new Schema({
    username:{
        type: String,
        required: [true,'username is requried'],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match:[/ ^[^\s@]+@[^\s@]+\.[^\s@]+$ / , 'please use a valid email address']
    },
    password:{
        type: String,
        required: [true,'password is requried'],
    },
    verifyCode:{
         type: String,
        required: [true,'Verify code is requried'],
    },
     verifyCodeExpiry:{
         type: Date,
        required: [true,'Verify code Expiry is requried'],
    }
});