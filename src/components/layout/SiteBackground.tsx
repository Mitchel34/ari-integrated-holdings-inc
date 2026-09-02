import styles from './SiteBackground.module.css';

/**
 * Fixed page ambiance: a fine engineering grid that fades below the fold and
 * two soft brand-colored orbs. Pure CSS, aria-hidden, no JavaScript.
 */
export function SiteBackground() {
    return (
        <div className={styles.root} aria-hidden="true">
            <div className={styles.grid} />
            <div className={`${styles.orb} ${styles.orbGold}`} />
            <div className={`${styles.orb} ${styles.orbSilver}`} />
            <div className={styles.vignette} />
        </div>
    );
}
