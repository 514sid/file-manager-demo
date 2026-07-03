import { DialogOverlay } from '@radix-ui/react-dialog'

export const ModalOverlay = () => {
    return (
        <DialogOverlay className="fixed inset-0 bg-black/20 data-[state=open]:animate-overlayShow" />
    )
}