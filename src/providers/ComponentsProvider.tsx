import { ConfirmationDialog } from '@shared/components/ConfirmationDialog'
import { Outlet } from 'react-router'

export const ComponentsProvider = () => {
    return (
        <>
            <ConfirmationDialog />
            <Outlet />
        </>
    )
}
