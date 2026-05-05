import {useMemo, useState } from 'react'
import type { Stand } from '@/entities/stand/model/types'
import styles from './StandForm.module.css'

export type StandFormValues = {
  slug: string
  title: string
  mallName: string
  address: string
  city: string
  description: string
  lat: string
  lng: string
  isActive: boolean
  images: string[]
}

type Props = {
  initialValues?: Stand
  onSubmit: (values: {
    slug: string
    title: string
    mallName: string
    address: string
    city: string
    description: string
    lat: number
    lng: number
    isActive: boolean
    images: string[]
  }) => Promise<void>
  onUpload: (files: FileList) => Promise<string[]>
  submitText: string
}

export const StandForm = ({ initialValues, onSubmit, onUpload, submitText }: Props) => {
  const mapped = useMemo<StandFormValues>(
    () => ({
      slug: initialValues?.slug ?? '',
      title: initialValues?.title ?? '',
      mallName: initialValues?.mallName ?? '',
      address: initialValues?.address ?? '',
      city: initialValues?.city ?? '',
      description: initialValues?.description ?? '',
      lat: initialValues ? String(initialValues.lat) : '',
      lng: initialValues ? String(initialValues.lng) : '',
      isActive: initialValues?.isActive ?? true,
      images: initialValues?.images ?? []
    }),
    [initialValues]
  )

  const [values, setValues] = useState(mapped)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errorText, setErrorText] = useState('')

  const handleChange = (key: keyof StandFormValues, value: string | boolean | string[]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const urls = await onUpload(files)
      handleChange('images', [...values.images, ...urls])
    } catch {
      setErrorText('Не удалось загрузить изображения')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    handleChange(
      'images',
      values.images.filter((_, currentIndex) => currentIndex !== index)
    )
  }

  const handleSubmit:React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setErrorText('')
    setIsSubmitting(true)

    try {
      await onSubmit({
        slug: values.slug,
        title: values.title,
        mallName: values.mallName,
        address: values.address,
        city: values.city,
        description: values.description,
        lat: Number(values.lat),
        lng: Number(values.lng),
        isActive: values.isActive,
        images: values.images
      })
    } catch {
      setErrorText('Не удалось сохранить точку')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="grid2">
        <div className="formRow">
          <label>Slug</label>
          <input
            className="input"
            value={values.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
          />
        </div>

        <div className="formRow">
          <label>Название</label>
          <input
            className="input"
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
      </div>

      <div className="grid2">
        <div className="formRow">
          <label>ТЦ</label>
          <input
            className="input"
            value={values.mallName}
            onChange={(e) => handleChange('mallName', e.target.value)}
          />
        </div>

        <div className="formRow">
          <label>Город</label>
          <input
            className="input"
            value={values.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>
      </div>

      <div className="formRow">
        <label>Адрес</label>
        <input
          className="input"
          value={values.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </div>

      <div className="formRow">
        <label>Описание</label>
        <textarea
          className="textarea"
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="grid2">
        <div className="formRow">
          <label>Широта</label>
          <input
            className="input"
            value={values.lat}
            onChange={(e) => handleChange('lat', e.target.value)}
          />
        </div>

        <div className="formRow">
          <label>Долгота</label>
          <input
            className="input"
            value={values.lng}
            onChange={(e) => handleChange('lng', e.target.value)}
          />
        </div>
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
        />
        Активна
      </label>

      <div className="formRow">
        <label>Загрузка фото</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        {isUploading && <div>Загрузка файлов...</div>}
      </div>

      <div className={styles.images}>
        {values.images.map((image, index) => (
          <div className={styles.imageItem} key={`${image}-${index}`}>
            <img src={image} alt={`uploaded-${index}`} />
            <button
              className="buttonSecondary"
              type="button"
              onClick={() => handleRemoveImage(index)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      {errorText && <div className={styles.error}>{errorText}</div>}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Сохранение...' : submitText}
      </button>
    </form>
  )
}