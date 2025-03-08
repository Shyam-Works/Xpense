// // models/Income.js
// import mongoose from "mongoose";

// const incomeSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   amount: { type: Number, required: true },
//   source: { type: String, required: true }, // e.g., salary, freelance work, etc.
//   date: { type: Date, default: Date.now },
// });

// const Income = mongoose.models.Income || mongoose.model("Income", incomeSchema);

// export default Income;
