import { useState } from "react";
import { track } from "@vercel/analytics";

function Signup({ onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {

        setMessage(data.message || "Account created successfully");

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Could not reach server");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="signup-username">Username</label>

        <div className="auth-input-box">
          <span className="auth-icon">👤</span>
          <input
            id="signup-username"
            type="text"
            placeholder="Choose your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-email">Email</label>

        <div className="auth-input-box">
          <span className="auth-icon">✉️</span>
          <input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-password">Password</label>

        <div className="auth-input-box">
          <span className="auth-icon">🔒</span>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="signup-confirm-password">Confirm Password</label>

        <div className="auth-input-box">
          <span className="auth-icon">🔒</span>
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <button type="submit" className="auth-submit-btn">
        Create Account
      </button>

      {message && <p className="auth-message success">{message}</p>}
      {error && <p className="auth-message error">{error}</p>}
    </form>
  );
}

export default Signup;