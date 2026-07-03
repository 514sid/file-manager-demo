import { WorkspaceFilesPage } from './pages/WorkspaceFilesPage'
import { WorkspaceFileUploadPage } from './pages/WorkspaceFileUploadPage'
import { WorkspaceFilePage } from './pages/WorkspaceFilePage'

export const workspaceFileRoutes = {
    path: 'files',
    children: [
        {
            path: '',
            element: <WorkspaceFilesPage />,
        },
        {
            path: 'upload',
            element: <WorkspaceFileUploadPage />
        },
        {
            path: ':fileId',
            element: <WorkspaceFilePage />
        },
        {
            path: 'folders',
            children: [
                {
                    path: ':folderId',
                    element: <WorkspaceFilesPage />,
                }
            ]
        }
    ]
}