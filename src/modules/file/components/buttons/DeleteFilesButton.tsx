import { ButtonElement } from '@/types'
import { deleteFilesRequest, DeleteFilesRequestData } from '@modules/file/api/deleteFiles'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useMutation } from '@tanstack/react-query'
import { cloneElement } from 'react'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'

type Props = {
    children: ButtonElement
    fileIds: string[] | string
}

export const DeleteFilesButton = ({ fileIds, children }: Props) => {
    const workspace = useWorkspace()
    const confirm = useConfirmationDialogStore((state) => state.confirm)

    const data: DeleteFilesRequestData = {
        fileIds: Array.isArray(fileIds) ? fileIds : [fileIds],
        workspaceId: workspace.id
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeleteFilesRequestData) => deleteFilesRequest(data),
        onSuccess: async (result) => {
            console.log(result)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleClick = async () => {
        const fileCount = Array.isArray(fileIds) ? fileIds.length : 1
        const fileText = fileCount === 1 ? 'file' : 'files'

        const confirmed = await confirm({
            title: `Delete ${fileText}`,
            message: `Are you sure you want to delete ${fileCount} ${fileText}?`,
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
