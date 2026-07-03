import { create } from 'zustand'
import { WorkspaceFile, FolderWithChildrenCount } from '@modules/file/types'

export type MoveTarget = {
    fileIds: string[]
    folderIds: string[]
    currentParentId: string | null
}

export type EntityModal =
    | { kind: 'renameFile', file: WorkspaceFile }
    | { kind: 'renameFolder', folder: FolderWithChildrenCount }
    | { kind: 'move', target: MoveTarget }
    | null

type EntityModalStore = {
    modal: EntityModal
    openModal: (modal: EntityModal) => void
    closeModal: () => void
}

export const useEntityModalStore = create<EntityModalStore>((set) => ({
    modal: null,
    openModal: (modal) => set({ modal }),
    closeModal: () => set({ modal: null }),
}))
