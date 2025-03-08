import { useState, useEffect } from "react";

export default function ExpenseHistory() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [page]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token"); // Get token

    if (!token) {
      setMessage("You must log in first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/user/getExpenses?page=${page}&limit=${limit}`, {
        headers: {
          "Authorization": `Bearer ${token}`, // Send token
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
      } else {
        setExpenses((prevExpenses) => [...prevExpenses, ...data.expenses]);
        setTotalExpenses(data.totalExpenses);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (expenses.length < totalExpenses) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <h1>Expense History</h1>
      {message && <p>{message}</p>}

      <div>
        {expenses.length === 0 && !loading && <p>No expenses to show.</p>}

        {expenses.map((expense) => (
          <div key={expense._id} className="expense-item">
            <p><strong>Amount:</strong> ${expense.amount}</p>
            <p><strong>Category:</strong> {expense.category}</p>
            <p><strong>Description:</strong> {expense.description || "No description"}</p>
            <p><strong>Date:</strong> {new Date(expense.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {!loading && expenses.length < totalExpenses && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
}
