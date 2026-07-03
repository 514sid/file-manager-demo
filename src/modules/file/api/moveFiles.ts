import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type MoveFilesRequestData = {
    fileIds: string[]
    targetFolderId: string | null
    workspaceId: string
}

export const moveFilesRequest = async (data: MoveFilesRequestData) => {
    demoDb.moveFiles(data.fileIds, data.targetFolderId)

    return delay({ success: true })
}
