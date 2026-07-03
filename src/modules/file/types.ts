export type FileUploadSession = {
    id: string
    name: string
    path: string
    size: string
    uploaded: string
    uploadedParts: number
    workspaceId: string
    folderId: string | null
    userId: string
    createdAt: string
    completedAt: string | null
    cancelledAt: string | null
    mimeType: string
    uploadId: string | null
}

export type FileUploadError = 
	| 'NETWORK_ERROR'
	| 'SESSION_INIT_FAILED'
	| 'FILE_TOO_LARGE'
	| 'INVALID_FILE_TYPE'
	| 'INSUFFICIENT_PERMISSIONS'
	| 'WORKSPACE_NOT_FOUND'
	| 'QUOTA_EXCEEDED'
	| 'SERVER_ERROR'
	| 'UPLOAD_CANCELLED'
	| 'TIMEOUT_ERROR'
	| 'UNKNOWN_ERROR'

export type UploadStatus = 
	| 'pending'
	| 'uploading'
	| 'paused'
	| 'completed'
	| 'error'

export type FileUploadingData = {
    id: string
    session: FileUploadSession | null
    file: File
    workspaceId: string
    folderId: string | null
    progress: number
    status: UploadStatus
    error: FileUploadError | null
    errorMessage?: string
    retryCount: number
    startedAt?: Date
    completedAt?: Date
    completed: boolean
}

export type FileUploadConfig = {
    chunkSize: number
    maxConcurrentUploads: number
    timeout: number
}

export type WorkspaceFile = {
    id: string
    workspaceId: string
    name: string
    uniqueName: string
    previewPath: string | null
    defaultDuration?: number
    size: bigint
    type: string
    path: string
    mimeType: string
    width: number | null
    height: number | null
    duration: number | null
    md5: string
    folderId: string | null
    availabilityStartAt: string | null
    availabilityEndAt: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    uploaderId: string
}

export type Folder = {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    workspaceId: string;
    parentId: string | null;
}

export type FolderWithChildrenCount = Folder & {
    _count: {
        files: number
        subfolders: number
    }
}

export type ParentFolderTreeResult = {
    id: string
    name: string
    parentId: string | null
}