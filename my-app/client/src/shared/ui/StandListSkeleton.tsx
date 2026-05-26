import styles from './StandListSkeleton.module.css'

type StandListSkeletonProps = {
  count?: number
}

export function StandListSkeleton({ count = 3 }: StandListSkeletonProps) {
  return (
    <div
      className={styles.list}
      role="status"
      aria-live="polite"
      aria-label="Загрузка рекламных точек"
    >
      <span className={styles.visuallyHidden}>Загрузка рекламных точек...</span>

      {Array.from({ length: count }).map((_, index) => (
        <article className={styles.card} aria-hidden="true" key={index}>
          <div className={styles.image} />

          <div className={styles.content}>
            <div className={`${styles.skeleton} ${styles.title}`} />
            <div className={`${styles.skeleton} ${styles.mall}`} />
            <div className={`${styles.skeleton} ${styles.address}`} />

            <div className={styles.infoRow}>
              <div className={`${styles.skeleton} ${styles.icon}`} />
              <div className={`${styles.skeleton} ${styles.badge}`} />
            </div>

            <div className={`${styles.skeleton} ${styles.button}`} />
          </div>
        </article>
      ))}
    </div>
  )
}