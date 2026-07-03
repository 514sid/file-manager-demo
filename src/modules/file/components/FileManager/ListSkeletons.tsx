import { useFileViewStore } from '../../stores/useFileViewStore'

const block = 'bg-gray-100 rounded'

const cardsGrid = 'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4'
const filesCardsGrid = 'grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4'

const ListRowSkeleton = () => (
    <div className='flex items-center gap-3 px-3 py-1.5'>
        <div className={ `${block} w-9 h-9 rounded-md shrink-0` } />
        <div className='flex-1 min-w-0'>
            <div className={ `${block} h-3 w-40 max-w-full` } />
        </div>
        <div className={ `${block} h-3 w-32 shrink-0` } />
        <div className={ `${block} h-3 w-24 shrink-0` } />
        <div className={ `${block} h-3 w-40 shrink-0` } />
    </div>
)

const FolderCardSkeleton = () => (
    <div className='p-4 rounded-xl border border-transparent flex items-center gap-3'>
        <div className={ `${block} w-16 h-16 rounded-lg shrink-0` } />
        <div className='flex-1 space-y-2'>
            <div className={ `${block} h-3 w-2/3` } />
            <div className={ `${block} h-2 w-1/3` } />
        </div>
    </div>
)

const FileCardSkeleton = () => (
    <div className='p-4 rounded-xl border border-transparent flex flex-col gap-3'>
        <div className={ `${block} w-full aspect-[4/3]` } />
        <div className='space-y-2'>
            <div className={ `${block} h-3 w-3/4` } />
            <div className={ `${block} h-2 w-1/2` } />
        </div>
    </div>
)

export const FolderListSkeleton = () => {
    const mode = useFileViewStore((state) => state.mode)

    if (mode === 'cards') {
        return (
            <div className={ `animate-pulse ${cardsGrid}` }>
                { Array.from({ length: 4 }).map((_, i) => (
                    <FolderCardSkeleton key={ i } />
                )) }
            </div>
        )
    }

    return (
        <div className='animate-pulse flex flex-col'>
            { Array.from({ length: 4 }).map((_, i) => (
                <ListRowSkeleton key={ i } />
            )) }
        </div>
    )
}

export const FileListSkeleton = () => {
    const mode = useFileViewStore((state) => state.mode)

    if (mode === 'cards') {
        return (
            <div className={ `animate-pulse ${filesCardsGrid}` }>
                { Array.from({ length: 8 }).map((_, i) => (
                    <FileCardSkeleton key={ i } />
                )) }
            </div>
        )
    }

    return (
        <div className='animate-pulse flex flex-col'>
            { Array.from({ length: 6 }).map((_, i) => (
                <ListRowSkeleton key={ i } />
            )) }
        </div>
    )
}
