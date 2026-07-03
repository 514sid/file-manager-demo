import { ButtonElement } from '@/types'
import { useState } from 'react'
import { Modal } from '@shared/ui/modal/Modal'
import { CreateFolderModal } from '../modals/CreateFolderModal'

type Props = {
    children: ButtonElement
    parentId: string | null
}

export const CreateFolderButton = ({ children, parentId }: Props) => {
    const [open, setOpen] = useState(false)

    const Component = children

    return (
        <Modal
            open={ open }
            title="Create folder"
            onOpenChange={ setOpen }
            trigger={ Component }
        >
            <div className='max-w-[500px]'>
                <CreateFolderModal 
                    onClose={ () => setOpen(false) }
                    parentId={ parentId }
                />
            </div>
        </Modal>
    )
}
