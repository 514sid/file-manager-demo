import { ReactNode } from 'react'

type Props = {
    label: string
    name: string
    children: ReactNode
}

export const InputLabelGroup = ({
    label,
    name,
    children
}: Props) => {
    return (
        <div className='flex flex-col gap-1.5'>
            <label
                className='text-neutral-500'
                htmlFor={ name }
            >
                { label }
            </label>
            { children }
        </div>
    )
}
