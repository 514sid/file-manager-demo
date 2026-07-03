import { v4 as uuidv4 } from 'uuid'
import { WorkspaceFile, Folder, FolderWithChildrenCount, ParentFolderTreeResult } from '@modules/file/types'
import { DEMO_WORKSPACE } from './workspace'

const STORAGE_KEY = 'file-manager-demo:db'
const SCHEMA_VERSION = 4

type RawFile = Omit<WorkspaceFile, 'size'> & { size: number }

type RawFolder = {
    id: string
    name: string
    parentId: string | null
    workspaceId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

type DbShape = {
    version: number
    files: RawFile[]
    folders: RawFolder[]
}

const wsId = DEMO_WORKSPACE.id

const img = (seed: string, w = 640, h = 480) =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`

const SAMPLE_VIDEO = 'https://media.w3.org/2010/05/sintel/trailer.mp4'

const now = '2026-06-01T10:00:00.000Z'

const makeImage = (id: string, name: string, folderId: string | null, seed: string, size: number, w: number, h: number): RawFile => ({
    id,
    workspaceId: wsId,
    name,
    uniqueName: `${id}-${name}`,
    previewPath: img(seed, 320, 320),
    defaultDuration: 10,
    size,
    type: 'image',
    path: img(seed, w, h),
    mimeType: 'image/jpeg',
    width: w,
    height: h,
    duration: null,
    md5: id,
    folderId,
    availabilityStartAt: null,
    availabilityEndAt: null,
    createdAt: '2026-05-20',
    updatedAt: now,
    deletedAt: null,
    uploaderId: DEMO_WORKSPACE.id,
})

const makeVideo = (id: string, name: string, folderId: string | null, seed: string, size: number, duration: number): RawFile => ({
    id,
    workspaceId: wsId,
    name,
    uniqueName: `${id}-${name}`,
    previewPath: img(seed, 320, 320),
    defaultDuration: duration,
    size,
    type: 'video',
    path: SAMPLE_VIDEO,
    mimeType: 'video/mp4',
    width: 1920,
    height: 1080,
    duration,
    md5: id,
    folderId,
    availabilityStartAt: null,
    availabilityEndAt: null,
    createdAt: '2026-05-18',
    updatedAt: now,
    deletedAt: null,
    uploaderId: DEMO_WORKSPACE.id,
})

const makeFolder = (id: string, name: string, parentId: string | null): RawFolder => ({
    id,
    name,
    parentId,
    workspaceId: wsId,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
})

function seed(): DbShape {
    const marketing = makeFolder('folder-marketing', 'Marketing', null)
    const products = makeFolder('folder-products', 'Product Shots', null)
    const videos = makeFolder('folder-videos', 'Video Ads', null)
    const empty = makeFolder('folder-empty', 'Empty Folder', null)
    const q1 = makeFolder('folder-q1', 'Q1 Campaign', 'folder-marketing')
    const q2 = makeFolder('folder-q2', 'Q2 Campaign', 'folder-marketing')

    const folders = [marketing, products, videos, empty, q1, q2]

    const files: RawFile[] = [
        makeImage('file-hero', 'hero-banner.jpg', null, 'hero', 2_400_000, 1920, 1080),
        makeImage('file-promo', 'summer-promo.jpg', null, 'promo', 1_800_000, 1600, 900),
        makeImage('file-logo', 'company-logo.png', null, 'logo', 240_000, 800, 800),
        makeVideo('file-intro', 'intro-clip.mp4', null, 'intro', 15_700_000, 45),

        makeImage('file-mkt-1', 'billboard-a.jpg', 'folder-marketing', 'bill-a', 3_100_000, 1920, 1080),
        makeImage('file-mkt-2', 'billboard-b.jpg', 'folder-marketing', 'bill-b', 2_900_000, 1920, 1080),

        makeImage('file-q1-1', 'newyear-offer.jpg', 'folder-q1', 'ny', 1_200_000, 1080, 1080),
        makeVideo('file-q1-2', 'q1-teaser.mp4', 'folder-q1', 'teaser', 22_400_000, 30),

        makeImage('file-prod-1', 'sneaker-front.jpg', 'folder-products', 'sneaker1', 980_000, 1200, 1200),
        makeImage('file-prod-2', 'sneaker-side.jpg', 'folder-products', 'sneaker2', 1_020_000, 1200, 1200),
        makeImage('file-prod-3', 'watch-closeup.jpg', 'folder-products', 'watch', 1_340_000, 1500, 1000),

        makeVideo('file-vid-1', 'brand-story.mp4', 'folder-videos', 'brand', 48_200_000, 90),
        makeVideo('file-vid-2', 'testimonial.mp4', 'folder-videos', 'testim', 33_600_000, 60),
    ]

    return { version: SCHEMA_VERSION, files, folders }
}

function load(): DbShape {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)

        if (raw) {
            const parsed = JSON.parse(raw) as DbShape

            if (parsed.version === SCHEMA_VERSION) {
                return parsed
            }
        }
    } catch {
        void 0
    }

    const fresh = seed()

    save(fresh)

    return fresh
}

function save(db: DbShape) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

const toWorkspaceFile = (raw: RawFile): WorkspaceFile => ({ ...raw, size: BigInt(raw.size) })

const toFolder = (raw: RawFolder): Folder => ({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
})

const withCounts = (db: DbShape, raw: RawFolder): FolderWithChildrenCount => ({
    ...toFolder(raw),
    _count: {
        files: db.files.filter(f => f.folderId === raw.id).length,
        subfolders: db.folders.filter(f => f.parentId === raw.id).length,
    },
})

const matchesSearch = (name: string, search?: string | null) =>
    !search || name.toLowerCase().includes(search.toLowerCase())

export const demoDb = {
    reset() {
        save(seed())
    },

    listFiles(folderId: string | null, search?: string | null): WorkspaceFile[] {
        const db = load()

        return db.files
            .filter(f => (f.folderId ?? null) === (folderId ?? null))
            .filter(f => matchesSearch(f.name, search))
            .map(toWorkspaceFile)
    },

    listFolders(parentId: string | null, search?: string | null): FolderWithChildrenCount[] {
        const db = load()

        return db.folders
            .filter(f => (f.parentId ?? null) === (parentId ?? null))
            .filter(f => matchesSearch(f.name, search))
            .map(f => withCounts(db, f))
    },

    getFile(fileId: string): WorkspaceFile | null {
        const raw = load().files.find(f => f.id === fileId)

        return raw ? toWorkspaceFile(raw) : null
    },

    getFolder(folderId: string): { folder: Folder; parentFolders: ParentFolderTreeResult[] } | null {
        const db = load()
        const raw = db.folders.find(f => f.id === folderId)

        if (!raw) return null

        const parentFolders: ParentFolderTreeResult[] = []
        let cursor = raw.parentId

        while (cursor) {
            const parent = db.folders.find(f => f.id === cursor)

            if (!parent) break

            parentFolders.unshift({ id: parent.id, name: parent.name, parentId: parent.parentId })
            cursor = parent.parentId
        }

        return { folder: toFolder(raw), parentFolders }
    },

    createFolder(name: string, parentId: string | null): Folder {
        const db = load()

        const raw = makeFolder(uuidv4(), name, parentId)

        db.folders.push(raw)
        save(db)

        return toFolder(raw)
    },

    deleteFiles(fileIds: string[]) {
        const db = load()

        db.files = db.files.filter(f => !fileIds.includes(f.id))
        save(db)
    },

    deleteFolders(folderIds: string[]) {
        const db = load()
        const toRemove = new Set(folderIds)

        let changed = true

        while (changed) {
            changed = false
            for (const folder of db.folders) {
                if (folder.parentId && toRemove.has(folder.parentId) && !toRemove.has(folder.id)) {
                    toRemove.add(folder.id)
                    changed = true
                }
            }
        }

        db.folders = db.folders.filter(f => !toRemove.has(f.id))
        db.files = db.files.filter(f => !(f.folderId && toRemove.has(f.folderId)))
        save(db)
    },

    moveFiles(fileIds: string[], targetFolderId: string | null) {
        const db = load()

        db.files = db.files.map(f => (fileIds.includes(f.id) ? { ...f, folderId: targetFolderId } : f))
        save(db)
    },

    renameFolder(folderId: string, name: string): Folder | null {
        const db = load()
        const raw = db.folders.find(f => f.id === folderId)

        if (!raw) return null

        raw.name = name
        raw.updatedAt = new Date().toISOString()
        save(db)

        return toFolder(raw)
    },

    renameFile(fileId: string, name: string): WorkspaceFile | null {
        const db = load()
        const raw = db.files.find(f => f.id === fileId)

        if (!raw) return null

        raw.name = name
        raw.updatedAt = new Date().toISOString()
        save(db)

        return toWorkspaceFile(raw)
    },

    listAllFolders(): Folder[] {
        return load().folders.map(toFolder)
    },

    moveFolders(folderIds: string[], targetFolderId: string | null) {
        const db = load()

        const blocked = new Set(folderIds)

        if (targetFolderId) {
            let cursor: string | null = targetFolderId

            while (cursor) {
                if (blocked.has(cursor)) return
                const parent: RawFolder | undefined = db.folders.find(f => f.id === cursor)

                cursor = parent ? parent.parentId : null
            }
        }

        db.folders = db.folders.map(f => (folderIds.includes(f.id) ? { ...f, parentId: targetFolderId } : f))
        save(db)
    },

    addUploadedFile(name: string, size: number, mimeType: string, folderId: string | null): WorkspaceFile {
        const db = load()
        const id = uuidv4()
        const isVideo = mimeType.startsWith('video/')

        const raw: RawFile = isVideo
            ? makeVideo(id, name, folderId, id, size, 30)
            : makeImage(id, name, folderId, id, size, 1280, 720)

        raw.name = name
        raw.mimeType = mimeType || raw.mimeType
        raw.createdAt = new Date().toISOString().slice(0, 10)

        db.files.push(raw)
        save(db)

        return toWorkspaceFile(raw)
    },
}
