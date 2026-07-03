import { WorkspaceFile } from '../types'
import { useState } from 'react'
import { TbFile } from 'react-icons/tb'
import { StorageService } from '@/utils/StorageService'

const getFileTypeColor = (mimeType: string, type: string) => {
    if (type === 'image' || mimeType.startsWith('image/')) return 'bg-green-50 text-green-600'
    if (mimeType.startsWith('video/')) return 'bg-purple-50 text-purple-600'
    if (mimeType.startsWith('audio/')) return 'bg-orange-50 text-orange-600'
    if (mimeType === 'application/pdf') return 'bg-red-50 text-red-600'
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'bg-emerald-50 text-emerald-600'
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'bg-amber-50 text-amber-600'
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'bg-indigo-50 text-indigo-600'
    if (mimeType.includes('text/') || mimeType.includes('javascript')) return 'bg-blue-50 text-blue-600'
    return 'bg-gray-50 text-gray-600'
}

export const FileThumbnail = ({ file }: { file: WorkspaceFile }) => {
    const [imgError, setImgError] = useState(false)
    const shouldShowPreview = (file.previewPath || file.type === 'image') && !imgError
    const iconColorClass = getFileTypeColor(file.mimeType, file.type)

    if (shouldShowPreview) {
        return (
            <img
                src={ StorageService.getFileThumbnailSrc(file.previewPath || file.path) }
                alt={ file.name }
                className="w-full h-full object-contain"
                onError={ () => setImgError(true) }
            />
        )
    }

    return (
        <div className={ `w-full h-full flex items-center justify-center ${iconColorClass}` }>
            <TbFile size={ 32 } />
        </div>
    )
}
