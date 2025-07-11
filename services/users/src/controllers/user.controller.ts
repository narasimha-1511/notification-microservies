import { Request , Response  } from "express";
import logger from "../utils/logger";
import User from "../models/user.model";
import { signToken } from "../utils/jwt";

export const login = async (req : Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user){
            logger.warn(`User not found ${email}`);
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        if(!isPasswordCorrect){
            // logger.warn(`Invalid Password ${email}`);
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
            message: "User Logged In Successfully"
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
            // logger.error(`User with this email already exists ${email}`);
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

export const getUser = async (req : Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences
            }
        })
    } catch (error) {
        logger.error(`error fetching user ${error}`);
        res.status(500).json({
            success: false,
            message: "Error Fetching User"
        })
    }
}

export const updateUserPreferences = async (req: Request, res: Response): Promise<any> => {
    try {

        const userId = req.headers['x-user-id'] as string;

        if(!userId){
            logger.warn(`attempted to update user preferences without user ID`);
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const { preferences } = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        user.preferences = preferences;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User preferences updated successfully",
            updatedPreferences: user.preferences
        })
    } catch (error) {
        logger.error(`error updating user preferences ${error}`);
        res.status(500).json({
            success: false,
            message: "Error Updating User Preferences"
        })
    }
}

export const getAllUsers = async (req: Request , res: Response): Promise<any> => {
    try {
        const preferenceTypes = ['PROMOTIONS', 'NEWSLETTER', 'ORDER_UPDATES', 'RECOMMENDATIONS'];

        const queryPreferences = req.query.preferences as string;

        if(!queryPreferences){
            const users = await User.find();
            return res.status(200).json(users);
        }

        const queryPreferencesArray = queryPreferences.split(',');

        for(const preference of queryPreferencesArray){
            if(!preferenceTypes.includes(preference)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid preference"
                });
            }
        }

        const users = await User.find({
            preferences: {
                $in: queryPreferencesArray
            },
        }, {
            _id : 1,
        });

        console.log(users);

        return res.status(200).json(users);
        
    } catch (error) {
        logger.error(`error fetching all users ${error}`);
        res.status(500).json({
            success: false,
            message: "Error Fetching All Users"
        })
    }
}