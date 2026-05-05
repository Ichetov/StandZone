import type { Stand } from '@/entities/stand/model/types'
import styles from './StandCard.module.css'
import { Link } from 'react-router'
import Person from './../../../assets/persons.svg'

type Props = {
  stand: Stand
}

export const StandCard = ({ stand }: Props) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={stand.images[0]}
          alt={stand.title}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{stand.title}</h3>
        <p className={styles.mall}>{stand.mallName}</p>
        <p className={styles.address}>{stand.address}</p>
        <p className={styles.description}>{stand.description}</p>
        <div className={styles.box}><img src={Person} alt="" /> <span className={styles.badge}>Средняя проходимость на локациях до 1000 человек в день</span></div>
       <div className={styles.wrapperBtn}>
        <Link className={`button ${styles.btn}`} to={`/stands/${stand.slug}`}>
          Подробнее
        </Link>
        </div>
      </div>
    </article>
  )
}