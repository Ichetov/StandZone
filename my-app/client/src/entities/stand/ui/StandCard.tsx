import { useCallback, useRef } from 'react'
import type { Stand } from '@/entities/stand/model/types'
import styles from './StandCard.module.css'
import { Link } from 'react-router'
import Person from './../../../assets/persons.svg'
import { useLazyGetStandBySlugQuery } from '@/entities/stand/api/standApi'
import { usePrefetchOnView } from '@/shared/lib/hooks/usePrefetchOnView'

type Props = {
  stand: Stand
}

const preloadImages = (urls: string[]) => {
  urls.forEach((url) => {
    const img = new Image()
    img.src = url
  })
}

export const StandCard = ({ stand }: Props) => {
  const [loadStandDetails] = useLazyGetStandBySlugQuery()
  const hasPrefetched = useRef(false)

  const handlePrefetch = useCallback(async () => {
    if (hasPrefetched.current) return

    hasPrefetched.current = true

    try {
      const standDetails = await loadStandDetails(stand.slug, true).unwrap()
      preloadImages(standDetails.images)
    } catch {
      hasPrefetched.current = false
    }
  }, [loadStandDetails, stand.slug])

  const cardRef = usePrefetchOnView({
    onView: handlePrefetch,
    rootMargin: '300px',
  })

  return (
    <article ref={cardRef} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={stand.images[0]}
          alt={stand.title}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{stand.title}</h3>

        <p className={styles.mall}>{stand.mallName}</p>

        <p className={styles.address}>{stand.address}</p>

        <div className={styles.box}>
          <img src={Person} alt="" aria-hidden="true" />

          <span className={styles.badge}>
            Средняя проходимость на локациях до 1000 человек в день
          </span>
        </div>

        <div className={styles.wrapperBtn}>
          <Link
            className={`button ${styles.btn}`}
            to={`/stands/${stand.slug}`}
            onPointerEnter={handlePrefetch}
            onPointerDown={handlePrefetch}
            onFocus={handlePrefetch}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  )
}