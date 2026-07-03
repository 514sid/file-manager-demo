import { FileUploadingData, FileUploadConfig } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { demoDb } from '@/demo/db'
import { queryClientConfig } from '@config/queryClientConfig'

const DEFAULT_CONFIG: FileUploadConfig = {
    chunkSize: 20 * 1024 * 1024,
    maxConcurrentUploads: 3,
    timeout: 30000,
}

const TICK_MS = 150

type UploadStateListener = (queue: FileUploadingData[]) => void

export class FileUploadService {
    private queue: FileUploadingData[] = []
    private currentlyUploading = new Set<string>()
    private timers: Map<string, ReturnType<typeof setInterval>> = new Map()
    private listeners: UploadStateListener[] = []
    private config: FileUploadConfig
    private isDestroyed = false

    constructor(config: Partial<FileUploadConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }
    }

    subscribe(listener: UploadStateListener) {
        if (this.isDestroyed) return () => {}

        this.listeners.push(listener)
        listener(this.queue)

        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    private notifyListeners() {
        if (this.isDestroyed) return
        this.listeners.forEach(listener => listener([...this.queue]))
    }

    getQueue() {
        return [...this.queue]
    }

    getCurrentlyUploading() {
        return Array.from(this.currentlyUploading)
    }

    isUploading(id: string) {
        return this.currentlyUploading.has(id)
    }

    addFiles(files: File[], workspaceId: string, folderId: string | null = null) {
        if (this.isDestroyed) return

        const addedFiles: FileUploadingData[] = files.map(file => ({
            id: uuidv4(),
            file,
            workspaceId,
            folderId,
            session: null,
            progress: 0,
            status: 'pending',
            error: null,
            retryCount: 0,
            completed: false,
        }))

        this.queue = [...this.queue, ...addedFiles]
        this.notifyListeners()
        this.startNextPendingUpload()

        return addedFiles
    }

    async cancelUpload(id: string) {
        if (this.isDestroyed) return

        this.stopTimer(id)
        this.currentlyUploading.delete(id)
        this.queue = this.queue.filter(file => file.id !== id)
        this.notifyListeners()
        this.startNextPendingUpload()
    }

    pauseUpload(id: string) {
        if (this.isDestroyed) return

        this.stopTimer(id)
        this.currentlyUploading.delete(id)
        this.updateFile(id, { status: 'paused' })
        this.startNextPendingUpload()
    }

    resumeFile(id: string) {
        if (this.isDestroyed) return

        this.updateFile(id, {
            error: null,
            errorMessage: undefined,
            status: 'pending',
        })
        this.startNextPendingUpload()
    }

    async restartUploading(id: string) {
        if (this.isDestroyed) return

        const fileData = this.queue.find(f => f.id === id)

        if (!fileData) return

        this.stopTimer(id)
        this.currentlyUploading.delete(id)

        this.updateFile(id, {
            error: null,
            errorMessage: undefined,
            progress: 0,
            session: null,
            retryCount: 0,
            status: 'pending',
            completed: false,
        })
        this.startNextPendingUpload()
    }

    async emptyQueue() {
        if (this.isDestroyed) return

        this.queue.forEach(file => this.stopTimer(file.id))
        this.currentlyUploading.clear()
        this.queue = []
        this.notifyListeners()
    }

    private stopTimer(id: string) {
        const timer = this.timers.get(id)

        if (timer) {
            clearInterval(timer)
            this.timers.delete(id)
        }
    }

    private updateFile(id: string, updates: Partial<FileUploadingData>) {
        if (this.isDestroyed) return

        this.queue = this.queue.map(file =>
            file.id === id ? { ...file, ...updates } : file
        )
        this.notifyListeners()
    }

    private startNextPendingUpload() {
        if (this.isDestroyed) return

        const pendingFiles = this.queue.filter(file =>
            file.status === 'pending' && !this.currentlyUploading.has(file.id)
        )

        const availableSlots = this.config.maxConcurrentUploads - this.currentlyUploading.size
        const filesToStart = pendingFiles.slice(0, Math.max(0, availableSlots))

        filesToStart.forEach(file => {
            this.currentlyUploading.add(file.id)
            this.simulateUpload(file.id)
        })
    }

    private simulateUpload(id: string) {
        const fileData = this.queue.find(f => f.id === id)

        if (!fileData) {
            this.currentlyUploading.delete(id)
            return
        }

        const sizeMb = fileData.file.size / (1024 * 1024)
        const ticks = Math.min(60, Math.max(8, Math.round(sizeMb / 2)))
        const step = 100 / ticks

        this.updateFile(id, {
            status: 'uploading',
            startedAt: new Date(),
            session: { started: true } as unknown as FileUploadingData['session'],
        })

        const timer = setInterval(() => {
            const current = this.queue.find(f => f.id === id)

            if (!current || current.status !== 'uploading') {
                this.stopTimer(id)
                return
            }

            const next = Math.min(100, current.progress + step)

            if (next >= 100) {
                this.stopTimer(id)
                this.finishUpload(id)
            } else {
                this.updateFile(id, { progress: next })
            }
        }, TICK_MS)

        this.timers.set(id, timer)
    }

    private finishUpload(id: string) {
        this.currentlyUploading.delete(id)
        this.stopTimer(id)

        const fileData = this.queue.find(f => f.id === id)

        if (fileData && !fileData.error) {
            demoDb.addUploadedFile(
                fileData.file.name,
                fileData.file.size,
                fileData.file.type,
                fileData.folderId
            )

            queryClientConfig.invalidateQueries({ queryKey: ['workspaceFiles'] })
            queryClientConfig.invalidateQueries({ queryKey: ['workspaceFolders'] })

            this.updateFile(id, {
                status: 'completed',
                progress: 100,
                completedAt: new Date(),
                completed: true,
            })
        }

        this.startNextPendingUpload()
    }

    destroy() {
        this.isDestroyed = true
        this.emptyQueue()
        this.listeners = []
        this.timers.clear()
        this.currentlyUploading.clear()
    }
}

export const fileUploadService = new FileUploadService()
