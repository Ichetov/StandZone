import { Link } from 'react-router'
import styles from './NotFoundPage.module.css'

export const NotFoundPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>

        <h1 className={styles.title}>Страница не найдена</h1>

        <p className={styles.description}>
          Возможно, ссылка устарела или вы ввели неверный адрес
        </p>

        <Link to="/" className={styles.button}>
          На главную
        </Link>
      </div>
    </div>
  )
}