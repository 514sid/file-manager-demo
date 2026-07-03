import { DraggableFileCard } from '../FileCard'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense, useCallback } from 'react'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { workspaceFilesQuery } from '../../api/workspaceFiles'
import { useSelectionStore } from '@stores/useSelectionStore'
import { WorkspaceFile } from '../../types'
import { useContextMenuStore } from '@stores/useContextMenuStore'
import { useFileViewStore } from '../../stores/useFileViewStore'
import { FileListSkeleton } from './ListSkeletons'

interface FileListProps {
    search: string
    folderId?: string
    onFileDoubleClick?: (file: WorkspaceFile) => void
}

const SuspenseFileList = ({ search, folderId, onFileDoubleClick }: FileListProps) => {
    const workspace = useWorkspace()
    const { data } = useSuspenseQuery(workspaceFilesQuery({
        id: workspace.id,
        filters: {
            search,
            folderId: folderId || null
        }
    }))

    const { data: files } = data
    const { isSelected, setSelectedItems, handleItemClick } = useSelectionStore()
    const { openContextMenu } = useContextMenuStore()
    const mode = useFileViewStore((state) => state.mode)

    const handleFileDoubleClick = useCallback((file: WorkspaceFile) => {
        onFileDoubleClick?.(file)
    }, [onFileDoubleClick])

    const handleFileContextMenu = useCallback((file: WorkspaceFile, event: React.MouseEvent) => {
        const isFileSelected = isSelected(file.id)
        
        if (!isFileSelected) {
            setSelectedItems({
                [file.id]: { item: file, entity: 'file' }
            })
        }
        
        openContextMenu('file', file, event.clientX, event.clientY)
    }, [openContextMenu, isSelected, setSelectedItems])

    const containerClassName = mode === 'cards'
        ? 'grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4'
        : 'flex flex-col'

    return (
        <div className={ containerClassName }>
            {
                files.map(
                    (file: WorkspaceFile, idx: number) => (
                        <DraggableFileCard
                            file={ file }
                            view={ mode }
                            key={ file.id }
                            onClick={ (e: React.MouseEvent) => handleItemClick(file, idx, e, files, 'file') }
                            onDoubleClick={ () => handleFileDoubleClick(file) }
                            onContextMenu={ (e: React.MouseEvent) => handleFileContextMenu(file, e) }
                        />
                    )
                )
            }
        </div>
    )
}

export const FileList = ({ folderId, onFileDoubleClick }: { folderId?: string, onFileDoubleClick?: (file: WorkspaceFile) => void }) => {
    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary fallbackRender={ () => (
                <div className='text-sm text-gray-500'>
                    There was an error loading files.
                </div>
            ) }
            >
                <Suspense fallback={ <FileListSkeleton /> }>
                    <SuspenseFileList
                        search={ '' }
                        folderId={ folderId }
                        onFileDoubleClick={ onFileDoubleClick }
                    />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    )
}