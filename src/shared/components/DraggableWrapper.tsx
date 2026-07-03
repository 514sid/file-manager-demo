import { useDraggable } from '@dnd-kit/core'
import { ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

interface DraggableWrapperProps {
    id: string
    data: Record<string, unknown>
    action: string
    modifiers?: unknown[]
    children: ReactElement
    className?: string
}

export const DraggableWrapper = ({ 
    id, 
    data, 
    action, 
    modifiers = [], 
    children,
    className 
}: DraggableWrapperProps) => {
    const {
        attributes,
        listeners,
        setNodeRef
    } = useDraggable({
        id,
        data: {
            ...data,
            action,
            modifiers,
        }
    })

    const style: React.CSSProperties = {
        touchAction: 'none',
        userSelect: 'none',
    }
	
    return (
        <div
            ref={ setNodeRef }
            style={ style }
            className={ twMerge([
                className,
                'focus:outline-none'
            ]) }
            { ...attributes }
            { ...listeners }
        >
            { children }
        </div>
    )
} 