import styles from "./Landing.module.css";

const features = [
  {
    icon: "✦",
    title: "Track Daily Habits",
    description:
      "Capture the routines that matter most and keep each one visible in one quiet, focused place.",
  },
  {
    icon: "↗",
    title: "Visualize Your Streaks",
    description:
      "See your momentum at a glance and stay motivated by the progress you are building over time.",
  },
  {
    icon: "◎",
    title: "See Your Progress",
    description:
      "Review your wins, spot patterns, and keep moving forward without guilt or pressure.",
  },
];

function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.sectionHeading}>
        <p className={styles.kicker}>Why Habitat</p>
        <h2>Small steps, steady momentum</h2>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <article key={feature.title} className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;
