import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import "../styles/Auth.css";
import "..//App.css"

function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState("signup");

  function switchMode(newMode) {
    setMode(newMode);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => switchMode("signin")}
          >
            Sign In
          </button>

          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "signin" ? (
          <Login onAuthSuccess={onAuthSuccess} />
        ) : (
          <Signup onAuthSuccess={onAuthSuccess} />
        )}
      </section>
    </main>
  );
}

export default Auth;