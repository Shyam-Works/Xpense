import { useState } from "react";
import { useRouter } from "next/router";

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Define the loading state
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading state while the request is processing
    const endpoint =
      type === "register" ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      if (res.ok) {
        // On successful registration redirect to login
        if (type === "register") {
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else if (type === "login") {
          // Store JWT token in localStorage
          localStorage.setItem("token", data.token); // Store token 
          
          setTimeout(() => {
            router.push("/home/income");
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state after request finishes
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#e9c46a"}}>
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center" style={{color: "#264653"}}>
          {type === "login" ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Removed the username field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              name="email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              name="password"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn w-100 ${type === "login" ? "btn-success" : "btn-success"}`}
            style={{ backgroundColor: "#264653" }}
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-3 text-center">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <a href={type === "login" ? "/register" : "/login"} style={{color: "#264653"}}>
            {type === "login" ? "Register" : "Login"}
          </a>
        </p>
      </div>
    </div>
  );
}
