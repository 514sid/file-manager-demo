import { useContextMenuStore } from '@stores/useContextMenuStore'
import { FileContextMenu } from '@modules/file/components/FileManager/FileContextMenu'
import { FolderContextMenu } from '@modules/file/components/FileManager/FolderContextMenu'

export const GlobalContextMenu = () => {
    const { open, anchorPoint, type, data, closeContextMenu } = useContextMenuStore()

    if (!open || !type) return null

    switch (type) {
        case 'file':
            return (
                <FileContextMenu
                    anchorPoint={ anchorPoint }
                    open={ open }
                    onClose={ closeContextMenu }
                    data={ data }
                />
            )
        case 'folder':
            return (
                <FolderContextMenu
                    anchorPoint={ anchorPoint }
                    open={ open }
                    onClose={ closeContextMenu }
                    data={ data }
                />
            )
        case 'playlist':
            return null
        case 'screen':
            return null
        default:
            return null
    }
} 