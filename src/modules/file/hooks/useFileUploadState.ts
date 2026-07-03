import { useState, useEffect, useMemo } from 'react'
import { FileUploadingData } from '../types'
import { fileUploadService } from '../services/FileUploadService'

export const useFileUploadState = () => {
    const [queue, setQueue] = useState<FileUploadingData[]>([])

    useEffect(() => {
        const unsubscribe = fileUploadService.subscribe(setQueue)

        return unsubscribe
    }, [])

    const uploadStats = useMemo(() => {
        const total = queue.length
        const completed = queue.filter((file) => file.completed || file.status === 'completed').length
        const active = queue.filter((file) => !file.completed && file.status !== 'completed').length
        const uploading = queue.filter((file) => file.status === 'uploading').length
        const paused = queue.filter((file) => file.status === 'paused').length
        const error = queue.filter((file) => file.status === 'error' || file.error).length
        const pending = queue.filter((file) => file.status === 'pending').length

        return {
            total,
            completed,
            active,
            uploading,
            paused,
            error,
            pending
        }
    }, [queue])

    const activeFiles = useMemo(() => {
        return queue.filter((file) => !file.completed && file.status !== 'completed')
    }, [queue])

    const completedFiles = useMemo(() => {
        return queue.filter((file) => file.completed || file.status === 'completed')
    }, [queue])

    const errorFiles = useMemo(() => {
        return queue.filter((file) => file.status === 'error' || file.error)
    }, [queue])

    const uploadingFiles = useMemo(() => {
        return queue.filter((file) => file.status === 'uploading')
    }, [queue])

    const pausedFiles = useMemo(() => {
        return queue.filter((file) => file.status === 'paused')
    }, [queue])

    const pendingFiles = useMemo(() => {
        return queue.filter((file) => file.status === 'pending')
    }, [queue])

    const clearCompleted = () => {
        const newQueue = queue.filter((file) => !file.completed && file.status !== 'completed')

        setQueue(newQueue)
    }

    const retryAllErrors = () => {
        errorFiles.forEach((file) => {
            fileUploadService.restartUploading(file.id)
        })
    }

    const pauseAll = () => {
        uploadingFiles.forEach((file) => {
            fileUploadService.pauseUpload(file.id)
        })
    }

    const resumeAll = () => {
        pausedFiles.forEach((file) => {
            if (file.session) {
                fileUploadService.resumeFile(file.id)
            }
        })
    }

    return {
        queue,
        uploadStats,
        activeFiles,
        completedFiles,
        errorFiles,
        uploadingFiles,
        pausedFiles,
        pendingFiles,
        clearCompleted,
        retryAllErrors,
        pauseAll,
        resumeAll
    }
} 