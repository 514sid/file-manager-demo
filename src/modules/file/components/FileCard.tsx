import { createElement, forwardRef } from 'react'
import React from 'react'
import { FileCardBody } from './FileCardBody'
import { WorkspaceFile } from '../types'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { DraggableWrapper } from '@shared/components/DraggableWrapper'
import { FileViewMode } from '../stores/useFileViewStore'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
    file: WorkspaceFile
    isDragging?: boolean
    view?: FileViewMode
}

export const FileCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ file, view = 'list', onClick, onDoubleClick, onContextMenu, ...props }, ref) => {
    const { isSelected, isDragging } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        isDragging: state.isDragging,
    })))

    const selected = isSelected(file.id)

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        onContextMenu?.(event)
    }

    return (
        <div
            { ...props }
            data-entity="file"
            data-id={ file.id }
            className={ [
                'cursor-default outline-none transition-[background-color] duration-200 border',
                view === 'cards' ? 'p-4 rounded-xl' : 'px-3 py-1.5 rounded-lg',
                selected
                    ? 'bg-blue-50 border-blue-200'
                    : `${view === 'list' ? 'border-transparent' : ''} ${!isDragging ? 'hover:bg-gray-50' : ''}`,
                (isDragging && selected) && 'opacity-50'
            ].join(' ') }
            ref={ ref }
            onClick={ onClick }
            onDoubleClick={ onDoubleClick }
            onContextMenu={ handleContextMenu }
        >
            { createElement(FileCardBody, { file, view }) }
        </div>
    )
})

export const DraggableFileCard = (props: { file: WorkspaceFile, view?: FileViewMode, onClick?: (e: React.MouseEvent) => void, onDoubleClick?: (e: React.MouseEvent) => void, onContextMenu?: (e: React.MouseEvent) => void }) => {
    const { file, view, onClick, onDoubleClick, onContextMenu } = props

    return (
        <DraggableWrapper
            id={ file.id }
            data={ { file } }
            action="dragFile"
        >
            <FileCard
                file={ file }
                view={ view }
                onClick={ onClick }
                onDoubleClick={ onDoubleClick }
                onContextMenu={ onContextMenu }
            />
        </DraggableWrapper>
    )
}