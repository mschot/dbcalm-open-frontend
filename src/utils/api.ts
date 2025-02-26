import { Config } from "./config"

export const Api = {
    url: (path: string) => Config.apiUrl + path,

    getHeaders: (useAuth: boolean) => {
        let headers: Record<string, string> = {'Content-Type': 'application/json'}
        if (useAuth) {
            headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        }
        return headers
    },

    get: async (path: string, useAuth: boolean = true) => {
        const response = await fetch(Api.url(path), {
            method: 'GET',
            headers: Api.getHeaders(useAuth)
        })
        if (response.ok) {
            return await response.json()
        }

        try {
            const error = await response.json()
            throw new Error(error.status)
        } catch (e) {
            throw new Error(response.statusText)
        }
    },

    post: async (path: string, data: object, useAuth: boolean = true) => {
        const response = await fetch(Api.url(path), {
            method: 'POST',
            headers: Api.getHeaders(useAuth),
            body: JSON.stringify(data)
        })

        if (response.ok) {
            return await response.json()
        }

        try {
            const error = await response.json()
            throw new Error(error.status)
        } catch (e) {
            throw new Error(response.statusText)
        }
    },

    put: async (path: string, data: object, useAuth: boolean = true) => {
        const response = await fetch(Api.url(path), {
            method: 'PUT',
            headers: Api.getHeaders(useAuth),
            body: JSON.stringify(data)
        })

        if (response.ok) {
            return await response.json()
        }

        try {
            const error = await response.json()
            throw new Error(error.status)
        } catch (e) {
            throw new Error(response.statusText)
        }
    },

    delete: async (path: string, useAuth: boolean = true) => {
        const response = await fetch(Api.url(path), {
            method: 'DELETE',
            headers: Api.getHeaders(useAuth)
        })

        if (response.ok) {
            // If status is 204 No Content, return an empty object
            if (response.status === 204) {
                return {}
            }
            return await response.json()
        }

        try {
            const error = await response.json()
            throw new Error(error.status)
        } catch (e) {
            throw new Error(response.statusText)
        }
    }
}
