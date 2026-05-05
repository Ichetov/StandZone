import express from 'express'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const mapFaq = (faq) => ({
  id: faq.id,
  question: faq.question,
  answer: faq.answer,
  sortOrder: faq.sort_order,
  isActive: Boolean(faq.is_active),
})

router.get('/', async (req, res) => {
  try {
    const { admin } = req.query

    let query = supabase.from('faqs').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true })

    if (admin !== '1') {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query
    if (error) throw error

    res.json((data || []).map(mapFaq))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { question, answer, sortOrder, isActive } = req.body

    if (!question || !answer) {
      return res.status(400).json({ message: '¬опрос и ответ об€зательны' })
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question,
        answer,
        sort_order: Number(sortOrder) || 0,
        is_active: Boolean(isActive),
      })
      .select('*')
      .single()

    if (error) throw error

    res.status(201).json(mapFaq(data))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

const updateFaq = async (req, res) => {
  try {
    const { question, answer, sortOrder, isActive } = req.body

    const { data: current, error: currentError } = await supabase
      .from('faqs')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (currentError || !current) {
      return res.status(404).json({ message: 'FAQ не найден' })
    }

    const { data, error } = await supabase
      .from('faqs')
      .update({
        question,
        answer,
        sort_order: Number(sortOrder) || 0,
        is_active: Boolean(isActive),
      })
      .eq('id', req.params.id)
      .select('*')
      .single()

    if (error) throw error

    res.json(mapFaq(data))
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
}

router.put('/:id', authMiddleware, updateFaq)
router.patch('/:id', authMiddleware, updateFaq)

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: current, error: currentError } = await supabase
      .from('faqs')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (currentError || !current) {
      return res.status(404).json({ message: 'FAQ не найден' })
    }

    const { error } = await supabase.from('faqs').delete().eq('id', req.params.id)
    if (error) throw error

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

export default router
