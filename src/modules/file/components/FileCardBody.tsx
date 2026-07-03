import { WorkspaceFile } from '../types'
import { FileThumbnail } from './FileThumbnail'
import { prettySize } from '@shared/helpers/prettySize'
import { FileViewMode } from '../stores/useFileViewStore'
import { formatDate } from './FileMeta'

export const FileCardBody = ({ file, view = 'list' }: { file: WorkspaceFile, view?: FileViewMode }) => {
    if (view === 'cards') {
        return (
            <div className="flex flex-col gap-3 w-full">
                <div className="w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                    <FileThumbnail file={ file } />
                </div>

                <div className="min-w-0">
                    <h3
                        className="text-sm font-medium text-gray-900 truncate"
                        title={ file.name }
                    >
                        { file.name }
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{ prettySize(file.size) }</span>
                        <span>•</span>
                        <span>{ file.mimeType.split('/')[1] || file.type }</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-md bg-gray-50 border border-gray-100 overflow-hidden">
                <FileThumbnail file={ file } />
            </div>
            <div
                className="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate"
                title={ file.name }
            >
                { file.name }
            </div>
            <div className="w-32 shrink-0 text-xs text-gray-500 truncate">
                { file.mimeType.split('/')[1] || file.type }
            </div>
            <div className="w-24 shrink-0 text-xs text-gray-500 text-right">
                { prettySize(file.size) }
            </div>
            <div className="w-40 shrink-0 text-xs text-gray-500">
                { formatDate(file.updatedAt) }
            </div>
        </div>
    )
}
