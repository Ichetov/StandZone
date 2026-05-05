import { useState } from 'react'
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
  type FAQ,
} from '@/entities/faq/api/faqApi'
import styles from './AdminFAQPage.module.css'

const initialForm = {
  question: '',
  answer: '',
  sortOrder: 0,
  isActive: true,
}

export const AdminFAQPage = () => {
  const { data: faqs = [], isLoading } = useGetFaqsQuery({ admin: true })
  const [createFaq] = useCreateFaqMutation()
  const [updateFaq] = useUpdateFaqMutation()
  const [deleteFaq] = useDeleteFaqMutation()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(initialForm)

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id)
    setForm({
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder,
      isActive: faq.isActive,
    })
  }

  const handleReset = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (editingId) {
      await updateFaq({ id: editingId, body: form }).unwrap()
    } else {
      await createFaq(form).unwrap()
    }

    handleReset()
  }

  return (
    <div className={styles.page}>
      <div>
        <h1 className="sectionTitle">FAQ</h1>
        <p className={styles.subtitle}>Управление вопросами на главной странице</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Вопрос"
          value={form.question}
          onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
        />

        <textarea
          className="textarea"
          placeholder="Ответ"
          value={form.answer}
          onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
        />

        <div className={styles.row}>
          <input
            className="input"
            type="number"
            placeholder="Порядок"
            value={form.sortOrder}
            onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
          />

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Показывать на сайте
          </label>
        </div>

        <div className={styles.actions}>
          <button className="button" type="submit">
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>

          {editingId && (
            <button className={styles.cancel} type="button" onClick={handleReset}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.empty}>Загрузка...</div>
        ) : faqs.length === 0 ? (
          <div className={styles.empty}>FAQ пока нет</div>
        ) : (
          faqs.map((faq) => (
            <article key={faq.id} className={styles.card}>
              <div>
                <h3 className={styles.question}>{faq.question}</h3>
                <p className={styles.answer}>{faq.answer}</p>

                <div className={styles.meta}>
                  <span>Порядок: {faq.sortOrder}</span>
                  <span>{faq.isActive ? 'Показывается' : 'Скрыт'}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.edit} type="button" onClick={() => handleEdit(faq)}>
                  Редактировать
                </button>

                <button className={styles.delete} type="button" onClick={() => deleteFaq(faq.id)}>
                  Удалить
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}