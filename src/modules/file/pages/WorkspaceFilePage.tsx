import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TbPencil, TbArrowsMove, TbDownload, TbTrash } from 'react-icons/tb'
import { StorageService } from '@/utils/StorageService'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { Button } from '@shared/ui/buttons/Button'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { Modal } from '@shared/ui/modal/Modal'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { workspaceFileQuery } from '../api/workspaceFile'
import { workspaceFolderQuery } from '../api/workspaceFolder'
import { deleteFilesRequest } from '../api/deleteFiles'
import { WorkspaceFile } from '../types'
import { RenameFileModal } from '../components/modals/RenameFileModal'
import { MoveEntitiesModal } from '../components/modals/MoveEntitiesModal'
import { FileMetaTable, FilePlaylists } from '../components/FileMeta'
import { FolderBreadcrumbs } from '../components/FileManager/FolderBreadcrumbs'
import { NotFoundState } from '../components/FileManager/NotFoundState'

const FilePreview = ({ file }: { file: WorkspaceFile }) => {
    const [loading, setLoading] = useState(true)

    return (
        <div className='relative flex items-center justify-center grow bg-black rounded-2xl overflow-hidden min-h-[320px]'>
            { loading && (
                <div className='absolute inset-0 flex items-center justify-center z-10'>
                    <ButtonSpinner className='w-12 h-12 text-white' />
                </div>
            ) }
            { file.type === 'image' && (
                <img
                    key={ file.path }
                    src={ StorageService.getFileSrc(file.path) }
                    alt={ file.name }
                    className={ `max-w-full max-h-[70vh] object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}` }
                    onLoad={ () => setLoading(false) }
                    onError={ () => setLoading(false) }
                />
            ) }
            { file.type === 'video' && (
                <video
                    key={ file.path }
                    src={ StorageService.getFileSrc(file.path) }
                    className={ `max-w-full max-h-[70vh] object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}` }
                    controls
                    onCanPlay={ () => setLoading(false) }
                />
            ) }
        </div>
    )
}

export const WorkspaceFilePage = () => {
    const { fileId } = useParams<{ fileId: string }>()
    const workspace = useWorkspace()
    const routes = useWorkspaceRoutes()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const confirm = useConfirmationDialogStore((state) => state.confirm)

    const [renameOpen, setRenameOpen] = useState(false)
    const [moveOpen, setMoveOpen] = useState(false)

    const { data: file, isLoading, isError } = useQuery({
        ...workspaceFileQuery({ fileId: fileId!, workspaceId: workspace.id }),
        retry: false,
    })

    const { data: folderData } = useQuery({
        ...workspaceFolderQuery({ folderId: file?.folderId as string, workspaceId: workspace.id }),
        enabled: !!file?.folderId,
        retry: false,
    })

    const { mutate: deleteFile, isPending: isDeleting } = useMutation({
        mutationFn: () => deleteFilesRequest({ fileIds: [fileId!], workspaceId: workspace.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            navigate(file?.folderId ? routes.folder(file.folderId) : routes.files)
        },
    })

    if (isLoading) {
        return (
            <LayoutBodyContainer>
                <div className='flex grow items-center justify-center text-gray-400'>
                    <ButtonSpinner className='w-8 h-8 text-gray-300' />
                </div>
            </LayoutBodyContainer>
        )
    }

    if (isError || !file) {
        return (
            <LayoutBodyContainer>
                <NotFoundState
                    title='File not found'
                    message='This file doesn’t exist or may have been deleted.'
                    action={ { label: 'Back to files', to: routes.files } }
                />
            </LayoutBodyContainer>
        )
    }

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete file',
            message: `Are you sure you want to delete "${file.name}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        })

        if (confirmed) deleteFile()
    }

    const handleDownload = () => {
        window.open(StorageService.getFileSrc(file.path), '_blank', 'noopener')
    }

    return (
        <LayoutBodyContainer>
            <div className='flex items-center justify-between gap-4 p-7 border-b border-gray-100'>
                <FolderBreadcrumbs
                    folderData={ folderData }
                    trailing={ file.name }
                />
                <div className='flex items-center gap-2 shrink-0'>
                    <Button
                        onClick={ () => setRenameOpen(true) }
                        color='secondary'
                        variant='soft'
                        size='small'
                        icon={ TbPencil }
                    >
                        Rename
                    </Button>
                    <Button
                        onClick={ () => setMoveOpen(true) }
                        color='secondary'
                        variant='soft'
                        size='small'
                        icon={ TbArrowsMove }
                    >
                        Move
                    </Button>
                    <Button
                        onClick={ handleDownload }
                        color='secondary'
                        variant='soft'
                        size='small'
                        icon={ TbDownload }
                    >
                        Download
                    </Button>
                    <Button
                        onClick={ handleDelete }
                        color='danger'
                        variant='soft'
                        size='small'
                        icon={ TbTrash }
                        disabled={ isDeleting }
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <ScrollArea verticalMargin={ 24 }>
                <div className='p-7 flex flex-col lg:flex-row gap-8'>
                    <div className='flex grow min-w-0'>
                        <FilePreview file={ file } />
                    </div>

                    <div className='w-full lg:w-[360px] shrink-0 flex flex-col gap-6'>
                        <div>
                            <h1
                                className='text-xl font-semibold text-gray-900 break-words'
                                title={ file.name }
                            >
                                { file.name }
                            </h1>
                            <div className='text-sm text-gray-500 mt-1'>
                                { file.mimeType }
                            </div>
                        </div>

                        <FileMetaTable file={ file } />

                        <FilePlaylists file={ file } />
                    </div>
                </div>
            </ScrollArea>

            <Modal
                open={ renameOpen }
                title='Rename file'
                onOpenChange={ setRenameOpen }
            >
                <div className='max-w-[500px]'>
                    <RenameFileModal
                        file={ file }
                        onClose={ () => setRenameOpen(false) }
                    />
                </div>
            </Modal>

            <Modal
                open={ moveOpen }
                title='Move file'
                onOpenChange={ setMoveOpen }
            >
                <div className='w-[500px] max-w-full'>
                    <MoveEntitiesModal
                        target={ { fileIds: [file.id], folderIds: [], currentParentId: file.folderId } }
                        onClose={ () => setMoveOpen(false) }
                    />
                </div>
            </Modal>
        </LayoutBodyContainer>
    )
}
