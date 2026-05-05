
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import styles from './StandFilters.module.css';
import SelectIcon from './../../../assets/IconArrow.svg'

type Props = {
  mall: string
  search: string
  malls: string[]
  onMallChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export const StandFilters = ({
  mall,
  search,
  malls,
  onMallChange,
  onSearchChange
}: Props) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  console.log(open)

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      console.log('mouse')
      setOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [])

  return (
    <div className={styles.filters}>
      <input
        className={`input ${styles.input}`}
        type="text"
        placeholder="Поиск по названию или ТЦ"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
      />


<div ref={dropdownRef} className={styles.selectWrapper}>
  <div className={`${styles.selectBox} ${open ? styles.open : ''}`}>
    <div
      className={styles.trigger}
      onClick={() => setOpen((prev) => !prev)}
    >
      <span>{mall || 'Все ТЦ'}</span>
      <img src={SelectIcon} alt="" className={open ? styles.img : ''} />
    </div>

    {open && (
      <div className={styles.dropdown}>
        <div
          className={styles.option}
          onClick={() => {
            setOpen(false)
            onMallChange('')
          }}
        >
          Все ТЦ
        </div>

        {malls.map((mallName) => (
          <div
            className={styles.option}
            key={mallName}
            onClick={() => {
              setOpen(false)
              onMallChange(mallName)
            }}
          >
            {mallName}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
    </div>
  )
}