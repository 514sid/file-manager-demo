import { ReactNode } from 'react'

export const LayoutBodyContainer = ({ children }: { children: ReactNode }) => {
    return (
        <div
            className='bg-white rounded-3xl grow flex flex-col overflow-y-auto'
            style={ { height: 'calc(100vh - 80px)' } }
        >
            { children }
        </div>
    )
}
