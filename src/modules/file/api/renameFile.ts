import { WorkspaceFile } from '@modules/file/types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type RenameFileRequestData = {
    fileId: string
    workspaceId: string
    name: string
}

export const renameFileRequest = async (data: RenameFileRequestData): Promise<WorkspaceFile> => {
    const file = demoDb.renameFile(data.fileId, data.name)

    if (!file) {
        throw new Error('File not found')
    }

    return delay(file)
}
