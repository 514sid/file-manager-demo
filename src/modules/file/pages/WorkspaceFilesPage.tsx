import { CreateFolderButton } from '../components/buttons/CreateFolderButton'
import { Button } from '@shared/ui/buttons/Button'
import { TbFolderPlus } from 'react-icons/tb'
import { FolderList } from '../components/FileManager/FolderList'
import { FileList } from '../components/FileManager/FileList'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { FilesDndContext } from '../components/FileManager/FilesDndContext'
import { MarqueeSelection } from '../components/FileManager/MarqueeSelection'
import { ViewModeSwitcher } from '../components/FileManager/ViewModeSwitcher'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { useRef, useEffect, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useFileViewerModal } from '../hooks/useFileViewerModal'
import { FilePreviewModal } from '../components/FilePreviewModal'
import { WorkspaceFile, ParentFolderTreeResult, FolderWithChildrenCount } from '../types'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useSuspenseQuery, QueryErrorResetBoundary } from '@tanstack/react-query'
import { workspaceFolderQuery } from '../api/workspaceFolder'
import { workspaceFoldersQuery } from '../api/workspaceFolders'
import { workspaceFilesQuery } from '../api/workspaceFiles'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { FolderBreadcrumbs } from '../components/FileManager/FolderBreadcrumbs'
import { FolderEmptyState } from '../components/FileManager/FolderEmptyState'
import { NotFoundState } from '../components/FileManager/NotFoundState'
import { FolderListSkeleton, FileListSkeleton } from '../components/FileManager/ListSkeletons'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { useFilesPageClickHandler } from '../hooks/useFilesPageClickHandler'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { useFileViewStore, FileViewMode } from '../stores/useFileViewStore'

type MainContentProps = {
    folderId?: string
    folderData?: { folder: { name: string, id: string }, parentFolders: ParentFolderTreeResult[] }
    filesPageContentRef: React.RefObject<HTMLDivElement>
    handleFileDoubleClick: (file: WorkspaceFile) => void
    handleFolderDoubleClick: (folder: FolderWithChildrenCount) => void
}

const ListColumnHeader = () => (
    <div className='flex items-center gap-3 px-3 pb-2 mb-1 border-b border-gray-100 text-xs font-medium text-gray-400'>
        <div className='w-9 shrink-0' />
        <div className='flex-1'>Name</div>
        <div className='w-32 shrink-0'>Type</div>
        <div className='w-24 shrink-0 text-right'>Size</div>
        <div className='w-40 shrink-0'>Modified</div>
    </div>
)

type FolderContentsProps = {
    folderId?: string
    mode: FileViewMode
    onFileDoubleClick: (file: WorkspaceFile) => void
    onFolderDoubleClick: (folder: FolderWithChildrenCount) => void
}

const FolderContents = ({ folderId, mode, onFileDoubleClick, onFolderDoubleClick }: FolderContentsProps) => {
    const workspace = useWorkspace()

    const { data: folders } = useSuspenseQuery(workspaceFoldersQuery({
        id: workspace.id,
        filters: { search: '', parentId: folderId || null }
    }))
    const { data: files } = useSuspenseQuery(workspaceFilesQuery({
        id: workspace.id,
        filters: { search: '', folderId: folderId || null }
    }))

    if (folders.length === 0 && files.data.length === 0) {
        return <FolderEmptyState />
    }

    return (
        <>
            { mode === 'list' && <ListColumnHeader /> }
            <FolderList
                parentId={ folderId }
                onFolderDoubleClick={ onFolderDoubleClick }
            />
            <div className={ mode === 'cards' ? 'mt-10' : 'mt-1' }></div>
            <FileList
                folderId={ folderId }
                onFileDoubleClick={ onFileDoubleClick }
            />
        </>
    )
}

const FolderContentsFallback = ({ mode }: { mode: FileViewMode }) => (
    <>
        { mode === 'list' && <ListColumnHeader /> }
        <FolderListSkeleton />
        <div className={ mode === 'cards' ? 'mt-10' : 'mt-1' }></div>
        <FileListSkeleton />
    </>
)

const MainContent = ({ folderId, folderData, filesPageContentRef, handleFileDoubleClick, handleFolderDoubleClick }: MainContentProps) => {
    const mode = useFileViewStore((state) => state.mode)

    return (
        <LayoutBodyContainer>
            <div className='flex items-center justify-between p-7 border-b border-gray-100'>
                <FolderBreadcrumbs folderData={ folderData }/>
                <div className='flex items-center gap-3'>
                    <ViewModeSwitcher />
                    <CreateFolderButton parentId={ folderId || null }>
                        <Button
                            size='small'
                            icon={ TbFolderPlus }
                        >
                            Create folder
                        </Button>
                    </CreateFolderButton>
                </div>
            </div>
            <ScrollArea verticalMargin={ 24 }>
                <div
                    className='p-7 relative select-none'
                    ref={ filesPageContentRef }
                >
                    <MarqueeSelection
                        containerRef={ filesPageContentRef }
                        folderId={ folderId }
                    />
                    <QueryErrorResetBoundary>
                        <ErrorBoundary fallbackRender={ () => (
                            <div className='text-sm text-gray-500'>
                                There was an error loading this folder.
                            </div>
                        ) }
                        >
                            <Suspense fallback={ <FolderContentsFallback mode={ mode } /> }>
                                <FolderContents
                                    folderId={ folderId }
                                    mode={ mode }
                                    onFileDoubleClick={ handleFileDoubleClick }
                                    onFolderDoubleClick={ handleFolderDoubleClick }
                                />
                            </Suspense>
                        </ErrorBoundary>
                    </QueryErrorResetBoundary>
                </div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}

export const WorkspaceFilesPage = () => {
    const params = useParams<{ folderId?: string }>()
    const navigate = useNavigate()
    const folderId = params.folderId
    const routes = useWorkspaceRoutes()
    const { getEntity, clearSelection } = useSelectionStore(
        useShallow((state) => ({ getEntity: state.getEntity, clearSelection: state.clearSelection }))
    )
    const filesPageContentRef = useRef<HTMLDivElement>(null!)
    const { modalFile, openModal, closeModal } = useFileViewerModal()
    const workspace = useWorkspace()
    
    const { data: folderData, isError, isSuccess } = useQuery({
        ...workspaceFolderQuery({ folderId: folderId!, workspaceId: workspace.id }),
        enabled: !!folderId,
        retry: false
    })

    useFilesPageClickHandler({
        filesPageContentRef,
        getEntity,
        clearSelection
    })
    
    const handleFileDoubleClick = (file: WorkspaceFile) => {
        openModal(file)
    }

    const handleFolderDoubleClick = (folder: FolderWithChildrenCount) => {
        navigate(routes.folder(folder.id))
    }
    
    useEffect(() => {
        clearSelection()
    }, [folderId, clearSelection])
    
    if (folderId && isError) {
        return (
            <LayoutBodyContainer>
                <NotFoundState
                    title='Folder not found'
                    message='This folder doesn’t exist or may have been deleted.'
                    action={ { label: 'Back to files', to: routes.files } }
                />
            </LayoutBodyContainer>
        )
    }

    if (folderId && !isSuccess) {
        return (
            <LayoutBodyContainer>
                <div className='flex grow items-center justify-center text-gray-400'>
                    <ButtonSpinner className='w-8 h-8 text-gray-300' />
                </div>
            </LayoutBodyContainer>
        )
    }

    if (folderData && folderData.folder.deletedAt) {
        return (
            <LayoutBodyContainer>
                <NotFoundState
                    title='Folder not found'
                    message='This folder has been deleted.'
                    action={ { label: 'Back to files', to: routes.files } }
                />
            </LayoutBodyContainer>
        )
    }
    
    return (
        <FilesDndContext>
            <MainContent
                folderId={ folderId }
                folderData={ folderData }
                filesPageContentRef={ filesPageContentRef }
                handleFileDoubleClick={ handleFileDoubleClick }
                handleFolderDoubleClick={ handleFolderDoubleClick }
            />
            <FilePreviewModal
                open={ !!modalFile }
                file={ modalFile }
                onClose={ closeModal }
            />
        </FilesDndContext>
    )
}
