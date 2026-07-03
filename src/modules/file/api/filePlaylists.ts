import { delay } from '@/demo/latency'

type Playlist = {
    id: string
    name: string
    isPublished: boolean
}

export type FilePlaylistsRequestData = {
    fileId: string
    workspaceId: string
}

const SAMPLE_PLAYLISTS: Record<string, Playlist[]> = {
    'file-hero': [
        { id: 'pl-1', name: 'Lobby Screens', isPublished: true },
        { id: 'pl-2', name: 'Storefront Loop', isPublished: false },
    ],
    'file-intro': [
        { id: 'pl-3', name: 'Welcome Sequence', isPublished: true },
    ],
    'file-vid-1': [
        { id: 'pl-4', name: 'Brand Showcase', isPublished: true },
        { id: 'pl-5', name: 'Trade Show Reel', isPublished: true },
    ],
}

export const filePlaylistsRequest = async (data: FilePlaylistsRequestData): Promise<Playlist[]> => {
    return delay(SAMPLE_PLAYLISTS[data.fileId] ?? [])
}

export const filePlaylistsQuery = (data: FilePlaylistsRequestData) => ({
    queryKey: ['filePlaylists', data],
    queryFn: async () => filePlaylistsRequest(data)
})
