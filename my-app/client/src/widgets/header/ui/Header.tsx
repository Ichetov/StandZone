import { Link, NavLink } from 'react-router'
import styles from './Header.module.css'
import { useState } from 'react'

export const Header = () => {
  const [open, setOpen] = useState(false)
  const handleLinkClick = () => setOpen(false)
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            StandZone
          </Link>
          <nav className={`${styles.nav} ${open ? styles.open : ""}`}>
          <NavLink onClick={handleLinkClick} to="/">Главная</NavLink>
           <NavLink onClick={handleLinkClick} to="/request">Отправить запрос</NavLink>
          </nav>
           <button
            className={`${styles.burger} ${open ? styles.active : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
