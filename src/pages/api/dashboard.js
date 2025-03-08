import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Expense from "@/models/Expense";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDatabase(); // Connect to MongoDB

    // Extract JWT token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // got userId from token

    // Fetch user details (income & expected saving)
    const user = await User.findById(userId).select("income expectedSaving");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch monthly expenses grouped by category
    const startOfMonth = new Date(new Date().setDate(1)); // First day of current month
    const expenses = await Expense.aggregate([
      { $match: { userId: user._id, date: { $gte: startOfMonth } } }, // Filter for current month
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      }, // Group by category
    ]);
    const dailyExpenses = await Expense.aggregate([
      { $match: { userId: user._id, date: { $gte: startOfMonth } } },
      {
        $group: {
          _id: { $dayOfMonth: "$date" }, // Group by day of the month
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by day
    ]);

    const weeklyExpenses = await Expense.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: startOfMonth }, // Match only expenses from the start of the current month
        },
      },
      {
        $addFields: {
          weekNumber: {
            $ceil: {
              $divide: [
                { $subtract: ["$date", startOfMonth] }, // Difference in days from the start of the month
                604800000, // Number of milliseconds in a week (7 * 24 * 60 * 60 * 1000)
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: "$weekNumber", // Group by calculated week number
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by week number (ascending)
    ]);

    const totalMonthlyExpense = expenses.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    const remainingAmount = user.income - totalMonthlyExpense;

    const formattedDailyExpenses = dailyExpenses.map((item) => ({
      day: item._id,
      totalAmount: item.totalAmount,
    }));

    const formattedExpenses = expenses.reduce((acc, item) => {
      acc[item._id] = { totalAmount: item.totalAmount, count: item.count };
      return acc;
    }, {});

    const formattedWeeklyExpenses = weeklyExpenses.map((item) => ({
      week: `Week ${item._id}`,
      category: item.highestCategory,
      totalAmount: item.totalAmount,
    }));

    return res.json({
      income: user.income,
      expectedSaving: user.expectedSaving,
      monthlyExpenses: formattedExpenses,
      totalMonthlyExpense: totalMonthlyExpense,
      remainingAmount,
      dailyExpenses: formattedDailyExpenses, // Add this
      weeklyExpenses: formattedWeeklyExpenses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
