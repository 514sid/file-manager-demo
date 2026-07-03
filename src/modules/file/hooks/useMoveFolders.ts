import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { moveFoldersRequest, MoveFoldersRequestData } from '../api/moveFolders'
import { FolderWithChildrenCount } from '../types'

type FoldersQueryData = FolderWithChildrenCount[]

export function useMoveFolders({ onSuccessMove }: { onSuccessMove?: () => void } = {}) {
    const queryClient = useQueryClient()

    const getFoldersQueryKey = (
        workspaceId: string,
        parentId: string | null | undefined
    ): QueryKey => [
        'workspaceFolders',
        {
            id: workspaceId,
            filters: {
                search: '',
                parentId: parentId || null
            }
        }
    ]

    const updateParentFolderCount = (
        parentId: string | null | undefined,
        adjustment: number,
        workspaceId: string
    ) => {
        if (!parentId) return

        queryClient.setQueriesData<FoldersQueryData>(
            { queryKey: ['workspaceFolders', { id: workspaceId }] },
            (oldData = []) => {
                return oldData.map(folder => {
                    if (folder.id === parentId) {
                        return {
                            ...folder,
                            _count: {
                                ...folder._count,
                                subfolders: Math.max(0, folder._count.subfolders + adjustment)
                            }
                        }
                    }
                    return folder
                })
            }
        )
    }

    const moveFolders = useMutation({
        mutationFn: moveFoldersRequest,
        onMutate: async (variables: MoveFoldersRequestData & { sourceParentId?: string | null }) => {
            await queryClient.cancelQueries({
                queryKey: ['workspaceFolders', { id: variables.workspaceId }]
            })

            const sourceQueryKey = getFoldersQueryKey(variables.workspaceId, variables.sourceParentId)
            const targetQueryKey = getFoldersQueryKey(variables.workspaceId, variables.targetFolderId)

            const previousSourceData = queryClient.getQueryData<FoldersQueryData>(sourceQueryKey) || []
            const previousTargetData = queryClient.getQueryData<FoldersQueryData>(targetQueryKey) || []

            const foldersToMove = previousSourceData.filter(folder =>
                variables.folderIds.includes(folder.id)
            )

            queryClient.setQueryData<FoldersQueryData>(sourceQueryKey, oldData => 
                (oldData || []).filter(f => !variables.folderIds.includes(f.id))
            )

            queryClient.setQueryData<FoldersQueryData>(targetQueryKey, oldData => [
                ...(oldData || []),
                ...foldersToMove.map(f => ({ ...f, parentId: variables.targetFolderId }))
            ])

            updateParentFolderCount(
                variables.sourceParentId,
                -variables.folderIds.length,
                variables.workspaceId
            )
            updateParentFolderCount(
                variables.targetFolderId,
                variables.folderIds.length,
                variables.workspaceId
            )

            return {
                previousSourceData,
                previousTargetData,
                sourceQueryKey,
                targetQueryKey,
                foldersToMove
            }
        },
        onError: (_error, variables, context) => {
            if (!context) return

            if (context.previousSourceData) {
                queryClient.setQueryData(context.sourceQueryKey, context.previousSourceData)
            }

            if (context.previousTargetData) {
                queryClient.setQueryData(context.targetQueryKey, context.previousTargetData)
            }

            if (context.foldersToMove?.length) {
                updateParentFolderCount(
                    variables.sourceParentId,
                    context.foldersToMove.length,
                    variables.workspaceId
                )
                updateParentFolderCount(
                    variables.targetFolderId,
                    -context.foldersToMove.length,
                    variables.workspaceId
                )
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['workspaceFolders', { id: variables.workspaceId }]
            })
            onSuccessMove?.()
        }
    })

    return { moveFolders }
}