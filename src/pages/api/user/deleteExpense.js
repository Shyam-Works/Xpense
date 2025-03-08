// pages/api/user/deleteExpense.js
import { connectToDatabase } from "@/lib/db";
import Expense from "../../../models/Expense";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method Not Allowed" });

  await connectToDatabase();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) return res.status(401).json({ error: "Invalid token - User ID missing" });

    const userId = decoded.userId;

    const { expenseId } = req.body;
    if (!expenseId) return res.status(400).json({ error: "Expense ID is required." });

    // Find and delete the expense by its ID
    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId, // Ensure the expense belongs to the logged-in user
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found or you're not authorized to delete it." });
    }

    return res.status(200).json({ message: "Expense deleted successfully!" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
