import { useState } from 'react'
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from '@/entities/auth/api/authApi'
import { setToken } from '@/shared/lib/auth'
import styles from './LoginForm.module.css'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

export const LoginForm = () => {
  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [errorText, setErrorText] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const [loginRequest, { isLoading }] = useLoginMutation()
  const [forgotPassword, { isLoading: isSendingReset }] =
    useForgotPasswordMutation()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setErrorText('')

    try {
      const result = await loginRequest({ login, password }).unwrap()
      setToken(result.token)
      navigate('/admin/stands')
    } catch {
      setErrorText('Неверный логин или пароль')
    }
  }

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast.error('Введите email')
      return
    }

    try {
      await forgotPassword({ email }).unwrap()
      toast.success('Если email найден, ссылка для восстановления отправлена')
      setEmail('')
      setIsResetModalOpen(false)
    } catch {
      toast.error('Не удалось отправить письмо')
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="formRow">
          <label htmlFor="login">Логин</label>
          <input
            id="login"
            className="input"
            type="text"
            value={login}
            autoComplete="username"
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>

        <div className="formRow">
          <label htmlFor="password">Пароль</label>

          <div className={styles.passwordField}>
            <input
              id="password"
              className={`input ${styles.passwordInput}`}
              type={showPassword ? 'text' : 'password'}
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            />
          </div>

          <button
            type="button"
            className={styles.forgot}
            onClick={() => setIsResetModalOpen(true)}
          >
            Забыли пароль?
          </button>
        </div>

        {errorText && <div className={styles.error}>{errorText}</div>}

        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      {isResetModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Восстановление пароля</h2>

            <p className={styles.modalText}>
              Введите email администратора. Мы отправим ссылку для создания
              нового пароля.
            </p>

            <input
              className="input"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />

            <div className={styles.modalActions}>
              <button
                type="button"
                className="button"
                disabled={isSendingReset}
                onClick={handleResetPassword}
              >
                {isSendingReset ? 'Отправка...' : 'Отправить'}
              </button>

              <button
                type="button"
                className={styles.cancel}
                onClick={() => setIsResetModalOpen(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}