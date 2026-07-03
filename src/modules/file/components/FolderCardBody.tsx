import { TbFolder, TbFiles } from 'react-icons/tb'
import { FolderWithChildrenCount } from '../types'
import { FileViewMode } from '../stores/useFileViewStore'
import { formatDate } from './FileMeta'

interface FolderCardBodyProps {
    folder: FolderWithChildrenCount
    view?: FileViewMode
}

export const FolderCardBody = ({ folder, view = 'list' }: FolderCardBodyProps) => {
    const childrenCount = folder._count.files + folder._count.subfolders
    const countLabel = `${childrenCount} ${childrenCount === 1 ? 'item' : 'items'}`

    if (view === 'cards') {
        return (
            <div className='flex gap-3 w-full items-center'>
                <div className='flex-shrink-0'>
                    <div className='w-16 h-16 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600'>
                        <TbFolder size={ 28 } />
                    </div>
                </div>

                <div className='flex-1 min-w-0'>
                    <h3
                        className='text-sm font-medium text-gray-900 truncate mb-1'
                        title={ folder.name }
                    >
                        { folder.name }
                    </h3>

                    <div className='flex items-center gap-2 text-xs text-gray-500'>
                        <TbFiles size={ 12 } />
                        <span>{ countLabel }</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex items-center gap-3 w-full'>
            <div className='w-9 h-9 shrink-0 rounded-md flex items-center justify-center bg-amber-50 text-amber-600'>
                <TbFolder size={ 18 } />
            </div>
            <div
                className='flex-1 min-w-0 text-sm font-medium text-gray-900 truncate'
                title={ folder.name }
            >
                { folder.name }
            </div>
            <div className='w-32 shrink-0 text-xs text-gray-500'>
                Folder
            </div>
            <div className='w-24 shrink-0 text-xs text-gray-500 text-right'>
                { countLabel }
            </div>
            <div className='w-40 shrink-0 text-xs text-gray-500'>
                { formatDate(folder.updatedAt) }
            </div>
        </div>
    )
}
