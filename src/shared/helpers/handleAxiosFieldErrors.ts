import { isAxiosError } from 'axios'

export function handleAxiosFieldErrors<T extends Record<string, any>>(
    error: unknown,
    setError: (field: keyof T, error: { type: string; message: string }) => void
): boolean {
    if (!isAxiosError(error) || !error.response?.data?.errors) {
        return false
    }

    const errors = error.response.data.errors

    const handledFields = new Set<string>()

    for (const fieldError of errors) {
        const fieldKey = String(fieldError.field)

        if (handledFields.has(fieldKey)) continue

        const messageString = String(fieldError.message)

        setError(fieldKey as keyof T, {
            type: 'custom',
            message: messageString
        })

        handledFields.add(fieldKey)
    }

    return true
}