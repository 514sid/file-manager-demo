import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type DeleteFilesRequestData = {
    fileIds: string[]
    workspaceId: string
}

export const deleteFilesRequest = async (data: DeleteFilesRequestData) => {
    demoDb.deleteFiles(data.fileIds)

    return delay({ success: true })
}
