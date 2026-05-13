const MAILJET_SEND_EMAIL_URL = 'https://api.mailjet.com/v3.1/send'

const escapeHtml = (value) => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export const sendResetPasswordEmail = async ({ to, resetUrl }) => {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY
  const fromEmail = process.env.MAIL_FROM_EMAIL
  const fromName = process.env.MAIL_FROM_NAME || 'Ad Stands'

  if (!apiKey) {
    throw new Error('MAILJET_API_KEY is not configured')
  }

  if (!secretKey) {
    throw new Error('MAILJET_SECRET_KEY is not configured')
  }

  if (!fromEmail) {
    throw new Error('MAIL_FROM_EMAIL is not configured')
  }

  if (!to) {
    throw new Error('Email recipient is required')
  }

  if (!resetUrl) {
    throw new Error('Reset URL is required')
  }

  const authToken = Buffer.from(`${apiKey}:${secretKey}`).toString('base64')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const safeResetUrl = escapeHtml(resetUrl)

    const response = await fetch(MAILJET_SEND_EMAIL_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: 'Восстановление пароля',
            TextPart: `
Восстановление пароля

Вы запросили восстановление пароля для админки сайта.

Ссылка для сброса пароля:
${resetUrl}

Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
            `.trim(),
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
                <h2>Восстановление пароля</h2>

                <p>Вы запросили восстановление пароля для админки сайта.</p>

                <p>
                  <a
                    href="${safeResetUrl}"
                    style="display: inline-block; padding: 10px 16px; background: #111; color: #fff; text-decoration: none; border-radius: 8px;"
                  >
                    Сбросить пароль
                  </a>
                </p>

                <p>Если кнопка не работает, скопируйте ссылку:</p>

                <p>
                  <a href="${safeResetUrl}">${safeResetUrl}</a>
                </p>

                <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
              </div>
            `,
          },
        ],
      }),
    })

    const responseText = await response.text()

    let responseBody = null

    try {
      responseBody = responseText ? JSON.parse(responseText) : null
    } catch {
      responseBody = responseText
    }

    if (!response.ok) {
      console.error('Mailjet email error:', responseBody)

      const message =
        responseBody?.ErrorMessage ||
        responseBody?.Messages?.[0]?.Errors?.[0]?.ErrorMessage ||
        responseBody?.message ||
        'Mailjet email sending failed'

      throw new Error(message)
    }

    return responseBody
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Mailjet request timeout')
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}