import { useState, useEffect } from "react";
import Link from "next/link";
import { Bruno_Ace_SC } from "next/font/google";

const brunoAceSC = Bruno_Ace_SC({
  weight: "400", // Use "400" because the font only supports this weight
  subsets: ["latin"],
});

export default function IncomePage() {
  const [income, setIncome] = useState("");
  const [expectedSaving, setExpectedSaving] = useState("");
  const [message, setMessage] = useState("");

  const updateIncome = async () => {
    const token = localStorage.getItem("token"); // Get token

    if (!token) {
      console.error("No token found in localStorage");
      setMessage("You must log in first.");
      return;
    }

    try {
      const response = await fetch("/api/user/updateIncome", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token
        },
        body: JSON.stringify({ income, expectedSaving }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error);
        console.error("Error updating income:", data.error);
      } else {
        setMessage("Income updated successfully!");
        console.log("Success:", data);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#e9c46a", // Secondary color for the background (30%)
        minHeight: "100vh",
        color: "#f1f7ed", // Primary color for the text (60%)
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div
        className="container-fluid m-0 p-0"
        style={{
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          width: "100%",
          backgroundColor: "#e9c46a",
        }}
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
            <div
              className="collapse navbar-collapse right-align"
              id="navbarNav"
            >
              <ul
                className="navbar-nav ms-auto"
                style={{ marginRight: "40px" }}
              >
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
            minHeight: "80vh",
            width: "100%",
            padding: "20px",
          }}
        >
          <h1
            className="text-center"
            style={{ color: "#264653", padding: "20px" }}
          >
            Income & Saving
          </h1>
          <div
            className="w-50 mx-auto"
            style={{
              backgroundColor: "#f1f7ed",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <div className="mb-3" style={{ backgroundColor: "#f1f7ed" }}>
              <label style={{ color: "#264653" }}>Enter Income</label>
              <input
                type="number"
                placeholder="XXXX"
                className="form-control"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                style={{
                  backgroundColor: "#f1f7ed",
                  color: "#243e36",
                  border: "1px solid #264653",
                  width: "100%", // Make the input full-width
                }}
              />
            </div>
            <div className="mb-3">
              <label style={{ color: "#264653" }}>Enter saving</label>
              <input
                type="number"
                placeholder="XXXX"
                className="form-control"
                value={expectedSaving}
                onChange={(e) => setExpectedSaving(e.target.value)}
                style={{
                  backgroundColor: "#f1f7ed",
                  color: "#243e36",
                  border: "1px solid #264653",
                  width: "100%", // Make the input full-width
                }}
              />
            </div>
            <div className="d-grid gap-2">
              <button
                className="btn btn-light"
                onClick={updateIncome}
                style={{
                  backgroundColor: "#264653",
                  color: "#ffffff",
                  width: "100%", // Make the button full-width
                }}
              >
                Save
              </button>
            </div>
          </div>
          {message && (
            <p className="mt-3 text-center" style={{ color: "#264653" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
