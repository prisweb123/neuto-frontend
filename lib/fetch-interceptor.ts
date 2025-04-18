interface FetchOptions extends RequestInit {
    requiresAuth?: boolean
}

import { toast } from "@/hooks/use-toast"

interface ApiResponse<T = any> {
    data: T
    message?: string
    success: boolean
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchWithInterceptor<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> {
    try {
        const { requiresAuth = true, ...fetchOptions } = options

        // Prepare headers
        const headers = new Headers(fetchOptions.headers)

        // Only set Content-Type if it's not FormData
        if (!(fetchOptions.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json')
        }

        // Add authentication token if required
        if (requiresAuth) {
            const token = localStorage.getItem('token')
            if (!token) {
                toast({
                    title: "Tidsavbrutt",
                    description: "Vennligst logg inn på nytt",
                    variant: "destructive"
                })
                return {
                    data: null as T,
                    message: "Authentication token not found",
                    success: false
                }
            }
            headers.set('Authorization', `Bearer ${token}`)
        }

        // Prepare URL
        const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

        // Make the request
        const response = await fetch(url, {
            ...fetchOptions,
            headers
        })

        // Handle non-2xx responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            const errorMessage = errorData.message || `HTTP error! status: ${response.status}`

            toast({
                title: "Feil!",
                description: errorMessage,
                variant: "destructive"
            })
            return {
                data: null as T,
                message: errorMessage,
                success: false
            }
        }

        // Parse and return the response
        const data = await response.json()
        const result = {
            data: data.data || data,
            message: data.message,
            success: true
        }

        // Show success toast only for mutations (non-GET requests)
        if (options.method && options.method.toUpperCase() !== 'GET') {
            toast({
                title: endpoint.includes('login') ? "Velkommen 😃" : 'Vellykket!',
                description: data.message || "",
                variant: "default"
            })
        }

        return result
    } catch (error) {
        console.error('API Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

        toast({
            title: "Feil!",
            description: errorMessage,
            variant: "destructive"
        })
        return {
            data: null as T,
            message: errorMessage,
            success: false
        }
    }
}