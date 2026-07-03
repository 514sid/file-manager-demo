import React from 'react'
import { IconType } from 'react-icons/lib'
import { useNavigate } from 'react-router'
import { twMerge } from 'tailwind-merge'

type SquareSize = 'squareLarge' | 'squareBase' | 'squareSmall'

type ButtonStatus = 'idle' | 'pending' | 'success' | 'failed'

type ButtonProps = {
    size?: 'large' | 'base' | 'small' | SquareSize;
    color?: 'danger' | 'primary' | 'secondary';
    variant?: 'outline' | 'solid' | 'ghost' | 'soft';
    className?: string;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    icon?: IconType
    iconPosition?: 'left' | 'right'
    pill?: boolean
    to?: string
    status?: ButtonStatus
    statusText?: {
        idle?: string
        pending?: string
        success?: string
        failed?: string
    }
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    status?: 'success' | 'pending' | 'idle'
    statusText?: {
        success?: string
        pending?: string
        idle?: string
    }
}

const baseStyles = 'flex items-center justify-center gap-2 rounded-sm transition-colors focus:outline-hidden cursor-pointer disabled:cursor-default font-medium'

const sizeStyles = {
    large: {
        button: 'px-6 py-3 text-lg',
        icon: 'w-6 h-6 flex items-center justify-center',
    },
    base: {
        button: 'px-5 h-10 text-base',
        icon: 'w-5 h-5',
    },
    small: {
        button: 'px-2.5 h-8 text-sm leading-4',
        icon: 'w-5 h-5',
    },
    xsmall: {
        button: 'px-2.5 h-6 text-sm',
        icon: 'w-4 h-4',
    },
    squareLarge: {
        button: 'w-12 h-12 flex items-center justify-center',
        icon: 'w-6 h-6',
    },
    squareBase: {
        button: 'w-10 h-10 flex items-center justify-center',
        icon: 'w-5 h-5',
    },
    squareSmall: {
        button: 'w-8 h-8 flex items-center justify-center',
        icon: 'w-5 h-5',
    },
}

const colorStyles = {
    danger: {
        outline: 'border border-red-500 text-red-500 hover:bg-red-50',
        solid: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'text-red-500 hover:bg-red-50',
        soft: 'bg-red-50 text-red-500 hover:bg-red-100',
    },
    primary: {
        outline: 'border border-primary text-primary hover:bg-blue-50',
        solid: 'bg-primary text-white hover:bg-primary-darker',
        ghost: 'text-blue-500 hover:enabled:bg-blue-100',
        soft: 'bg-blue-50 text-blue-500 hover:bg-blue-100',
    },
    secondary: {
        outline: 'border border-neutral-500 text-neutral-500 hover:bg-neutral-50',
        solid: 'text-white bg-neutral-500 hover:bg-neutral-600',
        ghost: 'text-neutral-700 hover:enabled:bg-neutral-200',
        soft: 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100',
    },
}

export const Button = ({
    size = 'base',
    color = 'primary',
    variant = 'solid',
    className = '',
    children,
    iconPosition = 'left',
    icon,
    onClick,
    pill = true,
    status = 'idle',
    statusText,
    ...props
}: ButtonProps) => {
    const navigate = useNavigate()
    const sizeClasses = sizeStyles[size]
    const combinedStyles = twMerge(
        baseStyles,
        sizeClasses.button,
        colorStyles[color][variant],
        props.disabled && 'opacity-50',
        pill && 'rounded-full',
        iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
        className,
    )

    let displayText = children
    
    if (statusText && status && statusText[status]) {
        displayText = statusText[status]
    }

    const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (props.to) {
            navigate(props.to)
            return
        }
        if (onClick) {
            onClick(e)
            return
        }
    }

    return (
        <button
            onClick={ onClickHandler }
            className={ combinedStyles }
            { ...props }
        >
            { 
                icon && React.createElement(icon, { className: sizeClasses.icon })
            }
            {
                children && (
                    <span className='flex grow justify-center'>
                        { displayText }
                    </span>
                )
            }
        </button>
    )
}
