import { Button } from '@shared/ui/buttons/Button'

type Props = {
    title: string
    message: string
    action?: { label: string, to: string }
}

export const NotFoundState = ({ title, message, action }: Props) => {
    return (
        <div className='flex flex-col grow items-center justify-center text-center gap-5 py-24 select-none'>
            <svg
                width='170'
                height='150'
                viewBox='0 0 170 150'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
            >
                <circle
                    cx='85'
                    cy='70'
                    r='58'
                    fill='#F1F5F9'
                />
                <rect
                    x='53'
                    y='32'
                    width='56'
                    height='70'
                    rx='9'
                    fill='#FFFFFF'
                    stroke='#CBD5E1'
                    strokeWidth='2.5'
                />
                <path
                    d='M64 52h34M64 64h34M64 76h22'
                    stroke='#E2E8F0'
                    strokeWidth='4'
                    strokeLinecap='round'
                />
                <circle
                    cx='104'
                    cy='97'
                    r='21'
                    fill='#FFFFFF'
                    stroke='#94A3B8'
                    strokeWidth='4'
                />
                <path
                    d='M119 112l12 12'
                    stroke='#94A3B8'
                    strokeWidth='5.5'
                    strokeLinecap='round'
                />
                <path
                    d='M100 91.5a4 4 0 0 1 8 0c0 3-4 3-4 6'
                    stroke='#94A3B8'
                    strokeWidth='3'
                    strokeLinecap='round'
                    fill='none'
                />
                <circle
                    cx='104'
                    cy='104'
                    r='2'
                    fill='#94A3B8'
                />
            </svg>

            <div className='max-w-sm'>
                <h3 className='text-lg font-medium text-gray-900'>{ title }</h3>
                <p className='text-sm text-gray-500 mt-1'>{ message }</p>
            </div>

            { action && (
                <Button
                    to={ action.to }
                    color='secondary'
                    variant='soft'
                >
                    { action.label }
                </Button>
            ) }
        </div>
    )
}
