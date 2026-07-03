import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { ModalClose } from '@shared/ui/modal/Modal'
import { Button } from '@shared/ui/buttons/Button'
import { TbFolder, TbHome, TbCheck } from 'react-icons/tb'
import { allFoldersQuery } from '../../api/allFolders'
import { moveFilesRequest } from '../../api/moveFiles'
import { Folder, WorkspaceFile } from '../../types'

type Props = {
    file: WorkspaceFile
    onClose: () => void
}

type TreeRow = { folder: Folder, depth: number }

const buildTree = (folders: Folder[]): TreeRow[] => {
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
            rows.push({ folder, depth })
            walk(folder.id, depth + 1)
        })
    }

    walk(null, 0)

    return rows
}

export const MoveFileModal = ({ file, onClose }: Props) => {
    const workspace = useWorkspace()
    const queryClient = useQueryClient()
    const [target, setTarget] = useState<string | null>(file.folderId)

    const { data: folders = [] } = useQuery(allFoldersQuery({ workspaceId: workspace.id }))
    const rows = buildTree(folders)

    const { mutate, isPending } = useMutation({
        mutationFn: () => moveFilesRequest({
            fileIds: [file.id],
            targetFolderId: target,
            workspaceId: workspace.id
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFile'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            onClose()
        }
    })

    const unchanged = target === file.folderId

    const Option = ({ id, label, depth, icon }: { id: string | null, label: string, depth: number, icon: React.ReactNode }) => {
        const selected = target === id

        return (
            <button
                type='button'
                onClick={ () => setTarget(id) }
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
