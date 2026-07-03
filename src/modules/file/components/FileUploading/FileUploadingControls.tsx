import { FileUploadingData } from '../../types'
import { Button } from '@/shared/ui/buttons/Button'
import { fileUploadService } from '../../services/FileUploadService'
import { TbPlayerPlay, TbPlayerPause, TbX, TbRotate } from 'react-icons/tb'

export const FileUploadingControls = ({ data }: { data: FileUploadingData }) => {
    const { id, status, session, error } = data

    const isPaused = status === 'paused'
    const isUploading = status === 'uploading'
    const hasError = status === 'error' || error

    const handleResume = () => {
        if (hasError && !session) {
            fileUploadService.restartUploading(id)
        } else if (session) {
            fileUploadService.resumeFile(id)
        }
    }

    const handlePause = () => {
        fileUploadService.pauseUpload(id)
    }

    const handleCancel = () => {
        fileUploadService.cancelUpload(id)
    }

    return (
        <div className="flex items-center gap-2">
            { hasError && (
                <Button
                    onClick={ handleResume }
                    size="small"
                    color="primary"
                    icon={ TbRotate }
                >
                    Retry
                </Button>
            ) }

            { isPaused && !hasError && (
                <Button
                    onClick={ handleResume }
                    size="small"
                    color="primary"
                    icon={ TbPlayerPlay }
                >
                    Resume
                </Button>
            ) }

            { isUploading && (
                <Button
                    onClick={ handlePause }
                    size="small"
                    color="secondary"
                    variant="outline"
                    icon={ TbPlayerPause }
                >
                    Pause
                </Button>
            ) }

            <Button
                onClick={ handleCancel }
                size="small"
                color="danger"
                variant="ghost"
                icon={ TbX }
            >
                Cancel
            </Button>
        </div>
    )
}