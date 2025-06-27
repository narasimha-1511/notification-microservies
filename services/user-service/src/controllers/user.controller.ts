import { Request , Response , RequestHandler } from "express";
import logger from "../utils/logger";
import User from "../models/user.model";
import { signToken } from "../utils/jwt";

export const login = async (req : Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = signToken({
            userId: user._id,
            email: user.email
        });

        return res.status(200).json({
            success: true,
            accessToken: token,
        })
    } catch (error) {
        logger.error(`error logging in ${error}`);
        res.status(500).json({
            success: false,
            message: "Error Logging In"
        })
    }
}


export const register = async (req : Request, res: Response): Promise<any> => {
    try {
        
        const { name, email, password, preferences } = req.body;

        const user = await User.findOne({ email });

        if(user){
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        const newUser = await User.create({ name, email, password, preferences });

        const token = signToken({
            userId: newUser._id,
            email: newUser.email
        });

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            accessToken: token,
        })

    } catch (error) {
        logger.error(`error registering user ${error}`);
        res.status(500).json({
            success: false,
            message: "Error Registering User"
        })
    }
}