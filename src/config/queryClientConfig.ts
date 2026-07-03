import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

const MAX_RETRIES = 2
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404, 500, 502]

export const queryClientConfig = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (failureCount + 1 > MAX_RETRIES) {
                    return false
                }

                if (
                    isAxiosError(error) &&
					HTTP_STATUS_TO_NOT_RETRY.includes(
					    error.response?.status ?? 0
					)
                ) {
                    return false
                }

                return true
            },
        },
    },
})
