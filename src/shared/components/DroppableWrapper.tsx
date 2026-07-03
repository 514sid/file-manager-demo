import { useDroppable } from '@dnd-kit/core'
import { ReactElement } from 'react'

interface DroppableWrapperProps {
    id: string
    children: ReactElement
    className?: string
    isOverClassName?: string
}

export const DroppableWrapper = ({ 
    id, 
    children,
    className,
    isOverClassName
}: DroppableWrapperProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
    })

    const combinedClassName = [
        className,
        isOver && isOverClassName
    ].filter(Boolean).join(' ')
	
    return (
        <div
            ref={ setNodeRef }
            className={ combinedClassName }
        >
            { children }
        </div>
    )
} 