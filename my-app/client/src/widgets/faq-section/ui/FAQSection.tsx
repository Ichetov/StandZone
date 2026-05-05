import { useState } from 'react'
import { useGetFaqsQuery } from '@/entities/faq/api/faqApi'
import styles from './FAQSection.module.css'

export const FAQSection = () => {
  const { data: faqs = [] } = useGetFaqsQuery()
  const [openId, setOpenId] = useState<number | null>(null)

  if (faqs.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.content}>
      <div className={styles.header}>
        <span className={styles.label}>FAQ</span>
        <h2 className={styles.title}>Частые вопросы</h2>
        <p className={styles.description}>
          Ответы на основные вопросы о размещении рекламы на стойках в торговых центрах.
        </p>
      </div>

      <div className={styles.list}>
        {faqs.map((faq) => {
          const isOpen = openId === faq.id

          return (
            <button
              key={faq.id}
              className={styles.item}
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
            >
              <div className={styles.question}>
                <span>{faq.question}</span>
                <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
              </div>

              {isOpen && (
                <p className={styles.answer}>
                  {faq.answer}
                </p>
              )}
            </button>
          )
        })}
      </div>
      </div>
    </section>
  )
}