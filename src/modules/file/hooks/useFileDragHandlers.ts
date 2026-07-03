import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useParams } from 'react-router'
import { useMoveOperations } from './useMoveOperations'

export const useFileDragHandlers = () => {
    const params = useParams<{ folderId: string }>()
    const workspace = useWorkspace()

    const { selectedItems, setDragging, selectItem, clearSelection, isSelected } = useSelectionStore(useShallow((state) => ({
        selectedItems: state.selectedItems,
        setDragging: state.setDragging,
        selectItem: state.selectItem,
        clearSelection: state.clearSelection,
        isSelected: state.isSelected,
    })))

    const { moveFiles, moveFolders } = useMoveOperations()

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event

        if (active.data.current?.file && !isSelected(active.data.current.file.id)) {
            clearSelection()
            selectItem({ item: active.data.current.file, entity: 'file' })
        }

        if (active.data.current?.folder && !isSelected(active.data.current.folder.id)) {
            clearSelection()
            selectItem({ item: active.data.current.folder, entity: 'folder' })
        }

        setDragging(true)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { over } = event

        setDragging(false)

        if (!over || selectedItems[over.id]) return

        const targetFolderId = over.id === 'root' ? null : over.id as string | null

        if (event.active.data.current?.action === 'dragFile') {
            moveFiles.mutate({
                fileIds: Object.keys(selectedItems),
                targetFolderId,
                workspaceId: workspace.id,
                sourceFolderId: params.folderId || null
            })
        } else if (event.active.data.current?.action === 'dragFolder') {
            moveFolders.mutate({
                folderIds: Object.keys(selectedItems),
                targetFolderId,
                workspaceId: workspace.id,
                sourceParentId: params.folderId || null
            })
        }
    }

    return {
        handleDragStart,
        handleDragEnd
    }
} 