import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";
import { supabase } from "../../lib/supabaseClient.js";

function AppNav() {
  const location = useLocation();
  const isDashboardActive = location.pathname === "/dashboard";
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className={styles.navShell}>
      <div className={styles.navInner}>
        <Link
          to="/"
          className={`${styles.brand} ${isDashboardActive ? styles.activeBrand : ""}`}
        >
          Habitat
        </Link>

        <nav className={styles.navActions} aria-label="Main navigation">
          {location.pathname !== "/dashboard" && (
            <Link
              to="/dashboard"
              className={`${styles.navLink} ${isDashboardActive ? styles.activeLink : ""}`}
            >
              Dashboard
            </Link>
          )}

          <button
            type="button"
            className={styles.themeButton}
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out-icon lucide-log-out"
            >
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
          </button>

          <Link to="/settings" className={styles.themeButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-settings-icon lucide-settings"
            >
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default AppNav;
