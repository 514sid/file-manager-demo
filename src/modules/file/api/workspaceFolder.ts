import { Folder, ParentFolderTreeResult } from '@modules/file/types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

export type WorkspaceFolderRequestData = {
    folderId: string
    workspaceId: string
}

export type WorkspaceFolderRequestResponse = {
    folder: Folder
    parentFolders: ParentFolderTreeResult[]
}

export const workspaceFolderRequest = async (data: WorkspaceFolderRequestData): Promise<WorkspaceFolderRequestResponse> => {
    const result = demoDb.getFolder(data.folderId)

    if (!result) {
        throw new Error('Folder not found')
    }

    return delay(result)
}

export const workspaceFolderQuery = (
    data: WorkspaceFolderRequestData
) => ({
    queryKey: ['workspaceFolder', data],
    queryFn: async () => workspaceFolderRequest(data)
})
