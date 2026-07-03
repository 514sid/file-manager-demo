import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FileViewMode = 'cards' | 'list'

type FileViewStore = {
    mode: FileViewMode
    setMode: (mode: FileViewMode) => void
}

export const useFileViewStore = create<FileViewStore>()(
    persist(
        (set) => ({
            mode: 'cards',
            setMode: (mode) => set({ mode }),
        }),
        { name: 'file-manager-demo:view-mode' }
    )
)
