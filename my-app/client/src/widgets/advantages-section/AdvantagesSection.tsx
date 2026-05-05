import { Link } from 'react-router'
import styles from './AdvantagesSection.module.css'

export const AdvantagesSection = () => {
  return (
    <section className={styles.advantages}>
      <div className={styles.content}>
        <div className={styles.text}>
          <span className={styles.label}>Преимущества рекламы</span>

          <h2 className={styles.title}>
            Рекламные стойки в ТЦ помогают быть ближе к покупателю
          </h2>

          <p className={styles.description}>
            Торговые центры — это места с высоким потоком людей, где посетители
            уже настроены на покупки. Реклама на стойках помогает быстро привлечь
            внимание и повысить узнаваемость бренда.
          </p>

          <div className={styles.grid}>
            <div className={styles.item}>
              <strong>Высокий трафик</strong>
              <span>Ежедневный контакт с большим количеством посетителей</span>
            </div>

            <div className={styles.item}>
              <strong>Точное место</strong>
              <span>Размещение рядом с магазинами, входами и зонами ожидания</span>
            </div>

            <div className={styles.item}>
              <strong>Визуальный эффект</strong>
              <span>Яркий формат лучше запоминается и выделяется в потоке</span>
            </div>

            <div className={styles.item}>
              <strong>Быстрый запуск</strong>
              <span>Можно быстро подобрать точку и отправить заявку</span>
            </div>
          </div>
        <Link to="/request" className={`button ${styles.cta}`}>
  Разместить рекламу
</Link>
        </div>

   <div className={styles.imageWrap}>
  <img
    className={styles.image}
    src="./src/assets/car.png"
    alt="Рекламная стойка в торговом центре"
  />
</div>
      </div>
    </section>
  )
}