import styles from "./Landing.module.css";

const steps = ["Add a habit", "Check in daily", "Watch your streak grow"];

function HowItWorks() {
  return (
    <section className={styles.stepsSection}>
      <div className={styles.sectionHeading}>
        <p className={styles.kicker}>How it works</p>
        <h2>Keep it simple and consistent</h2>
      </div>

      <div className={styles.stepsRow}>
        {steps.map((step, index) => (
          <div key={step} className={styles.stepItem}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
