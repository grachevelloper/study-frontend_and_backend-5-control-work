export function generateAnalogous(baseColor, count = 5) {
    const baseHue = Math.random() * 360
    const colors = []

    for (let i = 0; i < count; i++) {
        const hue = (baseHue + (i - 2) * 30) % 360
        const sat = 60 + Math.random() * 30
        const light = 40 + Math.random() * 30
        colors.push(hslToHex(hue, sat, light))
    }

    return colors
}

export function generateMonochromatic(baseColor, count = 5) {
    const hue = Math.random() * 360
    const colors = []

    for (let i = 0; i < count; i++) {
        const light = 20 + (i * (60 / (count - 1)))
        colors.push(hslToHex(hue, 50, light))
    }

    return colors
}

export function generateComplementary(baseColor, count = 5) {
    const hue1 = Math.random() * 360
    const hue2 = (hue1 + 180) % 360
    const colors = []

    for (let i = 0; i < count; i++) {
        const hue = i % 2 === 0 ? hue1 : hue2
        const light = 30 + (i * 10)
        colors.push(hslToHex(hue, 70, light))
    }

    return colors
}

export function generateTriadic(baseColor, count = 5) {
    const hue1 = Math.random() * 360
    const colors = [hslToHex(hue1, 70, 50)]

    for (let i = 1; i < count; i++) {
        const hue = (hue1 + (i * 120)) % 360
        colors.push(hslToHex(hue, 70, 40 + i * 5))
    }

    return colors
}

function hslToHex(h, s, l) {
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