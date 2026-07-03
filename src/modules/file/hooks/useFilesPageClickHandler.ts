import { RefObject, useEffect } from 'react'

type UseFilesPageClickHandlerProps = {
    filesPageContentRef: RefObject<HTMLDivElement | null>
    getEntity: () => string | null
    clearSelection: () => void
}

export function useFilesPageClickHandler({
    filesPageContentRef,
    getEntity,
    clearSelection,
}: UseFilesPageClickHandlerProps) {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const currentEntity = getEntity()

            if (!currentEntity || !filesPageContentRef.current) return

            const isInsideFilesPage = filesPageContentRef.current.contains(target)

            const isClickOnContextMenu = target.closest('[data-floating-ui-portal]') || target.closest('[data-floating-ui]')

            if (isClickOnContextMenu) {
                return
            }

            if (!isInsideFilesPage) {
                clearSelection()
                return
            }

            const isClickOnFile = target.closest('[data-entity="file"]')
            const isClickOnFolder = target.closest('[data-entity="folder"]')

            if (currentEntity === 'file' && !isClickOnFile) {
                clearSelection()
            } else if (currentEntity === 'folder' && !isClickOnFolder) {
                clearSelection()
            }
        }

        document.addEventListener('mousedown', handleClick)

        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [getEntity, clearSelection, filesPageContentRef])
} 