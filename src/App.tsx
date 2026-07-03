import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router'
import { queryClientConfig } from '@config/queryClientConfig'
import { router } from './router'

export const App = () => {
    return (
        <StrictMode>
            <QueryClientProvider client={ queryClientConfig }>
                <RouterProvider router={ router } />
            </QueryClientProvider>
        </StrictMode>
    )
}
