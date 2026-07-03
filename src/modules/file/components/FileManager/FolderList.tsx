import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useCallback } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { DraggableFolderCard } from '../FolderCard'
import { workspaceFoldersQuery } from '../../api/workspaceFolders'
import { useSelectionStore } from '@stores/useSelectionStore'
import { FolderWithChildrenCount } from '../../types'
import { useContextMenuStore } from '@stores/useContextMenuStore'
import { useFileViewStore } from '../../stores/useFileViewStore'
import { FolderListSkeleton } from './ListSkeletons'

type FolderListProps = {
    search?: string
    parentId?: string
    onFolderDoubleClick?: (folder: FolderWithChildrenCount) => void
}

const SuspenseFolderList = ({ search = '', parentId, onFolderDoubleClick }: FolderListProps) => {
    const workspace = useWorkspace()
    const { data: folders } = useSuspenseQuery(workspaceFoldersQuery({
        id: workspace.id,
        filters: {
            search,
            parentId: parentId || null
        }
    }))

    const { isSelected, setSelectedItems, handleItemClick } = useSelectionStore()
    const { openContextMenu } = useContextMenuStore()
    const mode = useFileViewStore((state) => state.mode)

    const handleFolderContextMenu = useCallback((folder: FolderWithChildrenCount, event: React.MouseEvent) => {
        event.preventDefault()
        const selected = isSelected(folder.id)

        if (!selected) {
            setSelectedItems({
                [folder.id]: { item: folder, entity: 'folder' }
            })
        }
        openContextMenu('folder', folder, event.clientX, event.clientY)
    }, [isSelected, setSelectedItems, openContextMenu])

    const containerClassName = mode === 'cards'
        ? 'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4'
        : 'flex flex-col'

    return (
        <div className={ containerClassName }>
            { folders.map((folder: FolderWithChildrenCount, idx: number) => (
                <DraggableFolderCard
                    folder={ folder }
                    view={ mode }
                    key={ folder.id }
                    onClick={ (e: React.MouseEvent) => handleItemClick(folder, idx, e, folders, 'folder') }
                    onContextMenu={ (e: React.MouseEvent) => handleFolderContextMenu(folder, e) }
                    onDoubleClick={ onFolderDoubleClick ? () => onFolderDoubleClick(folder) : undefined }
                />
            )) }
        </div>
    )
}

export const FolderList = ({ parentId, onFolderDoubleClick }: { parentId?: string, onFolderDoubleClick?: (folder: FolderWithChildrenCount) => void }) => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div className='text-sm text-gray-500'>
                    There was an error loading folders.
                </div>
            ) }
            >
                <Suspense fallback={ <FolderListSkeleton /> }>
                    <SuspenseFolderList
                        parentId={ parentId }
                        onFolderDoubleClick={ onFolderDoubleClick }
                    />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}