import { useMoveFiles } from './useMoveFiles'
import { useMoveFolders } from './useMoveFolders'
import { useSelectionStore } from '@stores/useSelectionStore'

export const useMoveOperations = () => {
    const { clearSelection } = useSelectionStore()

    const onSuccessMove = () => {
        clearSelection()
    }

    const { moveFiles } = useMoveFiles({ onSuccessMove })
    const { moveFolders } = useMoveFolders({ onSuccessMove })

    return {
        moveFiles,
        moveFolders
    }
} 