// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ["Transport", "Food", "Grocery", "Entertainment", "Others"], required: true },
  description: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
