import { createElement, forwardRef } from 'react'
import React from 'react'
import { FolderWithChildrenCount } from '../types'
import { FolderCardBody } from './FolderCardBody'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'
import { DraggableWrapper } from '@shared/components/DraggableWrapper'
import { DroppableWrapper } from '@shared/components/DroppableWrapper'
import { FileViewMode } from '../stores/useFileViewStore'

interface PlaylistSectionItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
    folder: FolderWithChildrenCount
    isOver?: boolean
    view?: FileViewMode
    onContextMenu?: (e: React.MouseEvent) => void
    onDoubleClick?: (e: React.MouseEvent) => void
}

export const FolderCard = forwardRef<HTMLDivElement, PlaylistSectionItemCardProps>(({ folder, view = 'list', onClick, isOver, onContextMenu, onDoubleClick, ...props }, ref) => {
    const { isSelected, isDragging } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        isDragging: state.isDragging,
    })))
    const selected = isSelected(folder.id)

    return (
        <div
            onDoubleClick={ onDoubleClick }
            { ...props }
            data-entity="folder"
            data-id={ folder.id }
            className={ [
                'cursor-default outline-none transition-[background-color] duration-200 border',
                view === 'cards' ? 'p-4 rounded-xl' : 'px-3 py-1.5 rounded-lg',
                selected
                    ? 'bg-blue-50 border-blue-200'
                    : `${view === 'list' ? 'border-transparent' : ''} ${!isDragging ? 'hover:bg-gray-50' : ''}`,
                (isDragging && selected) && 'opacity-50',
                isOver && !selected && 'bg-gray-100'
            ].join(' ') }
            ref={ ref }
            onClick={ onClick }
            onContextMenu={ onContextMenu }
        >
            { createElement(FolderCardBody, { folder, view }) }
        </div>
    )
})

export const DraggableFolderCard = (props: { folder: FolderWithChildrenCount, view?: FileViewMode, onClick?: (e: React.MouseEvent) => void, onContextMenu?: (e: React.MouseEvent) => void, onDoubleClick?: (e: React.MouseEvent) => void }) => {
    const { folder, view, onClick, onContextMenu, onDoubleClick } = props

    return (
        <DroppableWrapper
            id={ folder.id }
            isOverClassName="bg-gray-100"
        >
            <DraggableWrapper
                id={ folder.id }
                data={ { folder } }
                action="dragFolder"
            >
                <FolderCard
                    folder={ folder }
                    view={ view }
                    onClick={ onClick }
                    onContextMenu={ onContextMenu }
                    onDoubleClick={ onDoubleClick }
                />
            </DraggableWrapper>
        </DroppableWrapper>
    )
}