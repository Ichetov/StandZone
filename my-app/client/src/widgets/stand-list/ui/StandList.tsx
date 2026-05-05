import type { Stand } from '@/entities/stand/model/types'
import { StandCard } from '@/entities/stand/ui/StandCard'
import styles from './StandList.module.css'
import { Pagination } from '@/shared/ui/Pagination'

type Props = {
  stands: Stand[]
  page: number
  setPage: (value: number | ((prev: number) => number)) => void
  totalPages: number
}

export const StandList = ({ stands, page, setPage, totalPages }: Props) => {
  if (stands.length === 0) {
    return <div>Точки не найдены.</div>
  }
 

  return (
    <div className={styles.list}>
      {stands.map((stand) => (
          <StandCard key={stand.id} stand={stand} />
      ))}
        <Pagination page={page} setPage = {setPage} totalPages = {totalPages}/>
    </div>
  )
}