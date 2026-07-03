import { Fragment } from 'react'
import { ParentFolderTreeResult } from '../../types'
import { Button } from '@shared/ui/buttons/Button'
import { TbChevronRight } from 'react-icons/tb'
import { useDroppable } from '@dnd-kit/core'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { useSelectionStore } from '@stores/useSelectionStore'

interface FolderBreadcrumbsProps {
    folderData?: { folder: { name: string, id: string }, parentFolders: ParentFolderTreeResult[] }
    trailing?: string
}

const DroppableBreadcrumbButton = ({ folderId, children }: { folderId: string, children: React.ReactNode }) => {
    const routes = useWorkspaceRoutes()
    const isDragging = useSelectionStore((state) => state.isDragging)
    const { setNodeRef, isOver } = useDroppable({ id: folderId })

    return (
        <div
            ref={ setNodeRef }
            className={ isDragging ? 'pointer-events-none' : undefined }
        >
            <Button
                to={ folderId === 'root' ? routes.files : routes.folder(folderId) }
                color='secondary'
                variant="soft"
                size='small'
                className={ isOver ? 'bg-blue-100 text-blue-700' : undefined }
            >
                { children }
            </Button>
        </div>
    )
}

export const FolderBreadcrumbs = ({ folderData, trailing }: FolderBreadcrumbsProps) => {
    if (trailing !== undefined) {
        const links = [
            { id: 'root', name: 'Files' },
            ...(folderData
                ? [
                    ...folderData.parentFolders.map(parent => ({ id: parent.id, name: parent.name })),
                    { id: folderData.folder.id, name: folderData.folder.name },
                ]
                : []),
        ]

        return (
            <div className='flex items-center gap-2 text-sm text-gray-600 min-w-0'>
                { links.map(link => (
                    <Fragment key={ link.id }>
                        <DroppableBreadcrumbButton folderId={ link.id }>
                            { link.name }
                        </DroppableBreadcrumbButton>
                        <TbChevronRight
                            size={ 16 }
                            className='shrink-0'
                        />
                    </Fragment>
                )) }
                <span
                    className='font-medium text-gray-900 truncate'
                    title={ trailing }
                >
                    { trailing }
                </span>
            </div>
        )
    }

    if (!folderData) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <span className='font-medium text-gray-900'>Files</span>
            </div>
        )
    }

    const { folder: { name: currentFolderName }, parentFolders } = folderData

    if (parentFolders.length === 0) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <DroppableBreadcrumbButton folderId="root">
                    Files
                </DroppableBreadcrumbButton>
                <TbChevronRight size={ 16 } />
                <span className='font-medium text-gray-900'>{ currentFolderName }</span>
            </div>
        )
    }

    if (parentFolders.length === 1) {
        return (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
                <DroppableBreadcrumbButton folderId="root">
                    Files
                </DroppableBreadcrumbButton>
                <TbChevronRight size={ 16 } />
                <span className='font-medium text-gray-900'>{ currentFolderName }</span>
            </div>
        )
    }

    const parent = parentFolders[parentFolders.length - 1]
    
    return (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
            <DroppableBreadcrumbButton folderId="root">
                Files
            </DroppableBreadcrumbButton>
            <TbChevronRight size={ 16 } />
            <span className='text-gray-500'>...</span>
            <TbChevronRight size={ 16 } />
            <DroppableBreadcrumbButton folderId={ parent.id }>
                { parent.name }
            </DroppableBreadcrumbButton>
            <TbChevronRight size={ 16 } />
            <span className='font-medium text-gray-900'>{ currentFolderName }</span>
        </div>
    )
} 