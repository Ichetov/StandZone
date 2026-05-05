import {
  useDeleteRequestMutation,
  useGetRequestsQuery,
  useMarkRequestViewedMutation,
} from '@/entities/request/api/requestApi'
import { Loader } from '@/shared/ui/Loader'
import styles from './AdminRequestsPage.module.css'
import { useState } from 'react'
import { ConfirmModal } from '@/shared/ui/ConfirmModal'
import { Pagination } from '@/shared/ui/Pagination'
import toast from 'react-hot-toast'

export const AdminRequestsPage = () => {
  const [markViewed] = useMarkRequestViewedMutation()
  const [deleteRequest] = useDeleteRequestMutation()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'new' | 'viewed'>('all')
const limit = 5

const { data, isLoading } = useGetRequestsQuery({
  page,
  limit,
  viewed: filter,
})


const requests = data?.data ?? []
const meta = data?.meta

   const [open, setOpen] = useState(false)

 
  if (isLoading) return <Loader />

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className="sectionTitle">Заявки</h1>
          <p className={styles.subtitle}>Заявки от клиентов на размещение рекламы</p>
        </div>

        <div className={styles.counter}>
          Всего: {requests.length}
        </div>
      </div>
<div className={styles.filters}>
  <button
    className={filter === 'all' ? styles.filterActive : styles.filterButton}
    onClick={() => {
      setFilter('all')
      setPage(1)
    }}
  >
    Все
  </button>

  <button
    className={filter === 'new' ? styles.filterActive : styles.filterButton}
    onClick={() => {
      setFilter('new')
      setPage(1)
    }}
  >
    Новые
  </button>

  <button
    className={filter === 'viewed' ? styles.filterActive : styles.filterButton}
    onClick={() => {
      setFilter('viewed')
      setPage(1)
    }}
  >
    Просмотренные
  </button>
</div>
      <div className={styles.list}>
        {requests.length === 0 ? (
          <div className={styles.empty}>Заявок пока нет</div>
        ) : (
          requests.map((request) => (
            <article
              key={request.id}
              className={
                request.isViewed
                  ? `${styles.card} ${styles.viewed}`
                  : styles.card
              }
            >
              <div className={styles.top}>
                <div>
                  <h2 className={styles.name}>{request.clientName}</h2>

                  <span
                    className={
                      request.isViewed
                        ? `${styles.status} ${styles.statusViewed}`
                        : `${styles.status} ${styles.statusNew}`
                    }
                  >
                    {request.isViewed ? 'Просмотрено' : 'Новая'}
                  </span>
                </div>

                <time className={styles.date}>{request.createdAt}</time>
              </div>

              <div className={styles.info}>
                <div>
                  <span>Телефон</span>
                  <a href={`tel:${request.phone}`}>{request.phone}</a>
                </div>

                <div>
                  <span>Email</span>
                  <a href={`mailto:${request.email}`}>{request.email}</a>
                </div>

                <div>
                  <span>Точка</span>
                  <strong>
                    {request.standTitle
                      ? `${request.standTitle} / ${request.mallName}`
                      : 'Не выбрана'}
                  </strong>
                </div>
              </div>

              <div className={styles.message}>
                <span>Сообщение</span>
                <p>{request.message || 'Нет сообщения'}</p>
              </div>

              <div className={styles.actions}>
                {!request.isViewed && (
                  <button
                    className={styles.viewButton}
                    type="button"
                    onClick={() => markViewed(request.id)}
                  >
                    Отметить просмотренной
                  </button>
                )}

            <button
  className={styles.deleteButton}
  onClick={() => {
    setSelectedId(request.id)
    setOpen(true)
  }}
>
  Удалить
</button>
          </div>
            </article>
          ))
        )}
      </div>
   {meta && meta.totalPages > 1 && (
  <Pagination
    page={page}
    setPage={setPage}
    totalPages={meta.totalPages}
  />
)}

<ConfirmModal
  open={open}
  onOpenChange={setOpen}
  title="Удалить заявку"
  description="Это действие нельзя отменить"
  onConfirm={() => {
    if (selectedId) {
      deleteRequest(selectedId).unwrap()
      toast.success('Зааявка удалена успешно')
    }
  }}
/>
    </div>
  )
}