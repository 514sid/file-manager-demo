import React, { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

type InputProps = {
    size?: 'small' | 'base' | 'large'
    color?: keyof typeof colorStyles
    variant?: 'outline' | 'ghost';
    affix?: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

const baseStyles = 'rounded-sm focus:outline-hidden w-full transition-colors'

const sizeStyles: { [key: string]: string } = {
    large: 'px-6 py-3 text-lg',
    base: 'px-4 py-2 text-base',
    small: 'px-2 py-1 text-sm',
}

const colorStyles: { [key: string]: { [key: string]: string } } = {
    primary: {
        outline: 'bg-white border border-neutral-200 text-neutral-900 focus:border-primary',
        ghost: 'bg-transparent border border-transparent text-neutral-900',
    },
}

export const Input = ({
    size = 'base',
    color = 'primary',
    variant = 'outline',
    affix,
    className = '',
    ...props
}: InputProps) => {
    const affixRef = React.useRef<HTMLSpanElement>(null)
    const [affixWidth, setAffixWidth] = React.useState(0)

    useEffect(() => {
        if (affixRef.current) {
            setAffixWidth(affixRef.current.offsetWidth)
        }
    }, [affix])

    const combinedStyles = twMerge(
        baseStyles,
        sizeStyles[size],
        colorStyles[color][variant],
        className
    )

    return (
        <div className="relative flex items-center w-full">
            { affix && (
                <span
                    ref={ affixRef }
                    className="absolute left-3 text-neutral-400 select-none"
                >
                    { affix }
                </span>
            ) }
            <input
                className={ twMerge(
                    combinedStyles,
                ) }
                style={ affix ? { paddingLeft: affixWidth + 20 } : {} }
                { ...props }
            />
        </div>
    )
}