import Hero from "./Hero.jsx";
import Features from "./Features.jsx";
import HowItWorks from "./HowItWorks.jsx";
import styles from "./Landing.module.css";

function Landing() {
  return (
    <main className={styles.page}>
      <Hero />
      <Features />
      <HowItWorks />

      <footer className={styles.footer}>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span>Build calm momentum, one habit at a time.</span>
      </footer>
    </main>
  );
}

export default Landing;
