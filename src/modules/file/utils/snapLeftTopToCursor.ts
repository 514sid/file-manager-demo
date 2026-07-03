import type { Modifier } from '@dnd-kit/core'
import { getEventCoordinates } from '@dnd-kit/utilities'

export const snapLeftTopToCursor: Modifier = ({
    activatorEvent,
    draggingNodeRect,
    transform,
}) => {
    if (draggingNodeRect && activatorEvent) {
        const activatorCoordinates = getEventCoordinates(activatorEvent)

        if (!activatorCoordinates) {
            return transform
        }

        const offsetX = activatorCoordinates.x - draggingNodeRect.left
        const offsetY = activatorCoordinates.y - draggingNodeRect.top

        return {
            ...transform,
            x: transform.x + offsetX,
            y: transform.y + offsetY,
        }
    }

    return transform
}
