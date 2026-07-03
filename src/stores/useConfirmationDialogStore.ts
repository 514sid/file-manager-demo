import { create } from 'zustand'

type ConfirmationDialogVariant = 'default' | 'info' | 'warning' | 'danger'

type ConfirmationDialogOptions = {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: ConfirmationDialogVariant
}


type ConfirmationDialogStore = {
    isOpen: boolean
    options: ConfirmationDialogOptions | null
    resolve: ((result: boolean) => void) | null
    confirm: (options: ConfirmationDialogOptions) => Promise<boolean>
    close: () => void
}

export const useConfirmationDialogStore = create<ConfirmationDialogStore>((set) => ({
    isOpen: false,
    options: null,
    resolve: null,
    confirm: (options) =>
        new Promise((resolve) => {
            set({
                isOpen: true,
                options,
                resolve,
            })
        }),
    close: () =>
        set((state) => {
            state.resolve?.(false)
            return { isOpen: false, options: null, resolve: null }
        }),
}))
