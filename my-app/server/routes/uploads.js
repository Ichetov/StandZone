import express from 'express'
import crypto from 'crypto'
import { upload } from '../middleware/upload.js'
import { authMiddleware } from '../middleware/auth.js'
import { supabase } from '../supabase/client.js'

const router = express.Router()

router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files || []
    const bucket = process.env.SUPABASE_STORAGE_BUCKET

    if (!bucket) {
      return res.status(500).json({ message: 'SUPABASE_STORAGE_BUCKET is required' })
    }

    const urls = []

    for (const file of files) {
      const ext = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'bin'
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
      const filePath = `stands/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath)
      urls.push(publicData.publicUrl)
    }

    res.json({ urls })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

export default router
