import { Dialog, DialogClose, DialogContent, DialogDescription, DialogPortal, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import React, { ReactElement, ReactNode } from 'react'
import { ModalOverlay } from './ModalOverlay'
import { twMerge } from 'tailwind-merge'
import { TbX } from 'react-icons/tb'

type Props = {
    children: ReactNode
    trigger?: ReactElement
    title?: string
    description?: string
    maxWidth?: string
    open: boolean
    showClose?: boolean
    onOpenChange: (open: boolean) => void
    fullscreenWithMargin?: boolean
}

export const ModalClose = DialogClose

export const ModalDescription = DialogDescription

export const ModalCloseButton = () => (
    <DialogClose asChild>
        <button
            className="absolute right-4 top-4 inline-flex size-10 appearance-none items-center justify-center rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
        >
            <TbX className='w-6 h-6 text-neutral-500'/>
        </button>
    </DialogClose>
)

export const Modal = ({
    children,
    trigger,
    title,
    maxWidth = 'max-w-[500px]',
    showClose = true,
    open,
    onOpenChange,
    fullscreenWithMargin = false
}: Props) => (
    <Dialog
        open={ open }
        onOpenChange={ onOpenChange }
    >
        {
            trigger && (
                <DialogTrigger asChild>
                    { React.cloneElement(trigger as ReactElement<any>, { onClick: trigger.type === 'button' ? undefined : () => onOpenChange(true) }) }
                </DialogTrigger>
            )
        }
        <DialogPortal>
            <ModalOverlay />
            <DialogContent
                className={
                    twMerge(
                        fullscreenWithMargin
                            ? 'fixed inset-0 m-4 md:m-16 max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-8rem)] max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-8rem)] bg-white shadow-[var(--shadow-6)] focus:outline-hidden data-[state=open]:animate-contentShow overflow-hidden flex flex-col rounded-xl'
                            : 'fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white py-7 shadow-[var(--shadow-6)] focus:outline-hidden data-[state=open]:animate-contentShow overflow-hidden flex flex-col',
                        !fullscreenWithMargin && maxWidth
                    )
                }
                aria-describedby={ undefined }
            >
                <DialogTitle
                    autoFocus
                    tabIndex={ 0 }
                    className={
                        twMerge(
                            'focus:outline-hidden',
                            'text-xl font-medium leading-4',
                            'px-7'
                        )
                    }
                >
                    { title }
                </DialogTitle>
                { children }
                {
                    showClose && <ModalCloseButton />
                }
            </DialogContent>
        </DialogPortal>
    </Dialog>
)