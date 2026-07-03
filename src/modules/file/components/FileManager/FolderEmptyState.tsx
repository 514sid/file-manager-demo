export const FolderEmptyState = () => {
    return (
        <div className='flex flex-col items-center justify-center text-center py-24 gap-5 select-none'>
            <svg
                width='160'
                height='140'
                viewBox='0 0 160 140'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
            >
                <circle
                    cx='80'
                    cy='68'
                    r='58'
                    fill='#F1F5F9'
                />
                <rect
                    x='44'
                    y='52'
                    width='72'
                    height='50'
                    rx='8'
                    fill='#FDE68A'
                />
                <path
                    d='M40 58a8 8 0 0 1 8-8h18l8 9h38a8 8 0 0 1 8 8v37a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V58Z'
                    fill='#FCD34D'
                />
                <circle
                    cx='80'
                    cy='80'
                    r='16'
                    fill='#F59E0B'
                />
                <path
                    d='M80 73v14M73 80h14'
                    stroke='white'
                    strokeWidth='2.75'
                    strokeLinecap='round'
                />
            </svg>

            <div className='max-w-sm'>
                <h3 className='text-lg font-medium text-gray-900'>This folder is empty</h3>
                <p className='text-sm text-gray-500 mt-1'>
                    Drag files here, or use <span className='font-medium text-gray-700'>Create folder</span> and <span className='font-medium text-gray-700'>Upload</span> to add content.
                </p>
            </div>
        </div>
    )
}
