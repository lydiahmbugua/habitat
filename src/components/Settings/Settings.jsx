import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { supabase } from "../../lib/supabaseClient";
import styles from "./Settings.module.css";
import AppNav from "../Navigation/AppNav.jsx";
import { useTheme } from "../../context/useTheme";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const { theme, setTheme } = useTheme();

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
      setSigningOut(false);
      return;
    }
    navigate("/");
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully.");
      setPassword("");
      setConfirm("");
    }

    setLoading(false);
  }

  return (
    <>
      <AppNav />
      <div className={styles.page}>
        <h1>Settings</h1>

        <section className={styles.card}>
          <h2>Account</h2>

          <label className={styles.label}>Email</label>

          <input value={user?.email ?? ""} disabled className={styles.input} />

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className={styles.signOutButton}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </section>
        <section className={styles.card}>
          <h2>Appearance</h2>

          <div className={styles.themeOptions}>
            <label
              className={`${styles.themeOption} ${
                theme === "light" ? styles.active : ""
              }`}
            >
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
              />
              <span>☀️ Light</span>
            </label>

            <label
              className={`${styles.themeOption} ${
                theme === "dark" ? styles.active : ""
              }`}
            >
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
              />
              <span>🌙 Dark</span>
            </label>
          </div>
        </section>
        <section className={styles.card}>
          <h2>Security</h2>

          <form onSubmit={handlePasswordUpdate} className={styles.form}>
            <label>New password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            <label className={styles.label}>Confirm password</label>

            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={styles.input}
            />

            <button disabled={loading} className={styles.button}>
              {loading ? "Updating..." : "Save password"}
            </button>

            {message && <p>{message}</p>}
          </form>
        </section>
      </div>
    </>
  );
}
