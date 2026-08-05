import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/useTheme";

function LandingNav({ onLogin, onGetStarted }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.navShell}>
      <div className={styles.navInner}>
        <Link to="/" className={styles.brand}>
          Habitat
        </Link>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onLogin}
          >
            Log In
          </button>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={onGetStarted}
          >
            Get Started
          </button>
          <button
            type="button"
            className={styles.themeButton}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default LandingNav;
