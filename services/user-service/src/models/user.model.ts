import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserPreferences = 'promotions' | 'newsletter' | 'order_updates' | 'recommendations';

interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    preferences: UserPreferences[];
    matchPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
        select: false
    },
    preferences: {
        type: [String],
        enum: ['promotions', 'newsletter', 'order_updates', 'recommendations'],
        default: [],
    }
} , { timestamps : true });

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.matchPassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;