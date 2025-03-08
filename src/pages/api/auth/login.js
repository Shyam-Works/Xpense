import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Invalid method"); // Log if the method is not POST
    return res.status(400).json({
      error: "Invalid method",
    });
  }

  try {
    console.log("Connecting to the database..."); // Log before database connection
    await connectToDatabase();
    
    const { email, password } = req.body;
    console.log("Email and password received:", { email, password }); // Log received data

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); // Log if user is not found
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("Invalid credentials"); // Log if credentials are invalid
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Generated Token:", token); // Log token

    // Return the token in the response
    return res.status(200).json({
      message: "Login successful",
      token,  // Return token instead of userId
    });

  } catch (error) {
    console.error("Login Error:", error);  // Add error logging
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
