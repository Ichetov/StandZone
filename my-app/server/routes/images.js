import express from 'express'

const router = express.Router()

const supabaseUrl = process.env.SUPABASE_URL

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is required')
}

const ALLOWED_SUPABASE_HOST = new URL(supabaseUrl).hostname

router.get('/proxy', async (req, res) => {
  try {
    const imageUrl = req.query.url

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ message: 'Image url is required' })
    }

    const parsedUrl = new URL(imageUrl)

    if (parsedUrl.hostname !== ALLOWED_SUPABASE_HOST) {
      return res.status(400).json({ message: 'Invalid image host' })
    }

    if (!parsedUrl.pathname.startsWith('/storage/v1/object/public/stand-images/')) {
      return res.status(400).json({ message: 'Invalid image path' })
    }

    const imageResponse = await fetch(imageUrl)

    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({
        message: 'Failed to load image',
      })
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await imageResponse.arrayBuffer()

    res.setHeader('Content-Type', contentType)
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=604800'
    )

    return res.send(Buffer.from(arrayBuffer))
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Image proxy error',
    })
  }
})

export default router