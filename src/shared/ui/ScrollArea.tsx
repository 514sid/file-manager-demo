import { ReactNode } from 'react'
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'

export const ScrollArea = ({ children, verticalMargin }: { children: ReactNode, verticalMargin?: number }) => {
    return (
        <ScrollAreaPrimitive.Root className="flex flex-col grow rounded overflow-hidden bg-white min-h-0">
            <ScrollAreaPrimitive.Viewport>
                { children }
            </ScrollAreaPrimitive.Viewport>

            <ScrollAreaPrimitive.Scrollbar
                className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-[160ms] ease-out hover:bg-transparent data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                style={ { marginTop: verticalMargin, marginBottom: verticalMargin } }
                orientation="vertical"
            >
                <ScrollAreaPrimitive.Thumb className="flex-1 bg-black/20 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[22px] before:min-h-[44px]" />
            </ScrollAreaPrimitive.Scrollbar>

            <ScrollAreaPrimitive.Scrollbar
                className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-[160ms] ease-out hover:bg-transparent data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                orientation="horizontal"
            >
                <ScrollAreaPrimitive.Thumb className="flex-1 bg-black/20 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[22px] before:min-h-[44px]" />
            </ScrollAreaPrimitive.Scrollbar>

            <ScrollAreaPrimitive.Corner className="bg-blackA5" />
        </ScrollAreaPrimitive.Root>
    )
}
