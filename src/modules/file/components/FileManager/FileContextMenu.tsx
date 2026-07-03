import { ContextMenu } from '@shared/ui/ContextMenu'
import { WorkspaceFile } from '../../types'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { deleteFilesRequest, DeleteFilesRequestData } from '@modules/file/api/deleteFiles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { PaginationMeta } from '@/types'
import { useNavigate } from 'react-router'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { useParams } from 'react-router'
import { useEntityModalStore } from '@modules/file/stores/useEntityModalStore'

interface FileContextMenuProps {
    anchorPoint: { x: number; y: number }
    open: boolean
    onClose: () => void
    data: unknown
}

export const FileContextMenu = ({ anchorPoint, open, onClose, data }: FileContextMenuProps) => {
    const { isSelected, getSelectedItems } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        getSelectedItems: state.getSelectedItems,
    })))

    const confirm = useConfirmationDialogStore((state) => state.confirm)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()
    const params = useParams<{ folderId?: string }>()
    const openModal = useEntityModalStore((state) => state.openModal)

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeleteFilesRequestData) => deleteFilesRequest(data),
        onSuccess: async (_data, variables) => {
            const allWorkspaceFilesQueries = queryClient.getQueriesData({ queryKey: ['workspaceFiles', { id: variables.workspaceId }] })
            
            allWorkspaceFilesQueries.forEach(([queryKey, data]) => {
                const filesData = data as { data: WorkspaceFile[]; meta: PaginationMeta } | undefined
                
                if (filesData?.data) {
                    const updatedFiles = filesData.data.filter(file => 
                        !filesToActOn.some(deletedFile => deletedFile.id === file.id)
                    )
                    
                    queryClient.setQueryData(queryKey, {
                        ...filesData,
                        data: updatedFiles,
                        meta: {
                            ...filesData.meta,
                            total: Math.max(0, filesData.meta.total - filesToActOn.length)
                        }
                    })
                }
            })
            
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            
            queryClient.invalidateQueries({ queryKey: ['workspaceStatistics'] })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const clickedFile = data as WorkspaceFile

    const filesToActOn = (() => {
        const isClickedFileSelected = isSelected(clickedFile.id)
        
        if (isClickedFileSelected) {
            return getSelectedItems()
                .filter(item => item.entity === 'file')
                .map(item => item.item as WorkspaceFile)
        } else {
            return [clickedFile]
        }
    })()

    const isSingle = filesToActOn.length === 1

    const handleDelete = async () => {
        const fileCount = filesToActOn.length
        const fileText = fileCount === 1 ? 'file' : 'files'

        const confirmed = await confirm({
            title: `Delete ${fileText}`,
            message: `Are you sure you want to delete ${fileCount} ${fileText}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        })

        if (confirmed) {
            const deleteData: DeleteFilesRequestData = {
                fileIds: filesToActOn.map(file => file.id),
                workspaceId: filesToActOn[0].workspaceId
            }

            mutate(deleteData)
        }
    }

    const options = [
        ...(isSingle ? [
            { label: 'Open', action: () => navigate(routes.file(clickedFile.id)) },
            { label: 'Rename', action: () => openModal({ kind: 'renameFile', file: filesToActOn[0] }) },
            { label: 'Download', action: () => console.log('Download', filesToActOn) },
        ] : []),
        { label: 'Move', action: () => openModal({ kind: 'move', target: { fileIds: filesToActOn.map(f => f.id), folderIds: [], currentParentId: params.folderId || null } }) },
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