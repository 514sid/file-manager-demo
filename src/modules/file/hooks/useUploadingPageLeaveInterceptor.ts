import { useConfirmationDialogStore } from '@stores/useConfirmationDialogStore'
import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router'
import { fileUploadService } from '../services/FileUploadService'
import { FileUploadingData } from '../types'

export const useUploadingPageLeaveInterceptor = () => {
    const [queue, setQueue] = useState<FileUploadingData[]>([])
    const { confirm } = useConfirmationDialogStore()

    const isUploading = queue.length > 0 && queue.some(item => item.progress < 100 || item.error)

    const blocker = useBlocker(isUploading)

    useEffect(() => {
        const unsubscribe = fileUploadService.subscribe(setQueue)

        const handleBlocker = async () => {
            if (blocker.state === 'blocked') {
                const confirmed = await confirm({
                    title: 'Leave page?',
                    message: 'You have incomplete file uploads. If you leave now, your upload progress will be lost.',
                    confirmText: 'Leave',
                    cancelText: 'Stay',
                    variant: 'danger',
                })

                if (confirmed) {
                    fileUploadService.emptyQueue()
                    blocker.proceed()
                } else {
                    blocker.reset()
                }
            }
        }

        handleBlocker()

        return () => {
            unsubscribe()
            fileUploadService.emptyQueue()
        }
    }, [blocker, confirm])
}