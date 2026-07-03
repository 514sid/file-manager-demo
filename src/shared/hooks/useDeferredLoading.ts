import { useState, useEffect, useRef } from 'react'

/**
 * 
 * This hook is an adaptation of the `useSpinDelay` hook from https://github.com/smeijer/spin-delay.
 * 
 * MIT License
 * 
 * Copyright (c) 2020 Stephan Meijer
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

type DeferredLoadingOptions = {
    delay?: number;
    minDuration?: number;
}

export const defaultOptions = {
    delay: 500,
    minDuration: 200,
}

export const useDeferredLoading = (
    loading: boolean,
    options?: DeferredLoadingOptions,
) => {
    const { delay, minDuration } = { ...defaultOptions, ...options }
    const [isLoading, setIsLoading] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (loading && !isLoading) {
            timeoutRef.current = setTimeout(() => {
                setIsLoading(true)
            }, delay)
        }

        if (!loading && isLoading) {
            timeoutRef.current = setTimeout(() => {
                setIsLoading(false)
            }, minDuration)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [loading, isLoading, delay, minDuration])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return isLoading
}