// components/UpdateIncome.js
import { useState } from "react";

export default function UpdateIncome() {
  const [newIncome, setNewIncome] = useState(0); // Store the new income entered by the user
  const [message, setMessage] = useState(""); // Display success or error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call the API to update income
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    try {
      const res = await fetch("/api/user/updateIncome", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
        body: JSON.stringify({ income: newIncome }), // Send the updated income to the backend
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Income updated successfully.");
      } else {
        setMessage(data.error || "Error updating income.");
      }
    } catch (error) {
      console.error("Error during income update:", error);
      setMessage("An error occurred while updating income.");
    }
  };

  return (
    <div>
      <h2>Update Your Income</h2>
      <form onSubmit={handleSubmit}>
        <label>
          New Income:
          <input
            type="number"
            value={newIncome}
            onChange={(e) => setNewIncome(Number(e.target.value))}
            required
          />
        </label>
        <button type="submit">Update Income</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
