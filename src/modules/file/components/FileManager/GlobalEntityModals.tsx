import { Modal } from '@shared/ui/modal/Modal'
import { useEntityModalStore } from '../../stores/useEntityModalStore'
import { RenameFileModal } from '../modals/RenameFileModal'
import { RenameFolderModal } from '../modals/RenameFolderModal'
import { MoveEntitiesModal } from '../modals/MoveEntitiesModal'

export const GlobalEntityModals = () => {
    const { modal, closeModal } = useEntityModalStore()

    if (!modal) return null

    if (modal.kind === 'renameFile') {
        return (
            <Modal
                open
                title='Rename file'
                onOpenChange={ (open) => { if (!open) closeModal() } }
            >
                <div className='max-w-[500px]'>
                    <RenameFileModal
                        file={ modal.file }
                        onClose={ closeModal }
                    />
                </div>
            </Modal>
        )
    }

    if (modal.kind === 'renameFolder') {
        return (
            <Modal
                open
                title='Rename folder'
                onOpenChange={ (open) => { if (!open) closeModal() } }
            >
                <div className='max-w-[500px]'>
                    <RenameFolderModal
                        folder={ modal.folder }
                        onClose={ closeModal }
                    />
                </div>
            </Modal>
        )
    }

    const moveCount = modal.target.fileIds.length + modal.target.folderIds.length

    return (
        <Modal
            open
            title={ moveCount === 1 ? 'Move item' : `Move ${moveCount} items` }
            onOpenChange={ (open) => { if (!open) closeModal() } }
        >
            <div className='w-[500px] max-w-full'>
                <MoveEntitiesModal
                    target={ modal.target }
                    onClose={ closeModal }
                />
            </div>
        </Modal>
    )
}
