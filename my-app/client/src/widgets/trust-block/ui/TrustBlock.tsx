import styles from './TrustBlock.module.css'

const trustItems = [
  {
    title: 'Подбор подходящей точки',
    text: 'Можно выбрать торговый центр по городу, адресу и расположению стойки.',
  },
  {
    title: 'Фото каждой локации',
    text: 'Перед заявкой видно, как выглядит место размещения и где находится стойка.',
  },
  {
    title: 'Быстрая заявка',
    text: 'Достаточно выбрать точку и отправить заявку — без лишних действий.',
  },
  {
    title: 'Помощь с размещением',
    text: 'Поможем подобрать локацию под задачу, бюджет и нужную аудиторию.',
  },
]

export const TrustBlock = () => {
  return (
    <section className={styles.section} aria-labelledby="trust-title">
      <div className={styles.header}>
      <span className={styles.label}>Сервис</span>

<h2 className={styles.title}>
  Почему с нами удобно
</h2>

<p className={styles.description}>
  Все локации собраны в одном месте: можно посмотреть фото, адрес и быстро отправить заявку.
</p>
      </div>

      <div className={styles.grid}>
        {trustItems.map((item) => (
          <article className={styles.card} key={item.title}>
            <span className={styles.icon} aria-hidden="true" />

            <div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}