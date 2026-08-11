import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function AuthForm({ initialMode = "login", onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const navigate = useNavigate();

  const formRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  // Escape-to-close + focus trap, ported from Modal.jsx
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key === "Tab" && formRef.current) {
        const focusable = formRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Move focus in on mount, restore on unmount
  useEffect(() => {
    previouslyFocusedElementRef.current = document.activeElement;
    formRef.current?.querySelector(FOCUSABLE_SELECTOR)?.focus();
    return () => previouslyFocusedElementRef.current?.focus?.();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <form
        ref={formRef}
        className={styles.form}
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        {onClose ? (
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        ) : null}

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
        {error ? <p role="alert">{error}</p> : null}
        {infoMessage ? <p>{infoMessage}</p> : null}
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
