import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSelectionStore } from '@stores/useSelectionStore'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { WorkspaceFile, FolderWithChildrenCount } from '../../types'

type Entity = 'file' | 'folder'
type SelItem = { item: WorkspaceFile | FolderWithChildrenCount, entity: Entity }
type Rect = { x1: number, y1: number, x2: number, y2: number }

const THRESHOLD = 4

export const MarqueeSelection = ({
    containerRef,
    folderId,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>
    folderId?: string
}) => {
    const queryClient = useQueryClient()
    const workspace = useWorkspace()
    const setSelectedItems = useSelectionStore((state) => state.setSelectedItems)

    const [rect, setRect] = useState<Rect | null>(null)
    const stateRef = useRef({
        active: false,
        moved: false,
        startX: 0,
        startY: 0,
        lookup: new Map<string, SelItem>(),
        lockedEntity: null as Entity | null,
    })

    useEffect(() => {
        const container = containerRef.current

        if (!container) return

        const buildLookup = () => {
            const lookup = new Map<string, SelItem>()

            const filesData = queryClient.getQueryData<{ data: WorkspaceFile[] }>(
                ['workspaceFiles', { id: workspace.id, filters: { search: '', folderId: folderId || null } }]
            )
            const foldersData = queryClient.getQueryData<FolderWithChildrenCount[]>(
                ['workspaceFolders', { id: workspace.id, filters: { search: '', parentId: folderId || null } }]
            )

            filesData?.data?.forEach(file => lookup.set(file.id, { item: file, entity: 'file' }))
            foldersData?.forEach(folder => lookup.set(folder.id, { item: folder, entity: 'folder' }))

            return lookup
        }

        const onMouseDown = (event: MouseEvent) => {
            if (event.button !== 0) return

            const target = event.target as HTMLElement

            if (
                target.closest('[data-entity]') ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('input') ||
                target.closest('[data-floating-ui-portal]')
            ) {
                return
            }

            const state = stateRef.current

            state.active = true
            state.moved = false
            state.startX = event.clientX
            state.startY = event.clientY
            state.lookup = buildLookup()
            state.lockedEntity = null
        }

        const applySelection = (clientX: number, clientY: number) => {
            const state = stateRef.current
            const minX = Math.min(state.startX, clientX)
            const maxX = Math.max(state.startX, clientX)
            const minY = Math.min(state.startY, clientY)
            const maxY = Math.max(state.startY, clientY)

            const cards = container.querySelectorAll<HTMLElement>('[data-entity][data-id]')

            const hits = Array.from(cards).filter(card => {
                const box = card.getBoundingClientRect()

                return box.left < maxX && box.right > minX && box.top < maxY && box.bottom > minY
            })

            if (!state.lockedEntity && hits.length) {
                state.lockedEntity = hits[0].dataset.entity as Entity
            }

            const selected: Record<string, SelItem> = {}

            if (state.lockedEntity) {
                hits.forEach(card => {
                    if (card.dataset.entity !== state.lockedEntity) return

                    const id = card.dataset.id

                    if (!id) return

                    const entry = state.lookup.get(id)

                    if (entry) selected[id] = entry
                })
            }

            setSelectedItems(selected)
        }

        const onMouseMove = (event: MouseEvent) => {
            const state = stateRef.current

            if (!state.active) return

            const dx = Math.abs(event.clientX - state.startX)
            const dy = Math.abs(event.clientY - state.startY)

            if (!state.moved && dx < THRESHOLD && dy < THRESHOLD) return

            state.moved = true
            event.preventDefault()

            const containerBox = container.getBoundingClientRect()

            setRect({
                x1: Math.min(state.startX, event.clientX) - containerBox.left,
                y1: Math.min(state.startY, event.clientY) - containerBox.top,
                x2: Math.max(state.startX, event.clientX) - containerBox.left,
                y2: Math.max(state.startY, event.clientY) - containerBox.top,
            })

            applySelection(event.clientX, event.clientY)
        }

        const onMouseUp = () => {
            const state = stateRef.current

            state.active = false
            state.moved = false
            setRect(null)
        }

        container.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)

        return () => {
            container.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [containerRef, folderId, queryClient, workspace.id, setSelectedItems])

    if (!rect) return null

    return (
        <div
            className='absolute z-20 pointer-events-none border border-blue-400 bg-blue-400/10 rounded-sm'
            style={ {
                left: rect.x1,
                top: rect.y1,
                width: rect.x2 - rect.x1,
                height: rect.y2 - rect.y1,
            } }
        />
    )
}
