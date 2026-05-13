import {
  buildRequestTelegramMessage,
  sendTelegramMessage,
} from '../services/telegram.js'
import express from 'express'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { standId, clientName, phone, email, message } = req.body

    if (!clientName || !phone || !email) {
      return res.status(400).json({ message: 'Заполните обязательные поля' })
    }

    const { data, error } = await supabase
      .from('requests')
      .insert({
        stand_id: standId || null,
        client_name: clientName,
        phone,
        email,
        message: message || '',
      })
      .select('id')
      .single()

    if (error) throw error

    let stand = null

    if (standId) {
      const { data: standData, error: standError } = await supabase
        .from('stands')
        .select('title, mall_name')
        .eq('id', standId)
        .maybeSingle()

      if (standError) {
        console.error('Failed to load stand for Telegram notification:', standError)
      }

      stand = standData
    }

    try {
      const telegramMessage = buildRequestTelegramMessage({
        id: data.id,
        standTitle: stand?.title,
        mallName: stand?.mall_name,
        clientName,
        phone,
        email,
        message,
      })

      await sendTelegramMessage(telegramMessage)
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError)
    }

    res.status(201).json({ success: true, id: data.id })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { viewed } = req.query
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 100)
    const offset = (page - 1) * limit

    let countQuery = supabase.from('requests').select('*', { count: 'exact', head: true })
    let dataQuery = supabase
      .from('requests')
      .select('id, client_name, phone, email, message, is_viewed, created_at, stands(title, mall_name)')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1)

    if (viewed === '1') {
      countQuery = countQuery.eq('is_viewed', true)
      dataQuery = dataQuery.eq('is_viewed', true)
    }

    if (viewed === '0') {
      countQuery = countQuery.eq('is_viewed', false)
      dataQuery = dataQuery.eq('is_viewed', false)
    }

    const [{ count, error: countError }, { data, error: dataError }] = await Promise.all([
      countQuery,
      dataQuery,
    ])

    if (countError) throw countError
    if (dataError) throw dataError

    res.json({
      data: (data || []).map((request) => ({
        id: request.id,
        clientName: request.client_name,
        phone: request.phone,
        email: request.email,
        message: request.message,
        isViewed: Boolean(request.is_viewed),
        createdAt: request.created_at,
        standTitle: request.stands?.title || null,
        mallName: request.stands?.mall_name || null,
      })),
      meta: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.patch('/:id/viewed', authMiddleware, async (req, res) => {
  try {
    const { data: current, error: currentError } = await supabase
      .from('requests')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (currentError || !current) {
      return res.status(404).json({ message: '������ �� �������' })
    }

    const { error } = await supabase.from('requests').update({ is_viewed: true }).eq('id', req.params.id)
    if (error) throw error

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: current, error: currentError } = await supabase
      .from('requests')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (currentError || !current) {
      return res.status(404).json({ message: '������ �� �������' })
    }

    const { error } = await supabase.from('requests').delete().eq('id', req.params.id)
    if (error) throw error

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

export default router
