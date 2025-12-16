export function useStorage() {
    const get = (key, defaultValue = null) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || defaultValue
        } catch {
            return defaultValue
        }
    }

    const set = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    }

    const remove = (key) => {
        localStorage.removeItem(key)
    }

    const clear = () => {
        localStorage.clear()
    }

    return {
        get,
        set,
        remove,
        clear
    }
}