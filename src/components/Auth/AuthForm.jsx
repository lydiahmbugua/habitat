import { useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";

function AuthForm({ initialMode = "login", onClose }) {
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // FIX: without this, Supabase falls back to the project's Auth
          // "Site URL" setting (often still localhost) for the confirmation
          // link, instead of wherever the app is actually running.
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setInfoMessage("Check your email to confirm your account.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className={styles.heading}>
          {mode === "signup" ? "Sign Up" : "Log In"}
        </h2>
        <p className={styles.subheading}>
          {mode === "signup"
            ? "Create an account to start tracking your habits."
            : "Log in to access your habit tracker."}
        </p>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          minLength={6}
          required
        />
        {error ? (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        ) : null}
        {infoMessage ? <p className={styles.info}>{infoMessage}</p> : null}
        <button className={styles.primaryButton} type="submit">
          {mode === "signup" ? "Sign up" : "Log in"}
        </button>
        <p className={styles.authSwitch}>
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <button
            type="button"
            className={styles.authLink}
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
