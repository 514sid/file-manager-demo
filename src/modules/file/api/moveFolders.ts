import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type MoveFoldersRequestData = {
    folderIds: string[]
    targetFolderId: string | null
    workspaceId: string
}

export const moveFoldersRequest = async (data: MoveFoldersRequestData) => {
    demoDb.moveFolders(data.folderIds, data.targetFolderId)

    return delay({ success: true })
}
