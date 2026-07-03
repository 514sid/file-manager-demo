import { Folder } from '@modules/file/types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type RenameFolderRequestData = {
    folderId: string
    workspaceId: string
    name: string
}

export const renameFolderRequest = async (data: RenameFolderRequestData): Promise<Folder> => {
    const folder = demoDb.renameFolder(data.folderId, data.name)

    if (!folder) {
        throw new Error('Folder not found')
    }

    return delay(folder)
}
