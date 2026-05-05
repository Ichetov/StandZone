import { StandForm } from '@/features/stand-form/ui/StandForm'
import {
  useGetAdminStandByIdQuery,
  useUpdateStandMutation,
  useUploadImagesMutation
} from '@/entities/stand/api/standApi'
import { UPLOADS_URL } from '@/shared/config/env'
import { useNavigate, useParams } from 'react-router'

const resolveImageUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return `${UPLOADS_URL}${url}`
}

export const AdminStandEditPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const { data: stand, isLoading } = useGetAdminStandByIdQuery(id)
  const [updateStand] = useUpdateStandMutation()
  const [uploadImages] = useUploadImagesMutation()

  const handleUpload = async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('images', file))

    const result = await uploadImages(formData).unwrap()
    return result.urls.map(resolveImageUrl)
  }

  const handleSubmit = async (values: {
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
  }) => {
    await updateStand({ id, body: values }).unwrap()
    navigate('/admin/stands')
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (!stand) {
    return <div>Точка не найдена</div>
  }

  return (
    <div className="stack24">
      <h1 className="sectionTitle">Редактировать точку</h1>
      <div className="card">
        <StandForm
          initialValues={stand}
          submitText="Сохранить"
          onSubmit={handleSubmit}
          onUpload={handleUpload}
        />
      </div>
    </div>
  )
}
