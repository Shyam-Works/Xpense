import { connectToDatabase } from "@/lib/db";
import Expense from "../../../models/Expense";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  await connectToDatabase();

  const { amount, category, description } = req.body;

  if (!amount || !category)
    return res.status(400).json({ error: "Amount and category are required." });

  if (amount <= 0)
    return res.status(400).json({ error: "Amount should be greater than 0." });

  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token)
      return res.status(401).json({ error: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId)
      return res.status(401).json({ error: "Invalid token - User ID missing" });

    const userId = decoded.userId;

    // console.log("Decoded User ID:", userId); // Debugging log

    // saving new expense
    const newExpense = new Expense({
      userId, // Assigning userId
      amount,
      category,
      description,
    });

    await newExpense.save();
    return res.status(201).json({ message: "Expense added successfully!" });
  } catch (error) {
    console.error("Error adding expense:", error);


    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
