import { createBrowserRouter, Navigate } from 'react-router'
import { ComponentsProvider } from '@/providers/ComponentsProvider'
import { WorkspaceProvider } from '@modules/workspace/providers/WorkspaceProvider'
import { DemoLayout } from '@/demo/DemoLayout'
import { workspaceFileRoutes } from '@modules/file/workspaceFileRoutes'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter([
    {
        element: <ComponentsProvider />,
        children: [
            {
                element: <WorkspaceProvider />,
                children: [
                    {
                        index: true,
                        element: <Navigate
                            to='/workspaces/demo/files'
                            replace
                        />
                    },
                    {
                        path: 'workspaces/:slug',
                        element: <DemoLayout />,
                        children: [
                            workspaceFileRoutes
                        ]
                    },
                    {
                        path: '*',
                        element: <Navigate
                            to='/workspaces/demo/files'
                            replace
                        />
                    }
                ]
            }
        ]
    }
], { basename })
