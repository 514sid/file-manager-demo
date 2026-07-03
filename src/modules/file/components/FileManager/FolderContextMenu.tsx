import { ContextMenu } from '@shared/ui/ContextMenu'
import { FolderWithChildrenCount } from '../../types'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { useEntityModalStore } from '@modules/file/stores/useEntityModalStore'
import { deleteFoldersRequest, DeleteFoldersRequestData } from '@modules/file/api/deleteFolders'

interface FolderContextMenuProps {
    anchorPoint: { x: number; y: number }
    open: boolean
    onClose: () => void
    data: unknown
}

export const FolderContextMenu = ({ anchorPoint, open, onClose, data }: FolderContextMenuProps) => {
    const { isSelected, getSelectedItems } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        getSelectedItems: state.getSelectedItems,
    })))

    const confirm = useConfirmationDialogStore((state) => state.confirm)
    const openModal = useEntityModalStore((state) => state.openModal)
    const params = useParams<{ folderId?: string }>()
    const queryClient = useQueryClient()

    const clickedFolder = data as FolderWithChildrenCount

    const foldersToActOn = (() => {
        const isClickedFolderSelected = isSelected(clickedFolder.id)

        if (isClickedFolderSelected) {
            return getSelectedItems()
                .filter(item => item.entity === 'folder')
                .map(item => item.item as FolderWithChildrenCount)
        } else {
            return [clickedFolder]
        }
    })()

    const isSingle = foldersToActOn.length === 1

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: DeleteFoldersRequestData) => deleteFoldersRequest(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] })
        }
    })

    const handleDelete = async () => {
        const count = foldersToActOn.length
        const label = count === 1 ? 'folder' : 'folders'

        const confirmed = await confirm({
            title: `Delete ${label}`,
            message: `Are you sure you want to delete ${count} ${label}? Everything inside will be removed.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        })

        if (confirmed) {
            mutate({
                folderIds: foldersToActOn.map(folder => folder.id),
                workspaceId: foldersToActOn[0].workspaceId
            })
        }
    }

    const options = [
        ...(isSingle ? [
            { label: 'Rename', action: () => openModal({ kind: 'renameFolder', folder: foldersToActOn[0] }) },
        ] : []),
        { label: 'Move', action: () => openModal({ kind: 'move', target: { fileIds: [], folderIds: foldersToActOn.map(f => f.id), currentParentId: params.folderId || null } }) },
        { label: 'Delete', action: handleDelete, disabled: isPending },
    ]

    return (
        <ContextMenu
            anchorPoint={ anchorPoint }
            open={ open }
            onClose={ onClose }
            options={ options }
        />
    )
}
