import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { ModalClose } from '@shared/ui/modal/Modal'
import { Input } from '@shared/ui/input/Input'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { handleAxiosFieldErrors } from '@shared/helpers/handleAxiosFieldErrors'
import { createFolderRequest, CreateFolderRequestData } from '../../api/createFolder'
import { FolderWithChildrenCount } from '../../types'

type Props = {
    onClose: () => void
    parentId: string | null
}

export const CreateFolderModal = ({ onClose, parentId }: Props) => {
    const workspace = useWorkspace()
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<CreateFolderRequestData>({
        defaultValues: {
            name: '',
            parentId,
            workspaceId: workspace.id
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateFolderRequestData) => createFolderRequest(data),
        onSuccess: async (createdFolder) => {
            const queryKey = ['workspaceFolders', { 
                id: workspace.id, 
                filters: { 
                    search: '',
                    parentId 
                } 
            }]
            
            queryClient.setQueryData(queryKey, (oldData: FolderWithChildrenCount[] | undefined) => {
                if (!oldData) return oldData
                
                const newFolder: FolderWithChildrenCount = {
                    ...createdFolder,
                    _count: {
                        files: 0,
                        subfolders: 0
                    }
                }
                
                return [...oldData, newFolder]
            })

            queryClient.invalidateQueries({
                queryKey: ['workspaceFolders', { id: workspace.id, filters: { parentId } }],
            })
            
            onClose()
        },
        onError: (error) => {
            handleAxiosFieldErrors<CreateFolderRequestData>(error, setError)
        }
    })

    const onSubmit: SubmitHandler<CreateFolderRequestData> = (data) => {
        mutate(data)
    }
	  
    return (
        <div className='px-7 flex flex-col gap-5 mt-5'>
            <div className='flex flex-col items-start gap-4'>
                <form
                    onSubmit={ handleSubmit(onSubmit) }
                    className='w-full flex flex-col gap-2'
                >
                    <InputLabelGroup
                        label='Folder name'
                        name='name'
                    >
                        <Controller
                            name='name'
                            control={ control }
                            render={ ({ field }) => (
                                <Input
                                    { ...field }
                                    autoComplete='off'
                                    placeholder='Enter folder name'
                                />
                            ) }
                        />
                        <InputError error={ errors.name?.message }/>
                    </InputLabelGroup>
                </form>
            </div>
            <div className='flex gap-5 justify-end'>
                <ModalClose asChild>
                    <Button
                        color='secondary'
                        variant='soft'
                    >
                        Cancel
                    </Button>
                </ModalClose>
                <Button
                    disabled={ isPending }
                    onClick={ () => handleSubmit(onSubmit)() }
                >
                    Create folder
                </Button>
            </div>
        </div>
    )
} 