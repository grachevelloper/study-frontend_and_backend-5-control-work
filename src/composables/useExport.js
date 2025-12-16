export function useExport() {
    const exportCSS = (colors) => {
        let css = ':root {\n'
        colors.forEach((color, i) => {
            css += `  --color-${i + 1}: ${color.value};\n`
        })
        css += '}'
        return css
    }

    const exportJSON = (colors) => {
        return JSON.stringify({
            colors: colors.map(c => c.value),
            generatedAt: new Date().toISOString()
        }, null, 2)
    }

    const exportTailwind = (colors) => {
        let config = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n'
        colors.forEach((color, i) => {
            config += `        'color-${i + 1}': '${color.value}',\n`
        })
        config += '      }\n    }\n  }\n}'
        return config
    }

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch {
            const textarea = document.createElement('textarea')
            textarea.value = text
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            return true
        }
    }

    return {
        exportCSS,
        exportJSON,
        exportTailwind,
        copyToClipboard
    }
}