import { Folder } from '@modules/file/types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type CreateFolderRequestData = {
    name: string
    parentId?: string | null
    workspaceId: string
}

export const createFolderRequest = async (data: CreateFolderRequestData): Promise<Folder> => {
    return delay(demoDb.createFolder(data.name, data.parentId ?? null))
}
