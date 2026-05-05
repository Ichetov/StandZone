import * as Progress from '@radix-ui/react-progress'
import { useCreateRequestMutation } from '@/entities/request/api/requestApi'
import styles from './RequestForm.module.css'
import { useForm, type SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'

type Props = {
  standId?: number
}

type Inputs = {
  clientName: string
  phone: string
  email: string
  message: string
}

export const RequestForm = ({ standId }: Props) => {

  const normalizePhone = (phone: string) => phone.replace(/[^\d+]/g, '')

    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onBlur'
  })

  const [createRequest, {isLoading}] = useCreateRequestMutation()

  const onSubmit: SubmitHandler<Inputs> = async (e) => {
    createRequest({...e, phone: normalizePhone(e.phone), standId}).unwrap()
    .then(()=>{toast.success('Заявка отправлена')})
   
  }



  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
       {isLoading && (
      <Progress.Root className={styles.progressRoot}>
        <Progress.Indicator className={styles.progressIndicator} />
      </Progress.Root>
    )}

      <div className="grid2">
        <div className="formRow">
          <label className={`${errors.clientName && styles.textError}`}>Имя</label>
          <input
            className={`input ${errors.clientName && styles.inputError}`}
            {...register("clientName", { required: {value: true, message: "Поле не должно быть пустым"}, minLength: {value: 2, message: "Имя должно быть длиной минимум два символа"} })}
          />
            {errors.clientName && <span className={styles.error}>{errors.clientName.message}</span>}
        </div>

        <div className="formRow">
          <label className={`${errors.phone && styles.textError}`}>Телефон</label>
          <input
         className={`input ${errors.phone && styles.inputError}`}
         {...register("phone",  { required: {value: true, message: "Поле не должно быть пустым"}, maxLength: 20, pattern: {
    value: /^\+?[0-9\s\-()]{7,20}$/,
    message: "Введите корректный номер"
  } })}
          />
           {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
        </div>
      </div>

      <div className="grid2">
        <div className="formRow">
          <label className={`${errors.email && styles.textError}`}>Email</label>
          <input
           className={`input ${errors.email && styles.inputError}`}
            type="email"
         {...register("email", {pattern:{value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Не валидный email"}, required: {value: true, message: "Поле не должно быть пустым"}})}
          />
           {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
      </div>

      <div className="formRow">
        <label className={`${errors.message && styles.textError}`}>Сообщение</label>
        <textarea
          className={`textarea ${errors.message && styles.textareaError}`}
          {...register("message")}
        />
         {errors.message && <span className={styles.error}>{errors.message.message}</span>}
      </div>

      <button className="button" type="submit" disabled={isLoading}>
        {isLoading ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  )
}