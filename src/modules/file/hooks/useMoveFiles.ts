import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { moveFilesRequest, MoveFilesRequestData } from '../api/moveFiles'
import { WorkspaceFile, FolderWithChildrenCount } from '../types'

type FilesQueryData = {
    data: WorkspaceFile[]
    [key: string]: unknown
}

type FoldersQueryData = FolderWithChildrenCount[]

export function useMoveFiles({ onSuccessMove }: { onSuccessMove?: () => void } = {}) {
    const queryClient = useQueryClient()

    const getFilesQueryKey = (workspaceId: string, folderId: string | null | undefined): QueryKey => [
        'workspaceFiles', 
        { 
            id: workspaceId,
            filters: {
                search: '',
                folderId: folderId || null
            }
        }
    ]

    const updateSourceFiles = (sourceQueryKey: QueryKey, fileIds: string[]) => {
        queryClient.setQueryData(sourceQueryKey, (oldData: FilesQueryData | undefined) => {
            if (!oldData?.data) return oldData
            return {
                ...oldData,
                data: oldData.data.filter(file => !fileIds.includes(file.id))
            }
        })
    }

    const updateTargetFiles = (
        targetQueryKey: QueryKey, 
        sourceQueryKey: QueryKey, 
        fileIds: string[], 
        targetFolderId: string | null | undefined
    ) => {
        queryClient.setQueryData(targetQueryKey, (oldData: FilesQueryData | undefined) => {
            if (!oldData?.data) return oldData
      
            const sourceData = queryClient.getQueryData(sourceQueryKey) as FilesQueryData | undefined
            const filesToMove = sourceData?.data?.filter(file => fileIds.includes(file.id)) || []
      
            const movedFiles = filesToMove.map(file => ({ 
                ...file, 
                folderId: targetFolderId 
            }))
      
            return {
                ...oldData,
                data: [...oldData.data, ...movedFiles]
            }
        })
    }

    const updateFolderCount = (
        folderId: string | null | undefined, 
        adjustment: number,
        allFoldersQueries: [QueryKey, FoldersQueryData][]
    ) => {
        if (folderId === null || folderId === undefined) return

        allFoldersQueries.forEach(([queryKey, foldersData]) => {
            if (!foldersData) return

            const updatedFolders = foldersData.map(folder => {
                if (folder.id === folderId) {
                    return {
                        ...folder,
                        _count: {
                            ...folder._count,
                            files: Math.max(0, folder._count.files + adjustment)
                        }
                    }
                }
                return folder
            })

            queryClient.setQueryData(queryKey, updatedFolders)
        })
    }

    const moveFiles = useMutation({
        mutationFn: moveFilesRequest,
        onMutate: async (variables: MoveFilesRequestData & { sourceFolderId?: string | null }) => {
            await queryClient.cancelQueries({ queryKey: ['workspaceFiles'] })
            await queryClient.cancelQueries({ queryKey: ['workspaceFolders'] })

            const sourceQueryKey = getFilesQueryKey(variables.workspaceId, variables.sourceFolderId)
            const targetQueryKey = getFilesQueryKey(variables.workspaceId, variables.targetFolderId)
      
            const previousSourceData = queryClient.getQueryData(sourceQueryKey)
            const previousTargetData = queryClient.getQueryData(targetQueryKey)
      
            const allFoldersQueries = queryClient.getQueriesData<FoldersQueryData>({ 
                queryKey: ['workspaceFolders'] 
            }) as [QueryKey, FoldersQueryData][]

            updateTargetFiles(
                targetQueryKey, 
                sourceQueryKey, 
                variables.fileIds, 
                variables.targetFolderId
            )
            updateSourceFiles(sourceQueryKey, variables.fileIds)

            updateFolderCount(variables.sourceFolderId, -variables.fileIds.length, allFoldersQueries)
            updateFolderCount(variables.targetFolderId, variables.fileIds.length, allFoldersQueries)

            return { 
                previousSourceData, 
                previousTargetData, 
                sourceQueryKey, 
                targetQueryKey, 
                allFoldersQueries 
            }
        },
        onError: (_err, _variables, context) => {
            if (!context) return

            if (context.previousSourceData) {
                queryClient.setQueryData(context.sourceQueryKey, context.previousSourceData)
            }
            if (context.previousTargetData) {
                queryClient.setQueryData(context.targetQueryKey, context.previousTargetData)
            }
            if (context.allFoldersQueries) {
                context.allFoldersQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFolders'] })
            onSuccessMove?.()
        }
    })

    return { moveFiles }
}