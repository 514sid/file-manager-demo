import { FileUploadingData } from '../../types'
import { FileUploadingControls } from './FileUploadingControls'
import { TbFile, TbCheck, TbX, TbAlertCircle, TbPlayerPause, TbUpload } from 'react-icons/tb'
import { twMerge } from 'tailwind-merge'

const getStatusIcon = (status: FileUploadingData['status'], error: FileUploadingData['error'] | null) => {
    if (error) return TbX
    if (status === 'completed') return TbCheck
    if (status === 'error') return TbAlertCircle
    if (status === 'paused') return TbPlayerPause
    if (status === 'uploading') return TbUpload
    return TbFile
}

const getStatusColor = (status: FileUploadingData['status'], error: FileUploadingData['error'] | null) => {
    if (error || status === 'error') return 'text-red-500 bg-red-50'
    if (status === 'completed') return 'text-green-500 bg-green-50'
    if (status === 'paused') return 'text-yellow-500 bg-yellow-50'
    if (status === 'uploading') return 'text-blue-500 bg-blue-50'
    return 'text-gray-500 bg-gray-50'
}

const getStatusText = (status: FileUploadingData['status'], error: FileUploadingData['error'] | null) => {
    if (error) return 'Failed'
    if (status === 'completed') return 'Complete'
    if (status === 'error') return 'Error'
    if (status === 'paused') return 'Paused'
    if (status === 'uploading') return 'Uploading...'
    return 'Pending'
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const FileUploadingCard = ({ data }: { data: FileUploadingData }) => {
    const { file, progress, status, error, errorMessage } = data
    const isCompleted = status === 'completed'
    const isError = status === 'error' || error
    const isPaused = status === 'paused'
    
    const StatusIcon = getStatusIcon(status, error)
    const statusColor = getStatusColor(status, error)
    const statusText = getStatusText(status, error)

    return (
        <div className={ twMerge(
            'relative p-4 border rounded-lg transition-all duration-200',
            isCompleted ? 'border-green-200 bg-green-50/50' : '',
            isError ? 'border-red-200 bg-red-50/50' : '',
            isPaused ? 'border-yellow-200 bg-yellow-50/50' : '',
            !isCompleted && !isError && !isPaused ? 'border-gray-200 bg-white hover:border-gray-300' : ''
        ) }
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={ twMerge(
                        'flex items-center justify-center w-10 h-10 rounded-lg',
                        statusColor
                    ) }
                    >
                        <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                            { file.name }
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>{ formatFileSize(file.size) }</span>
                            <span className={ twMerge(
                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                statusColor
                            ) }
                            >
                                { statusText }
                            </span>
                        </div>
                    </div>
                </div>

                { !isCompleted && (
                    <FileUploadingControls data={ data } />
                ) }
            </div>

            { !isCompleted && (
                <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{ progress.toFixed(1) }%</span>
                        <span>{ formatFileSize((file.size * progress) / 100) } / { formatFileSize(file.size) }</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={ twMerge(
                                'h-2 rounded-full transition-all duration-300',
                                isError ? 'bg-red-500' : 'bg-blue-500'
                            ) }
                            style={ { width: `${ progress }%` } }
                        />
                    </div>
                </div>
            ) }

            { isError && errorMessage && (
                <div className="text-sm text-red-600">
                    { errorMessage }
                </div>
            ) }
        </div>
    )
}