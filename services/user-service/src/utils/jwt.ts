import jwt, { SignOptions } from "jsonwebtoken";
import { getEnv } from "../config/env";
import { UserPreferences } from "../models/user.model";

export const signToken = (payload: object): string => {
    return  jwt.sign(payload , getEnv("JWT_SECRET") , {
        expiresIn: getEnv('JWT_EXPIRY') 
    } as SignOptions)
}

export const verifyToken = (token: string) => {
    return jwt.verify(token , getEnv('JWT_SECRET')) as {
        userId: string,
        email: string,
        preferences: UserPreferences[]
    }
}
