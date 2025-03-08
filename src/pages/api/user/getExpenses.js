// pages/api/user/getExpenses.js (or the correct path for your app)
import { connectToDatabase } from "@/lib/db";
import Expense from "../../../models/Expense";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await connectToDatabase();

  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token - User ID missing" });
    }

    const userId = decoded.userId;

    const expenses = await Expense.find({ userId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalExpenses = await Expense.countDocuments({ userId });

    return res.status(200).json({ expenses, totalExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
