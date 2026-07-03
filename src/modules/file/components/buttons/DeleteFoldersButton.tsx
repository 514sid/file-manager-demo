import { ButtonElement } from '@/types'
import { deleteFoldersRequest, DeleteFoldersRequestData } from '@modules/file/api/deleteFolders'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useMutation } from '@tanstack/react-query'
import { cloneElement } from 'react'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'

type Props = {
    children: ButtonElement
    folderIds: string[] | string
}

export const DeleteFoldersButton = ({ folderIds, children }: Props) => {
    const workspace = useWorkspace()
    const confirm = useConfirmationDialogStore((state) => state.confirm)
	
    const data: DeleteFoldersRequestData = {
        folderIds: Array.isArray(folderIds) ? folderIds : [folderIds],
        workspaceId: workspace.id
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeleteFoldersRequestData) => deleteFoldersRequest(data),
        onSuccess: async (folder) => {
            console.log(folder)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleClick = async () => {
        const folderCount = Array.isArray(folderIds) ? folderIds.length : 1
        const folderText = folderCount === 1 ? 'folder' : 'folders'
        
        const confirmed = await confirm({
            title: `Delete ${folderText}`,
            message: `Are you sure you want to delete ${folderCount} ${folderText}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        })

        if (confirmed) {
            mutate(data)
        }
    }

    const Component = children

    return (
        cloneElement(Component, {
            onClick: handleClick,
            disabled: isPending
        })
    )
}
