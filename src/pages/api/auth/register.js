import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt"

export default async function handler(req,res){
    if (req.method !== "POST") return res.status(400).json({error: "invalid method"});

    try {
        await connectToDatabase();
        const {username, email, password} = req.body;

        const existedUser = await User.findOne({email}); // find by email 
        if(existedUser){
            return res.status(400).json({error: "user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword});
        
        return res.status(201).json({message: "User registered successfully!!"})
    } catch (error) {
        return res.status(500).json({error: "internal server error"})
    }

}