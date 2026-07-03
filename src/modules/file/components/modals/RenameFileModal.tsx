import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWorkspace } from '@modules/workspace/hooks/useWorkspace'
import { ModalClose } from '@shared/ui/modal/Modal'
import { Input } from '@shared/ui/input/Input'
import { InputLabelGroup } from '@shared/ui/input/InputLabelGroup'
import { InputError } from '@shared/ui/input/InputError'
import { Button } from '@shared/ui/buttons/Button'
import { renameFileRequest } from '../../api/renameFile'
import { WorkspaceFile } from '../../types'

type Props = {
    file: WorkspaceFile
    onClose: () => void
}

type FormValues = {
    name: string
}

export const RenameFileModal = ({ file, onClose }: Props) => {
    const workspace = useWorkspace()
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: { name: file.name }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (name: string) => renameFileRequest({
            fileId: file.id,
            workspaceId: workspace.id,
            name
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFile'] })
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] })
            onClose()
        },
        onError: () => {
            setError('name', { type: 'custom', message: 'Could not rename the file.' })
        }
    })

    const onSubmit: SubmitHandler<FormValues> = ({ name }) => {
        const trimmed = name.trim()

        if (!trimmed) {
            setError('name', { type: 'custom', message: 'Name is required.' })

            return
        }

        mutate(trimmed)
    }

    return (
        <div className='px-7 flex flex-col gap-5 mt-5'>
            <form
                onSubmit={ handleSubmit(onSubmit) }
                className='w-full flex flex-col gap-2'
            >
                <InputLabelGroup
                    label='File name'
                    name='name'
                >
                    <Controller
                        name='name'
                        control={ control }
                        render={ ({ field }) => (
                            <Input
                                { ...field }
                                autoComplete='off'
                                placeholder='Enter file name'
                            />
                        ) }
                    />
                    <InputError error={ errors.name?.message } />
                </InputLabelGroup>
            </form>
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
                    Save
                </Button>
            </div>
        </div>
    )
}
