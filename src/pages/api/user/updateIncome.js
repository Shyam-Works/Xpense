import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(400).json({ error: "Invalid method" });
  }

  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    await connectToDatabase();

    const { income, expectedSaving } = req.body; // get from body 
    const user = await User.findById(decoded.userId); // get user
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the income and expected saving
    user.income = income;
    user.expectedSaving = expectedSaving;
    await user.save();

    // response to frontend
    return res.status(200).json({
      message: "Income and expected saving updated",
      income: user.income,
      expectedSaving: user.expectedSaving,
    });

  } catch (error) {
    console.error("Error updating income:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
