import { useEffect } from 'react'
import { useFloating, offset, flip, useClick, useDismiss, useRole, useInteractions, FloatingPortal, useFocus } from '@floating-ui/react'

interface ContextMenuOption {
    label: string
    action: () => void
}

interface ContextMenuProps {
    anchorPoint: { x: number; y: number }
    open: boolean
    onClose: () => void
    options: ContextMenuOption[]
}

export const ContextMenu = ({ anchorPoint, open, onClose, options }: ContextMenuProps) => {
    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: (o) => { if (!o) onClose() },
        placement: 'bottom-start',
        middleware: [offset(4), flip()],
    })

    const focus = useFocus(context)

    useClick(context)
    useDismiss(context)
    useRole(context, { role: 'menu' })
    useInteractions([focus, useClick(context), useDismiss(context), useRole(context, { role: 'menu' })])

    useEffect(() => {
        if (open) {
            const virtualElement = {
                getBoundingClientRect: () => ({
                    width: 0,
                    height: 0,
                    x: anchorPoint.x,
                    y: anchorPoint.y,
                    top: anchorPoint.y,
                    left: anchorPoint.x,
                    right: anchorPoint.x,
                    bottom: anchorPoint.y,
                }),
            }

            refs.setReference(virtualElement as Element)
        }
    }, [open, anchorPoint, refs])

    if (!open) return null

    return (
        <FloatingPortal>
            <div
                ref={ refs.setFloating }
                style={ floatingStyles }
                className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 select-none z-50 min-w-[200px] max-w-[300px] w-auto"
                tabIndex={ -1 }
                onContextMenu={ e => e.preventDefault() }
            >
                { options.map(option => (
                    <button
                        key={ option.label }
                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={ () => { option.action(); onClose() } }
                        type="button"
                    >
                        { option.label }
                    </button>
                )) }
            </div>
        </FloatingPortal>
    )
} 