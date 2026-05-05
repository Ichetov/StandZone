import { useDeleteStandMutation, useGetStandsQuery } from '@/entities/stand/api/standApi'
import { Link } from 'react-router'
import styles from './AdminStandsPage.module.css'

export const AdminStandsPage = () => {
  const { data, isLoading } = useGetStandsQuery({ admin: true })
  const [deleteStand] = useDeleteStandMutation()

  const stands = data?.data ?? []
  

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Удалить точку?')
    if (!confirmed) return

    await deleteStand(String(id)).unwrap()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className="sectionTitle">Точки</h1>
          <p className={styles.subtitle}>Управление рекламными точками</p>
        </div>

        <Link className="button" to="/admin/stands/new">
          Добавить точку
        </Link>
      </div>

      {isLoading && <div className={styles.loading}>Загрузка...</div>}

      {!isLoading && (
        <div className={styles.card}>
          {stands.length === 0 ? (
            <div className={styles.empty}>Точек пока нет</div>
          ) : (
            <div className={styles.list}>
              {stands.map((stand) => (
                <div key={stand.id} className={styles.item}>
                  <div className={styles.info}>
                    <div className={styles.title}>{stand.title}</div>
                    <div className={styles.mall}>{stand.mallName}</div>

                    <span
                      className={
                        stand.isActive
                          ? `${styles.status} ${styles.active}`
                          : `${styles.status} ${styles.hidden}`
                      }
                    >
                      {stand.isActive ? 'Активна' : 'Скрыта'}
                    </span>
                  </div>

                  <div className={styles.actions}>
                    <Link
                      className={styles.edit}
                      to={`/admin/stands/${stand.id}/edit`}
                    >
                      Редактировать
                    </Link>

                    <button
                      className={styles.delete}
                      type="button"
                      onClick={() => handleDelete(stand.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}