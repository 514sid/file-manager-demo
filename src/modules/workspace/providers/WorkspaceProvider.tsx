import { Outlet } from 'react-router'
import { WorkspaceContext } from '../contexts/WorkspaceContext'
import { DEMO_WORKSPACE } from '@/demo/workspace'

export const WorkspaceProvider = () => {
    return (
        <WorkspaceContext.Provider value={ DEMO_WORKSPACE }>
            <Outlet />
        </WorkspaceContext.Provider>
    )
}
