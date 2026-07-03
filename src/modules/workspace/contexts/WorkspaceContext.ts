import { createContext } from 'react'
import { WorkspaceWithStatistics } from '../types'

export const WorkspaceContext = createContext<WorkspaceWithStatistics | undefined>(undefined)
