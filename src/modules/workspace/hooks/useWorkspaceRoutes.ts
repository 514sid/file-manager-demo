import { useMemo } from 'react'
import { useWorkspace } from './useWorkspace'

export const useWorkspaceRoutes = (slug?: string) => {
    const workspace = useWorkspace(true)
    const workspaceSlug = slug || workspace?.slug || ''
    const routePrefix = `/workspaces/${workspaceSlug}`

    const routes = useMemo(() => {
        const createRoute = (path: string) => `${routePrefix}/${path}`

        return {
            home: routePrefix,
            screens: createRoute('screens'),
            screen: (screenId: string) => createRoute(`screens/${screenId}`),
            files: createRoute('files'),
            playlists: createRoute('playlists'),
            playlistLayouts: createRoute('layouts'),
            settings: createRoute('settings'),
            filesUpload: createRoute('files/upload'),
            members: createRoute('members'),
            folder: (folderId: string) => createRoute(`files/folders/${folderId}`),
            file: (fileId: string) => createRoute(`files/${fileId}`),
            playlist: (playlistId: string) => createRoute(`playlists/${playlistId}`),
            playlistEditDetails: (playlistId: string) => createRoute(`playlists/${playlistId}/edit`),
            playlistLayout: (playlistLayoutId: string) => createRoute(`layouts/${playlistLayoutId}`),
            playlistSchedules: (playlistId: string) => createRoute(`playlists/${playlistId}/schedules`),
            playlistScreens: (playlistId: string) => createRoute(`playlists/${playlistId}/screens`),
            playlistContentManager: (playlistId: string) => createRoute(`playlists/${playlistId}/content`),
            playlistLayoutEditor: (playlistLayoutId: string) => createRoute(`layouts/${playlistLayoutId}/edit`),
            playlistLayoutPlaylists: (playlistLayoutId: string) => createRoute(`layouts/${playlistLayoutId}/playlists`),
            workspaceMembersList: createRoute('members/list'),
        }
    }, [routePrefix])

    return routes
}
