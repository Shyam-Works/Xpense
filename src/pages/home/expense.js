import { useState, useEffect } from "react";
import Link from "next/link";
import { Bruno_Ace_SC } from "next/font/google";
const brunoAceSC = Bruno_Ace_SC({
  weight: "400", // Use "400" because the font only supports this weight
  subsets: ["latin"],
});
export default function Expense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Page number for pagination
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Fetch expenses when the component mounts or when page changes
  useEffect(() => {
    fetchExpenses();
  }, [page]); // when page got changed fetch it again 

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must log in first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/user/getExpenses?page=${page}&limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setExpenses((prev) => [...prev, ...data.expenses]);
        setTotalExpenses(data.totalExpenses);
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreExpenses = () => {
    if (expenses.length < totalExpenses) {
      setPage(page + 1);
    }
  };

  const deleteExpense = async (expenseId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must log in first.");
      return;
    }

    try {
      const response = await fetch("/api/user/deleteExpense", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expenseId }),
      });

      const data = await response.json();
      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense._id !== expenseId));
        setMessage(data.message || "Expense deleted successfully!");
      } else {
        setMessage(data.error || "Failed to delete expense.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("Failed to delete expense.");
    }
  };

  const addExpense = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Session expired, Login again...");
      return;
    }

    try {
      const response = await fetch("/api/user/addExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, category, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
      } else {
        setMessage("Expense added successfully!");
        setAmount("");
        setCategory("");
        setDescription("");
        setPage(1); // Reset to the first page after adding
        fetchExpenses(); // Fetch expenses again
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ margin: 0, padding: 0, boxSizing: "border-box", width: "100%" , backgroundColor: "#e9c46a"}}
    >
      <div className="nav-container" style={{ backgroundColor: "#264653" }}>
        <nav className="navbar navbar-expand-lg navbar-dark">
        <a
        className={`navbar-brand ${brunoAceSC.className}`} // Apply the font class
        href="#"
        style={{ color: "#f1f7ed", marginLeft: "30px" }}
      >
        Xpense
      </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto" style={{ marginRight: "40px" }}>
              <li className="nav-item">
                <Link
                  href="/home/income"
                  className="nav-link"
                  style={{ color: "#f1f7ed" }}
                >
                  Income
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/home/expense"
                  className="nav-link"
                  style={{ color: "#f1f7ed" }}
                >
                  Expense
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/home/dashboard"
                  className="nav-link"
                  style={{ color: "#f1f7ed" }}
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight: "50vh",
          width: "100%",
          // padding: "20px",
        }}
      >
        <h1
          className="text-center mb-4"
          style={{ color: "#264653", marginTop: "15rem" }}
        >
          Add Expense
        </h1>

        {/* Add Expense Form */}
        <div className="row justify-content-center" style={{backgroundColor: "#f1f7ed", width: "50%", padding: "20px", borderRadius: "10px", minWidth: "350px"}}>
          <div className="col-12">
            {" "}
            {/* Add col-12 for full width */}
            <div className="mb-3">
              <label>Amount</label>
              <input
                type="number"
                placeholder="XXXX"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  backgroundColor: "#f1f7ed",
                  color: "#264653",
                  border: "1px solid #264653",
                  width: "100%", // Ensure full width for input
                }}
              />
            </div>
            <div className="mb-3">
              <label>Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  backgroundColor: "#f1f7ed",
                  color: "#264653",
                  border: "1px solid #264653",
                  width: "100%", // Ensure full width for select dropdown
                }}
              >
                <option value="">Select Category</option>
                <option value="Transport">Transport</option>
                <option value="Food">Food</option>
                <option value="Grocery">Grocery</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Enter description (optional)</label>
              <input
                type="text"
                placeholder="Enter description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  backgroundColor: "#f1f7ed",
                  color: "#264653",
                  border: "1px solid #264653",
                  width: "100%", // Ensure full width for input
                }}
              />
            </div>
            <button
              onClick={addExpense}
              className="btn btn-block"
              style={{
                backgroundColor: "#264653",
                color: "#f1f7ed",
                borderColor: "#264653",
                width: "100%", // Keep the button full width,
                marginTop: "10px",
              }}
            >
              Add Expense
            </button>
            {message && (
              <p className="mt-3 text-center" style={{ color: "#264653" }}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="mt-5" style={{ backgroundColor: "#264653" }}>
        <h1
          className="text-center mb-4 py-3"
          style={{ color: "#f1f7ed", marginTop: "23rem" }}
        >
          Expense List
        </h1>
        {loading && <p className="text-center">Loading...</p>}

        {expenses.length === 0 ? (
          <p className="text-center" style={{ color: "#ffffff" }}>
            No expenses found.
          </p>
        ) : (
          <ul className="list-group m-3">
            {expenses.map((expense) => (
              <li
                key={expense._id}
                className="list-group-item mb-3"
                style={{
                  backgroundColor: "#fdfffc",
                  color: "#000000",
                  borderRadius: "10px",
                  border: "#7ca982",
                  margin: "0 10px"
                }}
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(expense.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Amount:</strong> ${expense.amount}
                </p>
                <p>
                  <strong>Category:</strong> {expense.category}
                </p>
                <p>
                  <strong>Description:</strong> {expense.description}
                </p>
                <button
                  onClick={() => deleteExpense(expense._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {expenses.length < totalExpenses && !loading && (
          <div className="text-center mt-4">
            <button
              onClick={loadMoreExpenses}
              className="btn btn-outline-secondary"
              style={{ backgroundColor: "#e9c46a", color: "#364653", marginBottom: "20px" }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
