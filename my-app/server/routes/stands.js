import express from 'express'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// const mapStand = (stand, images = []) => ({
//   id: stand.id,
//   slug: stand.slug,
//   title: stand.title,
//   mallName: stand.mall_name,
//   address: stand.address,
//   city: stand.city,
//   description: stand.description,
//   lat: stand.lat,
//   lng: stand.lng,
//   isActive: Boolean(stand.is_active),
//   images: images.map((img) => img.image_url),
// })


const API_URL = process.env.API_URL?.replace(/\/$/, '')

const toPublicImageUrl = (imageUrl) => {
  if (!API_URL) return imageUrl

  return `${API_URL}/images/proxy?url=${encodeURIComponent(imageUrl)}`
}

const mapStand = (stand, images = [], options = {}) => {
  const { proxyImages = false } = options

  return {
    id: stand.id,
    slug: stand.slug,
    title: stand.title,
    mallName: stand.mall_name,
    address: stand.address,
    city: stand.city,
    description: stand.description,
    lat: stand.lat,
    lng: stand.lng,
    isActive: Boolean(stand.is_active),
    images: images.map((img) =>
      proxyImages ? toPublicImageUrl(img.image_url) : img.image_url
    ),
  }
}



const loadImagesByStandIds = async (standIds) => {
  if (standIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('stand_images')
    .select('stand_id, image_url, sort_order, id')
    .in('stand_id', standIds)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw error

  const grouped = new Map()
  for (const row of data) {
    const current = grouped.get(row.stand_id) || []
    current.push(row)
    grouped.set(row.stand_id, current)
  }

  return grouped
}

router.get('/', async (req, res) => {
  try {
    const { mall, search, admin } = req.query
    const isAdmin = admin === '1'

    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 3, 1), 100)
    const offset = (page - 1) * limit

    let countQuery = supabase.from('stands').select('*', { count: 'exact', head: true })
    let dataQuery = supabase.from('stands').select('*').order('id', { ascending: false })

    if (!isAdmin) {
      countQuery = countQuery.eq('is_active', true)
      dataQuery = dataQuery.eq('is_active', true)
    }

    if (mall) {
      countQuery = countQuery.eq('mall_name', mall)
      dataQuery = dataQuery.eq('mall_name', mall)
    }

    if (search) {
      const pattern = `%${search}%`
      countQuery = countQuery.or(`title.ilike.${pattern},mall_name.ilike.${pattern}`)
      dataQuery = dataQuery.or(`title.ilike.${pattern},mall_name.ilike.${pattern}`)
    }

    if (!isAdmin) {
      dataQuery = dataQuery.range(offset, offset + limit - 1)
    }

    const [{ count, error: countError }, { data: stands, error: standsError }] = await Promise.all([
      countQuery,
      dataQuery,
    ])

    if (countError) throw countError
    if (standsError) throw standsError

    const total = count || 0
    const imageMap = await loadImagesByStandIds((stands || []).map((stand) => stand.id))
    // const data = (stands || []).map((stand) => mapStand(stand, imageMap.get(stand.id) || []))
    const data = (stands || []).map((stand) =>
  mapStand(stand, imageMap.get(stand.id) || [], { proxyImages: true })
)

    res.json({
      data,
      meta: {
        total,
        page,
        limit: isAdmin ? total : limit,
        totalPages: isAdmin ? 1 : Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.get('/malls', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('stands')
      .select('mall_name')
      .order('mall_name', { ascending: true })

    if (error) throw error

    const unique = [...new Set((data || []).map((row) => row.mall_name))]
    res.json(unique.map((mallName) => ({ mallName })))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.get('/admin/by-id/:id', authMiddleware, async (req, res) => {
  try {
    const { data: stand, error } = await supabase.from('stands').select('*').eq('id', req.params.id).single()

    if (error || !stand) {
      return res.status(404).json({ message: 'Точка не найдена' })
    }

    const { data: images, error: imagesError } = await supabase
      .from('stand_images')
      .select('image_url, sort_order, id')
      .eq('stand_id', stand.id)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })

    if (imagesError) throw imagesError

    res.json(mapStand(stand, images || []))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const { data: stand, error } = await supabase
      .from('stands')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single()

    if (error || !stand) {
      return res.status(404).json({ message: 'Точка не найдена' })
    }

    const { data: images, error: imagesError } = await supabase
      .from('stand_images')
      .select('image_url, sort_order, id')
      .eq('stand_id', stand.id)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })

    if (imagesError) throw imagesError

    // res.json(mapStand(stand, images || []))
    res.json(mapStand(stand, images || [], { proxyImages: true }))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { slug, title, mallName, address, city, description, lat, lng, isActive, images } = req.body

    if (!slug || !title || !mallName || !address || !city || !description) {
      return res.status(400).json({ message: 'Не все обязательные поля заполнены' })
    }

    const { data: created, error } = await supabase
      .from('stands')
      .insert({
        slug,
        title,
        mall_name: mallName,
        address,
        city,
        description,
        lat: Number(lat),
        lng: Number(lng),
        is_active: Boolean(isActive),
      })
      .select('*')
      .single()

    if (error) throw error

    if ((images || []).length > 0) {
      const rows = images.map((imageUrl, index) => ({
        stand_id: created.id,
        image_url: imageUrl,
        sort_order: index,
      }))

      const { error: imagesError } = await supabase.from('stand_images').insert(rows)
      if (imagesError) throw imagesError
    }

    const { data: createdImages, error: createdImagesError } = await supabase
      .from('stand_images')
      .select('image_url, sort_order, id')
      .eq('stand_id', created.id)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })

    if (createdImagesError) throw createdImagesError

    res.status(201).json(mapStand(created, createdImages || []))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

const updateStand = async (req, res) => {
  try {
    const { slug, title, mallName, address, city, description, lat, lng, isActive, images } = req.body

    const { data: current, error: currentError } = await supabase
      .from('stands')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (currentError || !current) {
      return res.status(404).json({ message: 'Точка не найдена' })
    }

    const { data: updated, error: updateError } = await supabase
      .from('stands')
      .update({
        slug,
        title,
        mall_name: mallName,
        address,
        city,
        description,
        lat: Number(lat),
        lng: Number(lng),
        is_active: Boolean(isActive),
      })
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (updateError) throw updateError

    const { error: deleteImagesError } = await supabase.from('stand_images').delete().eq('stand_id', req.params.id)

    if (deleteImagesError) throw deleteImagesError

    if ((images || []).length > 0) {
      const rows = images.map((imageUrl, index) => ({
        stand_id: Number(req.params.id),
        image_url: imageUrl,
        sort_order: index,
      }))
      const { error: insertImagesError } = await supabase.from('stand_images').insert(rows)
      if (insertImagesError) throw insertImagesError
    }

    const { data: updatedImages, error: updatedImagesError } = await supabase
      .from('stand_images')
      .select('image_url, sort_order, id')
      .eq('stand_id', req.params.id)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })

    if (updatedImagesError) throw updatedImagesError

    res.json(mapStand(updated, updatedImages || []))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
}

router.put('/:id', authMiddleware, updateStand)
router.patch('/:id', authMiddleware, updateStand)

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: current, error: currentError } = await supabase
      .from('stands')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (currentError || !current) {
      return res.status(404).json({ message: 'Точка не найдена' })
    }

    await supabase.from('stand_images').delete().eq('stand_id', req.params.id)
    const { error: deleteError } = await supabase.from('stands').delete().eq('id', req.params.id)
    if (deleteError) throw deleteError

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

export default router
