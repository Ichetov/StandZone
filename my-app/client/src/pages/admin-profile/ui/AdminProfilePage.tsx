import { useEffect, useState } from 'react'
import { useGetMeQuery, useUpdateMeMutation } from '@/entities/auth/api/authApi'
import { setToken } from '@/shared/lib/auth'
import styles from './AdminProfilePage.module.css'

export const AdminProfilePage = () => {
  const { data: admin, isLoading } = useGetMeQuery()
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation()

  const [login, setLogin] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [successText, setSuccessText] = useState('')
  const [currentValue, setCurrentValue] = useState(false)
  const [newValue, setNewValue] = useState(false)

  useEffect(() => {
    if (admin) {
      setLogin(admin.login)
      setEmail(admin.email)
    }
  }, [admin])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setSuccessText('')

    const result = await updateMe({
      login,
      email,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    }).unwrap()

    setToken(result.token)
    setCurrentPassword('')
    setNewPassword('')
    setSuccessText('Профиль обновлён')
  }

  if (isLoading) return <div>Загрузка...</div>

  return (
    <div className={styles.page}>
      <div>
        <h1 className="sectionTitle">Профиль администратора</h1>
        <p className={styles.subtitle}>
          Здесь можно изменить логин, email и пароль для входа в админку.
        </p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className="formRow">
          <label>Логин</label>
          <input
            className="input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>

        <div className="formRow">
          <label>Email для восстановления пароля</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.passwordField}>
          <label>Текущий пароль</label>
          <input
            className="input"
            type={currentValue ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Нужен только если меняете пароль"
          />
          <button
              type="button"
              className={styles.eye}
              onClick={() => setCurrentValue((prev) => !prev)}
              aria-label={currentValue ? 'Скрыть пароль' : 'Показать пароль'}
            />
        </div>

        <div className={styles.passwordField}>
          <label>Новый пароль</label>
          <input
            className="input"
            type={newValue ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Минимум 8 символов"
          />
             <button
              type="button"
              className={styles.eye}
              onClick={() => setNewValue((prev) => !prev)}
              aria-label={newValue ? 'Скрыть пароль' : 'Показать пароль'}
            />
        </div>

        {successText && <div className={styles.success}>{successText}</div>}

        <button className="button" disabled={isUpdating}>
          {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}