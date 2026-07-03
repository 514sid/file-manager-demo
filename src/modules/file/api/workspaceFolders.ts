import { FolderWithChildrenCount } from '@modules/file/types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type WorkspaceFoldersRequestData = {
    id: string
    filters: {
        search?: string | null
        parentId?: string | null
    }
}

export const workspaceFoldersRequest = async (data: WorkspaceFoldersRequestData): Promise<FolderWithChildrenCount[]> => {
    return delay(demoDb.listFolders(data.filters.parentId ?? null, data.filters.search))
}

export const workspaceFoldersQuery = (
    data: WorkspaceFoldersRequestData
) => ({
    queryKey: ['workspaceFolders', data],
    queryFn: async () => workspaceFoldersRequest(data)
})
