import { useState } from 'react'
import styles from './StandGallery.module.css'

type Props = {
  images: string[]
  alt: string
}

export const StandGallery = ({ images, alt }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const hasMany = images.length > 1

  const prev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const next = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <img className={styles.image} src={images[activeIndex]} alt={alt} />

        {hasMany && (
          <>
            <button className={styles.arrowLeft} type="button" onClick={prev}>
              ←
            </button>
            <button className={styles.arrowRight} type="button" onClick={next}>
              →
            </button>
          </>
        )}
      </div>

      {hasMany && (
        <div className={styles.thumbs}>
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={index === activeIndex ? styles.thumbActive : styles.thumb}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image} alt={`${alt} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}