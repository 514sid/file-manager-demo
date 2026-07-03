import { create } from 'zustand'

type ContextMenuType = 'file' | 'folder' | 'playlist' | 'screen'

type ContextMenuState = {
    open: boolean
    anchorPoint: { x: number; y: number }
    type: ContextMenuType | null
    data: unknown
    openContextMenu: (type: ContextMenuType, data: unknown, x: number, y: number) => void
    closeContextMenu: () => void
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
    open: false,
    anchorPoint: { x: 0, y: 0 },
    type: null,
    data: null,
    
    openContextMenu: (type: ContextMenuType, data: unknown, x: number, y: number) => 
        set({ open: true, anchorPoint: { x, y }, type, data }),
    
    closeContextMenu: () => 
        set({ open: false, type: null, data: null }),
}))