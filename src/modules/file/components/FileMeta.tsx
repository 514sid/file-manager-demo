import { TbCalendar, TbClock, TbDimensions, TbFileText } from 'react-icons/tb'
import { useQuery } from '@tanstack/react-query'
import { WorkspaceFile } from '../types'
import { prettySize } from '@shared/helpers/prettySize'
import { filePlaylistsQuery } from '../api/filePlaylists'

export const formatDuration = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

export const formatDate = (value: string | Date): string => {
    const date = new Date(value)

    return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const MetaRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
    <div className='flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0'>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
            { icon }
            { label }
        </div>
        <div className='text-sm text-gray-900 text-right truncate'>{ value }</div>
    </div>
)

export const FileMetaTable = ({ file }: { file: WorkspaceFile }) => (
    <div className='rounded-2xl border border-gray-100 px-4'>
        <MetaRow
            icon={ <TbFileText size={ 16 } /> }
            label='Size'
            value={ prettySize(file.size) }
        />
        { file.width && file.height && (
            <MetaRow
                icon={ <TbDimensions size={ 16 } /> }
                label='Dimensions'
                value={ `${file.width} × ${file.height}` }
            />
        ) }
        { file.duration && (
            <MetaRow
                icon={ <TbClock size={ 16 } /> }
                label='Duration'
                value={ formatDuration(file.duration) }
            />
        ) }
        <MetaRow
            icon={ <TbCalendar size={ 16 } /> }
            label='Created'
            value={ formatDate(file.createdAt) }
        />
        <MetaRow
            icon={ <TbCalendar size={ 16 } /> }
            label='Updated'
            value={ formatDate(file.updatedAt) }
        />
    </div>
)

export const FilePlaylists = ({ file }: { file: WorkspaceFile }) => {
    const { data: playlists } = useQuery(filePlaylistsQuery({ fileId: file.id, workspaceId: file.workspaceId }))

    return (
        <div className='flex flex-col gap-2'>
            <div className='text-sm font-medium text-gray-900'>Used in playlists</div>
            { !playlists?.length && (
                <div className='text-sm text-gray-500'>Not used in any playlists</div>
            ) }
            { playlists?.map(playlist => (
                <div
                    key={ playlist.id }
                    className='flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2'
                >
                    <span className='text-sm text-gray-900 truncate'>{ playlist.name }</span>
                    <span className={ `text-xs px-2 py-0.5 rounded-full ${playlist.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}` }>
                        { playlist.isPublished ? 'Published' : 'Draft' }
                    </span>
                </div>
            )) }
        </div>
    )
}
