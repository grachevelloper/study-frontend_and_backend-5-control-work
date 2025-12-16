export function checkContrast(color1, color2) {
    const luminance1 = getLuminance(color1)
    const luminance2 = getLuminance(color2)
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05)

    let level = 'Недостаточно'
    if (ratio >= 3) level = 'AA для крупного текста'
    if (ratio >= 4.5) level = 'AA (Хорошо)'
    if (ratio >= 7) level = 'AAA (Отлично)'

    return {
        ratio: ratio.toFixed(2),
        level,
        meetsAA: ratio >= 4.5,
        meetsAAA: ratio >= 7
    }
}

function getLuminance(hex) {
    const rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    const r = parseInt(rgb[1], 16) / 255
    const g = parseInt(rgb[2], 16) / 255
    const b = parseInt(rgb[3], 16) / 255

    const sRGB = [r, g, b].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
}