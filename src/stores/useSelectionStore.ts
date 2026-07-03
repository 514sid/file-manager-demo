import { create } from 'zustand'

interface WithId {
    id: string
}

interface SelectionStore {
    selectedItems: Record<string, { item: WithId, entity: 'file' | 'folder' }>
    isDragging: boolean
    lastSelectedIndex: number | null
    selectItem: (data: { item: WithId, entity: 'file' | 'folder' }) => void
    setSelectedItems: (items: Record<string, { item: WithId, entity: 'file' | 'folder' }>) => void
    unselectItem: (id: string) => void
    unselectAllItems: () => void
    clearSelection: () => void
    getSelectedItems: () => { item: WithId, entity: 'file' | 'folder' }[]
    getEntity: () => 'file' | 'folder' | null
    isSelected: (id: string) => boolean
    setDragging: (isDragging: boolean) => void
    handleItemClick: <T extends WithId>(
        item: T, 
        index: number, 
        event: React.MouseEvent, 
        items: T[], 
        entity: 'file' | 'folder'
    ) => void
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
    selectedItems: {},
    isDragging: false,
    lastSelectedIndex: null,

    selectItem: ({ item, entity }) =>
        set((state) => {
            const selectedItemsArray = Object.values(state.selectedItems)
            const currentEntity = selectedItemsArray.length > 0 ? selectedItemsArray[0].entity : null
            
            if (currentEntity && currentEntity !== entity) {
                return {
                    selectedItems: {
                        [item.id]: { item, entity },
                    },
                }
            }
            
            return {
                selectedItems: {
                    ...state.selectedItems,
                    [item.id]: { item, entity },
                },
            }
        }),

    setSelectedItems: (items) =>
        set(() => ({ selectedItems: items })),

    unselectItem: (id) =>
        set((state) => {
            const { [id]: _, ...rest } = state.selectedItems

            return { selectedItems: rest }
        }),

    unselectAllItems: () =>
        set(() => ({ selectedItems: {} })),

    clearSelection: () =>
        set(() => ({ selectedItems: {} })),

    getSelectedItems: () =>
        Object.values(get().selectedItems),

    getEntity: () => {
        const values = Object.values(get().selectedItems)

        return values.length > 0 ? values[0].entity : null
    },

    isSelected: (id) =>
        Boolean(get().selectedItems[id]),

    setDragging: (isDragging) =>
        set(() => ({ isDragging })),

    handleItemClick: <T extends WithId>(
        item: T, 
        index: number, 
        event: React.MouseEvent, 
        items: T[], 
        entity: 'file' | 'folder'
    ) => {
        const state = get()
        const isCtrl = event.ctrlKey || event.metaKey
        const isShift = event.shiftKey
        const alreadySelected = state.isSelected(item.id)

        if (isShift && state.lastSelectedIndex !== null) {
            const start = Math.min(state.lastSelectedIndex, index)
            const end = Math.max(state.lastSelectedIndex, index)

            const selectedItems = items.slice(start, end + 1).map((item) => ({
                [item.id]: { item, entity }
            }))

            set({ 
                selectedItems: Object.assign({}, ...selectedItems),
                lastSelectedIndex: index
            })
        } else if (isCtrl) {
            if (alreadySelected) {
                state.unselectItem(item.id)
            } else {
                state.selectItem({ item, entity })
            }
            set({ lastSelectedIndex: index })
        } else {
            set({
                selectedItems: {
                    [item.id]: { item, entity }
                },
                lastSelectedIndex: index
            })
        }
    },
}))