import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { Bruno_Ace_SC } from "next/font/google";

const brunoAceSC = Bruno_Ace_SC({
  weight: "400", // Use "400" because the font only supports this weight
  subsets: ["latin"],
});

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return <p className="text-center text-xl text-gray-600">Loading...</p>;

  // Convert data for Recharts
  const expenseData = data?.monthlyExpenses
    ? Object.entries(data.monthlyExpenses).map(
        ([category, { totalAmount }]) => ({
          name: category,
          value: totalAmount,
        })
      )
    : [];

  const expenseFrequencyData = data?.monthlyExpenses
    ? Object.entries(data.monthlyExpenses).map(([category, { count }]) => ({
        category,
        count,
      }))
    : [];

  const dailyExpenseData = data?.dailyExpenses
    ? data.dailyExpenses.map(({ day, totalAmount }) => ({
        day: `Day ${day}`,
        totalAmount,
      }))
    : [];

  const weeklyExpenseData = data?.weeklyExpenses
    ? data.weeklyExpenses.map(({ week, totalAmount }) => ({
        week,
        totalAmount,
      }))
    : [];

  const spendingComparisonData = [
    {
      name: "Spending",
      Income: data?.income,
      "Expected Saving": data?.expectedSaving,
      Spending: data?.totalMonthlyExpense,
    },
  ];

  const COLORS = [
    "#264653",
    "#2a9d8f",
    "#e9c46a",
    "#f4a261",
    "#e76f51",
    "#8ab17d",
    "#efb366",
  ];

  return (
    <div
      className="container-fluid"
      style={{ margin: 0, padding: 0, boxSizing: "border-box", width: "100%" }}
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
          <div className="collapse navbar-collapse right-align" id="navbarNav">
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

      <h2
        className="text-center text-2xl font-bold mb-4 mt-4"
        style={{ color: "#243e36" }}
      >
        Dashboard
      </h2>

      {/* Upper Info Cards with Flexbox */}
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className="bg-gradient-to-r from-[#243e36] to-[#7ca982] p-6 rounded-xl shadow-lg flex flex-wrap justify-between items-center"
          style={{
            color: "#f6f7eb",
            backgroundColor: "#393e41",
            borderRadius: "10px",
          }}
        >
          <div className="flex-1 text-center mb-4">
            <h4 className="font-semibold text-xl pt-4">Income</h4>
            <b>
              <p className="text-2xl font-bold">${data?.income}</p>
            </b>
            <p>----------</p>
          </div>
          <div className="flex-1 text-center mb-4">
            <h4 className="font-semibold text-xl">Expected Saving</h4>
            <b>
              <p className="text-2xl font-bold">${data?.expectedSaving}</p>
            </b>
            <p>----------</p>
          </div>
          <div className="flex-1 text-center mb-4">
            <h4 className="font-semibold text-xl">Total Monthly Expense</h4>
            <b>
              <p className="text-2xl font-bold">${data?.totalMonthlyExpense}</p>
            </b>
            <p>----------</p>
          </div>
          <div className="flex-1 text-center mb-4 pb-4">
            <h4 className="font-semibold text-xl">Remaining Balance</h4>
            <b>
              <p className="text-2xl font-bold">
                ${data?.remainingAmount?.toFixed(2)}
              </p>
            </b>
          </div>
        </div>
      </div>

      {/* Monthly Expenses Section */}
      {/* <h3 className="text-lg font-semibold mt-6 ">Monthly Expenses</h3>
  <ul className="list-disc ml-6">
    {data?.monthlyExpenses &&
      Object.entries(data.monthlyExpenses).map(([category, { totalAmount, count }]) => (
        <li key={category}>
          <strong>{category}:</strong> ${totalAmount} (Transactions: {count})
        </li>
      ))}
  </ul> */}

      {/* Expense Breakdown Section */}
      <h3 className="text-lg font-semibold mt-6 text-center mt-4 mb-4">
        Expense Breakdown
      </h3>
      <div className="flex flex-wrap justify-center gap-8">
        <h3 className="text-lg font-semibold mt-5 mb-5 text-center">
          <u>Category-wise Monthly Expense</u>
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ResponsiveContainer width="80%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(2)}`} // Ensuring two decimal places
              >
                {expenseData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <h3 className="text-lg font-semibold mt-5 mb-5 text-center">
          <u>Expense Frequency by Category</u>
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ResponsiveContainer width="80%" height={300}>
            <BarChart data={expenseFrequencyData} margin={{ bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tick={{ angle: -45, textAnchor: "end" }}
                tickMargin={0}
              />
              <YAxis />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ marginBottom: 20 }}
              />

              <Bar dataKey="count" fill="#364653" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Expense Trend */}
      <h3 className="text-lg font-semibold mt-5 mb-5 text-center">
        <u>Daily Expense Trend</u>
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveContainer width="80%" height={300}>
          <LineChart data={dailyExpenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#243e36"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Expense Trend */}
      <h3 className="text-lg font-semibold justify-content mt-5 mb-5 text-center">
        <u>Weekly Expense Trend</u>
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveContainer width="80%" height={275}>
          <LineChart data={weeklyExpenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#243e36"
              strokeWidth={10}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expected vs Actual Spending vs Income */}
      <h3 className="text-lg font-semibold mt-5 mb-5 text-center">
        <u>Expected vs Actual Spending vs Income</u>
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "100px",
        }}
      >
        <ResponsiveContainer width="80%" height={300}>
          <BarChart data={spendingComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey=" " />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Income" fill="#264653" radius={[10, 10, 0, 0]} />
            <Bar
              dataKey="Expected Saving"
              fill="#2a9d8f"
              radius={[10, 10, 0, 0]}
            />
            <Bar dataKey="Spending" fill="#e9c46a" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
