import * as Dialog from '@radix-ui/react-dialog'
import styles from './ConfirmModal.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
}

export const ConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
  title = 'Подтверждение',
  description = 'Вы уверены?'
}: Props) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            {title}
          </Dialog.Title>

          <Dialog.Description className={styles.description}>
            {description}
          </Dialog.Description>

          <div className={styles.actions}>
            <button
              className={styles.cancel}
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </button>

            <button
              className={styles.confirm}
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              Удалить
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}