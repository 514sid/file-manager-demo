import { useContext } from 'react'
import { WorkspaceWithStatistics } from '../types'
import { WorkspaceContext } from '../contexts/WorkspaceContext'

function useWorkspace(safe?: false): WorkspaceWithStatistics
function useWorkspace(safe?: true): WorkspaceWithStatistics | undefined

function useWorkspace(safe: boolean = false) {
    const context = useContext(WorkspaceContext)

    if (!context && !safe) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider')
    }

    return context
}

export { useWorkspace }