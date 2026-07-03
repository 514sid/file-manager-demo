import { useState } from 'react'
import { useNavigate } from 'react-router'
import { TbArrowUpRight, TbDownload } from 'react-icons/tb'
import { Modal } from '@shared/ui/modal/Modal'
import { Button } from '@shared/ui/buttons/Button'
import { ButtonSpinner } from '@shared/ui/buttons/ButtonSpinner'
import { StorageService } from '@/utils/StorageService'
import { useWorkspaceRoutes } from '@modules/workspace/hooks/useWorkspaceRoutes'
import { WorkspaceFile } from '../types'
import { FileMetaTable, FilePlaylists } from './FileMeta'

type FilePreviewModalProps = {
    open: boolean
    file: WorkspaceFile | null
    onClose: () => void
}

const FilePreview = ({ file }: { file: WorkspaceFile }) => {
    const [loading, setLoading] = useState(true)

    return (
        <>
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
                    className={ `w-full h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}` }
                    onLoad={ () => setLoading(false) }
                    onError={ () => setLoading(false) }
                />
            ) }
            { file.type === 'video' && (
                <video
                    key={ file.path }
                    src={ StorageService.getFileSrc(file.path) }
                    className={ `w-full h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}` }
                    controls
                    onCanPlay={ () => setLoading(false) }
                />
            ) }
        </>
    )
}

export const FilePreviewModal = ({ open, file, onClose }: FilePreviewModalProps) => {
    const navigate = useNavigate()
    const routes = useWorkspaceRoutes()

    if (!file) return null

    return (
        <Modal
            open={ open }
            onOpenChange={ (next) => { if (!next) onClose() } }
            showClose
            fullscreenWithMargin
        >
            <div className='flex flex-row grow min-h-0'>
                <div className='relative flex items-center justify-center grow bg-black overflow-hidden'>
                    <FilePreview file={ file } />
                </div>

                <div className='flex flex-col gap-5 w-[340px] shrink-0 overflow-y-auto p-7'>
                    <div>
                        <div
                            className='text-lg font-semibold text-gray-900 break-words'
                            title={ file.name }
                        >
                            { file.name }
                        </div>
                        <div className='text-sm text-gray-500 mt-1'>{ file.mimeType }</div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Button
                            onClick={ () => navigate(routes.file(file.id), { replace: true }) }
                            size='small'
                            icon={ TbArrowUpRight }
                        >
                            Open full page
                        </Button>
                        <Button
                            onClick={ () => window.open(StorageService.getFileSrc(file.path), '_blank', 'noopener') }
                            size='small'
                            color='secondary'
                            variant='soft'
                            icon={ TbDownload }
                        >
                            Download
                        </Button>
                    </div>

                    <FileMetaTable file={ file } />

                    <FilePlaylists file={ file } />
                </div>
            </div>
        </Modal>
    )
}
