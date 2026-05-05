import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div>StandZone</div>
            <div>  Телефон:{' '}
     <a href="tel:+79175391818">
      +79175391818
     </a></div>
          <div> Email:{' '}
  <a href="mailto:9175391818@mail.ru">
    9175391818@mail.ru
  </a></div>
        </div>
      </div>
    </footer>
  )
}
