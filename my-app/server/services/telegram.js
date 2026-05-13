const escapeHtml = (value = '') => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export const buildRequestTelegramMessage = ({
  id,
  standTitle,
  mallName,
  clientName,
  phone,
  email,
  message,
}) => {
  const standLine = standTitle
    ? `\n📍 <b>Точка:</b> ${escapeHtml(standTitle)}`
    : ''

  const mallLine = mallName
    ? `\n🏬 <b>ТЦ:</b> ${escapeHtml(mallName)}`
    : ''

  const messageLine = message
    ? `\n💬 <b>Сообщение:</b> ${escapeHtml(message)}`
    : ''

  return `
🆕 <b>Новая заявка #${id}</b>${standLine}${mallLine}

👤 <b>Имя:</b> ${escapeHtml(clientName)}
📞 <b>Телефон:</b> ${escapeHtml(phone)}
✉️ <b>Email:</b> ${escapeHtml(email)}${messageLine}
`.trim()
}

export const sendTelegramMessage = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing')
    return
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      throw new Error(`Telegram sendMessage failed: ${details}`)
    }
  } finally {
    clearTimeout(timeoutId)
  }
}