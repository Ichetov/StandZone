export type Stand = {
  id: number
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
}

export type StandsResponse = {
  data: Stand[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type StandPayload = {
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
}

export type MallOption = {
  mallName: string
}