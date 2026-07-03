import { WorkspaceFile } from '@modules/file/types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type WorkspaceFileRequestData = {
    fileId: string
    workspaceId: string
}

export const workspaceFileRequest = async (data: WorkspaceFileRequestData): Promise<WorkspaceFile> => {
    const file = demoDb.getFile(data.fileId)

    if (!file) {
        throw new Error('File not found')
    }

    return delay(file)
}

export const workspaceFileQuery = (
    data: WorkspaceFileRequestData
) => ({
    queryKey: ['workspaceFile', data],
    queryFn: async () => workspaceFileRequest(data)
})
