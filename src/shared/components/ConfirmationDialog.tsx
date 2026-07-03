import { Button } from '@shared/ui/buttons/Button'
import { Modal, ModalDescription } from '@shared/ui/modal/Modal'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'

type ConfirmationDialogVariant = 'default' | 'info' | 'warning' | 'danger'

const getButtonColor = (variant: ConfirmationDialogVariant = 'default') => {
    switch (variant) {
        case 'info':
            return 'primary'
        case 'warning':
            return 'danger'
        case 'danger':
            return 'danger'
        default:
            return 'primary'
    }
}

export const ConfirmationDialog = () => {
    const {
        isOpen,
        options,
        close,
        resolve,
    } = useConfirmationDialogStore()

    const handleConfirm = () => {
        resolve?.(true)
        close()
    }

    const handleCancel = () => {
        resolve?.(false)
        close()
    }

    if (!options) return null

    const variant: ConfirmationDialogVariant = options.variant || 'default'
    const confirmButtonColor = getButtonColor(variant)

    return (
        <Modal
            open={ isOpen }
            onOpenChange={ (open) => {
                if (!open) handleCancel()
            } }
            title={ options.title }
            description={ options.message }
            showClose
        >
            <div className="px-7 pt-4 pb-2">
                { options.message && (
                    <ModalDescription asChild>
                        <pre className="text-neutral-600 mb-4 whitespace-pre-wrap font-sans text-sm">
                            { options.message }
                        </pre>
                    </ModalDescription>
                ) }
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={ handleCancel }
                        variant="soft"
                        color='secondary'
                    >
                        { options.cancelText || 'Cancel' }
                    </Button>
                    <Button
                        onClick={ handleConfirm }
                        color={ confirmButtonColor }
                    >
                        { options.confirmText || 'Confirm' }
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
