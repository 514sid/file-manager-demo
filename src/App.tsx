import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router'
import { queryClientConfig } from '@config/queryClientConfig'
import { router } from './router'
import { GlobalContextMenu } from '@shared/components/GlobalContextMenu'

export const App = () => {
    return (
        <StrictMode>
            <QueryClientProvider client={ queryClientConfig }>
                <RouterProvider router={ router } />
                <GlobalContextMenu />
            </QueryClientProvider>
        </StrictMode>
    )
}
