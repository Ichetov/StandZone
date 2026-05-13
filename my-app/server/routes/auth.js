import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { supabase } from '../supabase/client.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      login: admin.login,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const createResetToken = () => crypto.randomBytes(32).toString('hex')

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body

    if (!login || !password) {
      return res.status(400).json({ message: 'Логин и пароль обязательны' })
    }

    const { data: admin, error } = await supabase.from('admins').select('*').eq('login', login).single()

    if (error || !admin) {
      return res.status(401).json({ message: 'Неверный логин или пароль' })
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Неверный логин или пароль' })
    }

    const token = createToken(admin)

    res.json({
      token,
      admin: {
        id: admin.id,
        login: admin.login,
        email: admin.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, login, email')
      .eq('id', req.user.id)
      .single()

    if (error || !admin) {
      return res.status(404).json({ message: 'Администратор не найден' })
    }

    res.json(admin)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { login, email, currentPassword, newPassword } = req.body

    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', req.user.id)
      .single()

    if (adminError || !admin) {
      return res.status(404).json({ message: 'Администратор не найден' })
    }

    if (!login || !email) {
      return res.status(400).json({ message: 'Логин и email обязательны' })
    }

    const { data: loginDup } = await supabase
      .from('admins')
      .select('id')
      .eq('login', login)
      .neq('id', admin.id)
      .maybeSingle()

    if (loginDup) {
      return res.status(400).json({ message: 'Пользователь с таким логином уже существует' })
    }

    const { data: emailDup } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .neq('id', admin.id)
      .maybeSingle()

    if (emailDup) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' })
    }

    let passwordHash = admin.password_hash

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Укажите текущий пароль' })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash)

      if (!isValidPassword) {
        return res.status(400).json({ message: 'Неверный текущий пароль' })
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Новый пароль должен быть не менее 8 символов' })
      }

      passwordHash = await bcrypt.hash(newPassword, 10)
    }

    const { data: updatedAdmin, error: updateError } = await supabase
      .from('admins')
      .update({ login, email, password_hash: passwordHash })
      .eq('id', admin.id)
      .select('id, login, email')
      .single()

    if (updateError) throw updateError

    const token = createToken(updatedAdmin)

    res.json({
      token,
      admin: updatedAdmin,
    })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен' })
    }

    const { data: admin } = await supabase.from('admins').select('*').eq('email', email).maybeSingle()

    if (!admin) {
      return res.json({ success: true })
    }

    const resetToken = createResetToken()
    const resetTokenHash = hashToken(resetToken)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString()

    const { error: updateError } = await supabase
      .from('admins')
      .update({
        reset_token_hash: resetTokenHash,
        reset_token_expires_at: expiresAt,
      })
      .eq('id', admin.id)

    if (updateError) throw updateError

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: admin.email,
      subject: 'Сброс пароля',
      html: `
        <h2>Сброс пароля</h2>
        <p>Нажмите на ссылку ниже, чтобы задать новый пароль:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ссылка действительна 15 минут.</p>
      `,
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: 'Токен и новый пароль обязательны' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Новый пароль должен быть не менее 8 символов' })
    }

    const tokenHash = hashToken(token)

    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('reset_token_hash', tokenHash)
      .maybeSingle()

    if (!admin) {
      return res.status(400).json({ message: 'Недействительный или устаревший токен' })
    }

    const isExpired = new Date(admin.reset_token_expires_at).getTime() < Date.now()

    if (isExpired) {
      return res.status(400).json({ message: 'Срок действия токена истек' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const { error } = await supabase
      .from('admins')
      .update({
        password_hash: passwordHash,
        reset_token_hash: null,
        reset_token_expires_at: null,
      })
      .eq('id', admin.id)

    if (error) throw error

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' })
  }
})

export default router
