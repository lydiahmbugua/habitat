import styles from "./Landing.module.css";

function Hero({ onGetStarted }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Build better rituals</p>
        <h1>Build the habits that keep you growing.</h1>
        <p className={styles.subheadline}>
          Habitat helps you stay consistent with small daily actions that
          compound into lasting change.
        </p>
        <button
          type="button"
          className={styles.ctaButton}
          onClick={onGetStarted}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

export default Hero;
