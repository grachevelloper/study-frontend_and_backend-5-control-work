export function useColorUtils() {
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : hex
    }

    const getLuminance = (hex) => {
        const rgb = hexToRgb(hex)
        const [r, g, b] = rgb.match(/\d+/g).map(v => {
            v /= 255
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const getContrastRatio = (color1, color2) => {
        const l1 = getLuminance(color1)
        const l2 = getLuminance(color2)
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    }

    return {
        hexToRgb,
        getLuminance,
        getContrastRatio
    }
}