import { TbFolder, TbFile } from 'react-icons/tb'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useShallow } from 'zustand/react/shallow'

export const DragOverlayContent = () => {
    const { selectedItems, getEntity } = useSelectionStore(useShallow((state) => ({
        selectedItems: state.selectedItems,
        getEntity: state.getEntity,
    })))

    const selectedCount = Object.keys(selectedItems).length
    const selectedEntity = getEntity()

    const isFile = selectedEntity === 'file'
    const Icon = isFile ? TbFile : TbFolder
    const label = isFile ? 'file' : 'folder'
    const labelPlural = isFile ? 'files' : 'folders'

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-2xl shadow-black/10 w-[275px]">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">
                <Icon size={ 20 } />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                    { selectedCount } { selectedCount === 1 ? label : labelPlural }
                </span>
                <span className="text-xs text-gray-500">
                    { isFile ? 'Media files' : 'Folders' } selected
                </span>
            </div>
        </div>
    )
} 