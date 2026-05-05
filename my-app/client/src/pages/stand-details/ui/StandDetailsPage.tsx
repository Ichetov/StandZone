import { useMemo } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { Footer } from '@/widgets/footer/ui/Footer'
import { useGetStandBySlugQuery } from '@/entities/stand/api/standApi'
import { StandGallery } from '@/entities/stand/ui/StandGallery'
import { RequestForm } from '@/features/request-form/ui/RequestForm'
import { useParams } from 'react-router'
import { Loader } from '@/shared/ui/Loader'
import styles from './StandDetailsPage.module.css'


export const StandDetailsPage = () => {
  const { slug = '' } = useParams()
  const { data: stand, isLoading, isError } = useGetStandBySlugQuery(slug)

  const mapSrc = useMemo(() => {
    if (!stand) return ''
    return `https://www.google.com/maps?q=${stand.lat},${stand.lng}&z=16&output=embed`
  }, [stand])

  return (
    <div className="page">
      <Header />

    <main className="pageMain">
  <div className="container">
    {isLoading && <Loader />}

    {isError && (
      <div className={styles.error}>
        Точка не найдена.
      </div>
    )}

    {stand && (
      <div className={styles.page}>
        <div className={styles.hero}>
          <div>
            <span className={styles.label}>Рекламная точка</span>
            <h1 className={styles.title}>{stand.title}</h1>
            <p className={styles.subtitle}>
              Подробная информация о локации, трафике и размещении рекламы
            </p>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.galleryCard}>
            <StandGallery images={stand.images} alt={stand.title} />
          </div>

          <div className={styles.infoColumn}>
            <section className={styles.infoCard}>
              <h2 className={styles.cardTitle}>Информация о точке</h2>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span>ТЦ</span>
                  <strong>{stand.mallName}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Адрес</span>
                  <strong>{stand.address}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Город</span>
                  <strong>{stand.city}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Описание</span>
                  <p>{stand.description}</p>
                </div>
              </div>
            </section>

            <section className={styles.mapCard}>
              <h2 className={styles.cardTitle}>Локация на карте</h2>

              <iframe
                className={styles.map}
                title="map"
                src={mapSrc}
                width="100%"
                height="320"
                loading="lazy"
              />
            </section>
          </div>
        </div>

        <section className={styles.requestCard}>
          <div className={styles.requestHeader}>
            <div>
              <span className={styles.label}>Заявка</span>
              <h2 className={styles.requestTitle}>Оставить заявку</h2>
              <p className={styles.requestText}>
                Заполните форму, и мы свяжемся с вами для уточнения деталей размещения.
              </p>
            </div>
          </div>

          <RequestForm standId={stand.id} />
        </section>
      </div>
    )}
  </div>
</main>

      <Footer />
    </div>
  )
}