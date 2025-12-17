export function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}



export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null
}


export function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

export function generateAnalogousPalette(baseColor, count = 5) {
    const baseHsl = hexToHsl(baseColor)
    const palette = []

    for (let i = 0; i < count; i++) {
        const hue = (baseHsl.h + (i - Math.floor(count / 2)) * 30) % 360
        const saturation = Math.min(100, Math.max(30, baseHsl.s + (Math.random() * 20 - 10)))
        const lightness = Math.min(80, Math.max(20, baseHsl.l + (Math.random() * 20 - 10)))

        palette.push(hslToHex(hue, saturation, lightness))
    }

    return palette
}


export function generateMonochromaticPalette(baseColor, count = 5) {
    const baseHsl = hexToHsl(baseColor)
    const palette = []

    for (let i = 0; i < count; i++) {
        const lightness = 20 + (i * (60 / (count - 1)))
        palette.push(hslToHex(baseHsl.h, baseHsl.s, lightness))
    }

    return palette
}


export function generateComplementaryPalette(baseColor, count = 5) {
    const baseHsl = hexToHsl(baseColor)
    const complementaryHue = (baseHsl.h + 180) % 360
    const palette = [hslToHex(baseHsl.h, baseHsl.s, baseHsl.l)]

    for (let i = 1; i < count; i++) {
        const hue = i % 2 === 0 ? baseHsl.h : complementaryHue
        const lightness = 30 + (i * 10)
        palette.push(hslToHex(hue, baseHsl.s, lightness))
    }

    return palette
}


export function hexToHsl(hex) {
    const rgb = hexToRgb(hex)
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }

        h /= 6
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    }
}


export function hslToHex(h, s, l) {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q

        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = x => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}


export function getLuminance(hex) {
    const rgb = hexToRgb(hex)
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}


export function getContrastRatio(color1, color2) {
    const l1 = getLuminance(color1)
    const l2 = getLuminance(color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
}