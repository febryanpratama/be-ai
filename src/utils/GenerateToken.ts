import { sign } from "jsonwebtoken";
import { User } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || "";

export const generateToken = (
    data: User
): { token:string } => ({
    token: sign(
        {
            id: data.id,
            name: data.name,
            email: data.email,
            address: data.address,
            role: data.role,
        },
        JWT_PUBLIC_KEY,
        {
            expiresIn: "7d",
            algorithm: "HS256",
        },

    ),
})
