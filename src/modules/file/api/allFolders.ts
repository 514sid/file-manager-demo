import { Folder } from '@modules/file/types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type AllFoldersRequestData = {
    workspaceId: string
}

export const allFoldersRequest = async (_data: AllFoldersRequestData): Promise<Folder[]> => {
    return delay(demoDb.listAllFolders())
}

export const allFoldersQuery = (data: AllFoldersRequestData) => ({
    queryKey: ['allFolders', data],
    queryFn: async () => allFoldersRequest(data)
})
