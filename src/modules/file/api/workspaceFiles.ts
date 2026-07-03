import { PaginationMeta } from '@/types'
import { WorkspaceFile } from '../types'
import { demoDb } from '@/demo/db'
import { delay } from '@/demo/latency'

type WorkspaceFilesRequestResponse = {
    data: WorkspaceFile[]
    meta: PaginationMeta
}

export type WorkspaceFilesRequestData = {
    id: string
    filters: {
        search?: string | null
        folderId?: string | null
    }
}

export const workspaceFilesRequest = async (data: WorkspaceFilesRequestData): Promise<WorkspaceFilesRequestResponse> => {
    const files = demoDb.listFiles(data.filters.folderId ?? null, data.filters.search)

    const meta: PaginationMeta = {
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        limit: files.length,
        total: files.length,
        totalPages: 1,
    }

    return delay({ data: files, meta })
}

export const workspaceFilesQuery = (data: WorkspaceFilesRequestData) => ({
    queryKey: ['workspaceFiles', data],
    queryFn: async () => workspaceFilesRequest(data)
})
