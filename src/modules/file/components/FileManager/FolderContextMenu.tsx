import { ContextMenu } from '@shared/ui/ContextMenu'
import { FolderWithChildrenCount } from '../../types'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'

interface FolderContextMenuProps {
    anchorPoint: { x: number; y: number }
    open: boolean
    onClose: () => void
    data: unknown
}

export const FolderContextMenu = ({ anchorPoint, open, onClose, data }: FolderContextMenuProps) => {
    const { isSelected, getSelectedItems } = useSelectionStore(useShallow((state) => ({
        isSelected: state.isSelected,
        getSelectedItems: state.getSelectedItems,
    })))

    const clickedFolder = data as FolderWithChildrenCount

    const foldersToActOn = (() => {
        const isClickedFolderSelected = isSelected(clickedFolder.id)

        if (isClickedFolderSelected) {
            return getSelectedItems()
                .filter(item => item.entity === 'folder')
                .map(item => item.item as FolderWithChildrenCount)
        } else {
            return [clickedFolder]
        }
    })()

    const isSingle = foldersToActOn.length === 1

    const options = [
        ...(isSingle ? [
            { label: 'Rename', action: () => console.log('Rename', foldersToActOn) },
        ] : []),
        { label: 'Move', action: () => console.log('Move', foldersToActOn) },
        { label: 'Delete', action: () => console.log('Delete', foldersToActOn) },
    ]

    return (
        <ContextMenu
            anchorPoint={ anchorPoint }
            open={ open }
            onClose={ onClose }
            options={ options }
        />
    )
} 