import { useRef, useState } from 'react'
import { useUploadingPageLeaveInterceptor } from '../hooks/useUploadingPageLeaveInterceptor'
import { LayoutBodyContainer } from '@shared/components/LayoutBodyContainer'
import { ScrollArea } from '@shared/ui/ScrollArea'
import { FileUploadingCard } from '../components/FileUploading/FileUploadingCard'
import { useFileUploadState } from '../hooks/useFileUploadState'
import { TbCheck, TbUpload, TbCloudUpload } from 'react-icons/tb'
import { fileUploadService } from '../services/FileUploadService'
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace'
import { twMerge } from 'tailwind-merge'

export const WorkspaceFileUploadPage = () => {
    const { activeFiles, completedFiles } = useFileUploadState()
    const { id: workspaceId } = useWorkspace()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    useUploadingPageLeaveInterceptor()

    const handleFiles = (files: FileList | null) => {
        if (files) {
            fileUploadService.addFiles(Array.from(files), workspaceId, null)

            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false)
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <LayoutBodyContainer>
            <ScrollArea verticalMargin={ 24 }>
                <div 
                    className={ twMerge(
                        'p-7 min-h-screen transition-all duration-200 relative'
                    ) }
                    onDrop={ handleDrop }
                    onDragOver={ handleDragOver }
                    onDragLeave={ handleDragLeave }
                >
                    <div className='max-w-screen-md w-full mx-auto'>
                        <input
                            ref={ fileInputRef }
                            type="file"
                            className="hidden"
                            multiple
                            onChange={ handleFilesChange }
                        />

                        { isDragOver && (
                            <div className="absolute inset-0 bg-blue-500/10 z-50 flex items-center justify-center rounded-lg">
                                <div className="bg-white rounded-lg p-8 shadow-2xl">
                                    <div className="flex flex-col items-center gap-4">
                                        <TbCloudUpload className="w-16 h-16 text-blue-500" />
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                Drop files to upload
                                            </h3>
                                            <p className="text-gray-600">
                                                Release to start uploading your files
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) }

                        <div
                            className="text-center py-20 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                            onClick={ handleButtonClick }
                        >
                            <TbCloudUpload className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                            <h2 className="text-2xl font-medium mb-2">Upload Files</h2>
                            <p className="text-lg mb-4">Drag and drop files here or click to browse</p>
                            <p className="text-sm text-gray-400">Maximum file size: 5 GB</p>
                        </div>

                        { activeFiles.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4 text-lg font-medium text-gray-900">
                                    <TbUpload className="w-5 h-5 text-blue-500" />
                                    Active Uploads ({ activeFiles.length })
                                </div>
                                <div className="space-y-3">
                                    { activeFiles.map((data) => (
                                        <FileUploadingCard
                                            data={ data }
                                            key={ data.id }
                                        />
                                    )) }
                                </div>
                            </div>
                        ) }

                        { completedFiles.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-lg font-medium text-gray-900">
                                    <TbCheck className="w-5 h-5 text-green-500" />
                                    Completed Uploads ({ completedFiles.length })
                                </div>
                                <div className="space-y-3">
                                    { completedFiles.map((data) => (
                                        <FileUploadingCard
                                            data={ data }
                                            key={ data.id }
                                        />
                                    )) }
                                </div>
                            </div>
                        ) }
                    </div>
                </div>
            </ScrollArea>
        </LayoutBodyContainer>
    )
}
