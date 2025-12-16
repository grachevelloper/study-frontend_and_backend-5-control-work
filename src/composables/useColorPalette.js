import { ref, computed } from 'vue'
import { generateRandomColor } from '../utils/colorUtils'

export function useColorPalette() {
    const colors = ref([])
    const pinned = ref(new Set())

    const generateRandom = (count = 5) => {
        colors.value = Array.from({ length: count }, () => ({
            value: generateRandomColor(),
            pinned: false
        }))
    }

    const togglePin = (index) => {
        if (pinned.has(index)) {
            pinned.delete(index)
        } else {
            pinned.add(index)
        }
        colors.value[index].pinned = pinned.has(index)
    }

    const saveToStorage = (name = 'Новая палитра') => {
        const palette = {
            id: Date.now(),
            name,
            colors: colors.value.map(c => c.value),
            createdAt: new Date().toISOString()
        }

        const saved = JSON.parse(localStorage.getItem('palettes') || '[]')
        saved.unshift(palette)
        localStorage.setItem('palettes', JSON.stringify(saved))
        return palette
    }

    return {
        colors,
        pinned,
        generateRandom,
        togglePin,
        saveToStorage
    }
}