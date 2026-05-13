import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import { useResetPasswordMutation } from '@/entities/auth/api/authApi'
import styles from './ResetPasswordPage.module.css'

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorText, setErrorText] = useState('')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setErrorText('')

    if (password.length < 8) {
      setErrorText('Пароль должен быть не менее 8 символов')
      return
    }

    if (password !== confirmPassword) {
      setErrorText('Пароли не совпадают')
      return
    }

    try {
      await resetPassword({ token, password }).unwrap()
      setIsSuccess(true)
      toast.success('Пароль успешно обновлен')
    } catch (error) {
      const fallbackMessage = 'Не удалось сбросить пароль'
      const message =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof error.data === 'object' &&
        error.data !== null &&
        'message' in error.data &&
        typeof error.data.message === 'string'
          ? error.data.message
          : fallbackMessage

      setErrorText(message)
      toast.error(message)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.wrap}>
        <div className={`card ${styles.card}`}>
          <h1 className="sectionTitle">Сброс пароля</h1>

          {isSuccess ? (
            <div className={styles.successBlock}>
              <p className={styles.successText}>
                Новый пароль сохранен. Теперь войдите в админ-панель.
              </p>
              <Link to="/admin/login" className={`button ${styles.loginLink}`}>
                Перейти ко входу
              </Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <p className={styles.hint}>
                Придумайте новый пароль для аккаунта администратора.
              </p>

              <label className="formRow">
                <span>Новый пароль</span>
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 8 символов"
                />
              </label>

              <label className="formRow">
                <span>Повторите пароль</span>
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Введите пароль еще раз"
                />
              </label>

              {errorText && <p className={styles.error}>{errorText}</p>}

              <button type="submit" className={`button ${styles.submit}`} disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить новый пароль'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
