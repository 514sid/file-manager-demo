import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { useSelectionStore } from '@stores/useSelectionStore'
import { ModalClose } from '@shared/ui/modal/Modal'
import { Button } from '@shared/ui/buttons/Button'
import { TbFolder, TbHome, TbCheck } from 'react-icons/tb'
import { allFoldersQuery } from '../../api/allFolders'
import { moveFilesRequest } from '../../api/moveFiles'
import { moveFoldersRequest } from '../../api/moveFolders'
import { Folder } from '../../types'
import { MoveTarget } from '../../stores/useEntityModalStore'

type Props = {
    target: MoveTarget
    onClose: () => void
}

type TreeRow = { folder: Folder, depth: number }

const buildTree = (folders: Folder[], excluded: Set<string>): TreeRow[] => {
    const byParent = new Map<string | null, Folder[]>()

    folders.forEach(folder => {
        const key = folder.parentId ?? null
        const list = byParent.get(key) ?? []

        list.push(folder)
        byParent.set(key, list)
    })

    const rows: TreeRow[] = []

    const walk = (parentId: string | null, depth: number) => {
        const children = (byParent.get(parentId) ?? []).sort((a, b) => a.name.localeCompare(b.name))

        children.forEach(folder => {
            if (excluded.has(folder.id)) return
            rows.push({ folder, depth })
            walk(folder.id, depth + 1)
        })
    }

    walk(null, 0)

    return rows
}

const collectDescendants = (folders: Folder[], rootIds: string[]): Set<string> => {
    const excluded = new Set(rootIds)
    let changed = true

    while (changed) {
        changed = false
        folders.forEach(folder => {
            if (folder.parentId && excluded.has(folder.parentId) && !excluded.has(folder.id)) {
                excluded.add(folder.id)
                changed = true
            }
        })
    }

    return excluded
}

export const MoveEntitiesModal = ({ target, onClose }: Props) => {
    const workspace = useWorkspace()
    const queryClient = useQueryClient()
    const clearSelection = useSelectionStore((state) => state.clearSelection)
    const [destination, setDestination] = useState<string | null>(target.currentParentId)

    const { data: folders = [] } = useQuery(allFoldersQuery({ workspaceId: workspace.id }))

    const excluded = collectDescendants(folders, target.folderIds)
    const rows = buildTree(folders, excluded)

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            if (target.fileIds.length) {
                await moveFilesRequest({ fileIds: target.fileIds, targetFolderId: destination, workspaceId: workspace.id })
            }
            if (target.folderIds.length) {
                await moveFoldersRequest({ folderIds: target.folderIds, targetFolderId: destination, workspaceId: workspace.id })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFile'] })
            clearSelection()
            onClose()
        }
    })

    const unchanged = destination === target.currentParentId

    const Option = ({ id, label, depth, icon }: { id: string | null, label: string, depth: number, icon: React.ReactNode }) => {
        const selected = destination === id

        return (
            <button
                type='button'
                onClick={ () => setDestination(id) }
                style={ { paddingLeft: 12 + depth * 20 } }
                className={ [
                    'w-full flex items-center gap-2 pr-3 py-2 rounded-lg text-sm text-left transition-colors',
                    selected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ].join(' ') }
            >
                { icon }
                <span className='truncate flex-1'>{ label }</span>
                { selected && <TbCheck size={ 16 } /> }
            </button>
        )
    }

    return (
        <div className='px-7 flex flex-col gap-5 mt-5'>
            <div className='flex flex-col gap-0.5 max-h-[320px] overflow-y-auto -mx-1 px-1'>
                <Option
                    id={ null }
                    label='Files (root)'
                    depth={ 0 }
                    icon={ <TbHome size={ 16 } className='text-gray-400 shrink-0' /> }
                />
                { rows.map(({ folder, depth }) => (
                    <Option
                        key={ folder.id }
                        id={ folder.id }
                        label={ folder.name }
                        depth={ depth + 1 }
                        icon={ <TbFolder size={ 16 } className='text-amber-500 shrink-0' /> }
                    />
                )) }
            </div>
            <div className='flex gap-5 justify-end'>
                <ModalClose asChild>
                    <Button
                        color='secondary'
                        variant='soft'
                    >
                        Cancel
                    </Button>
                </ModalClose>
                <Button
                    disabled={ isPending || unchanged }
                    onClick={ () => mutate() }
                >
                    Move here
                </Button>
            </div>
        </div>
    )
}
