import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type DeleteFoldersRequestData = {
    folderIds: string[]
    workspaceId: string
}

export const deleteFoldersRequest = async (data: DeleteFoldersRequestData) => {
    demoDb.deleteFolders(data.folderIds)

    return delay({ success: true })
}
