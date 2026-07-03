import { DndContext, DragOverlay, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { snapLeftTopToCursor } from '../../utils/snapLeftTopToCursor'
import { useFileDragHandlers } from '../../hooks/useFileDragHandlers'
import { DragOverlayContent } from './DragOverlayContent'

export const FilesDndContext = ({ children }: { children: ReactNode }) => {
    const { handleDragStart, handleDragEnd } = useFileDragHandlers()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    return (
        <DndContext
            onDragStart={ handleDragStart }
            onDragEnd={ handleDragEnd }
            collisionDetection={ pointerWithin }
            sensors={ sensors }
        >
            { children }
            <DragOverlay
                dropAnimation={ null }
                modifiers={ [snapLeftTopToCursor] }
            >
                <DragOverlayContent />
            </DragOverlay>
        </DndContext>
    )
}
