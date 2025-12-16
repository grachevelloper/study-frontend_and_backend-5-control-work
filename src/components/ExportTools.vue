<template>
  <div class="export-view">
    <h1>📤 Экспорт цветов</h1>
    <p class="subtitle">Экспортируйте ваши палитры в популярные форматы</p>
    
    <div class="export-controls">
      <div class="format-selector">
        <h3>Выберите формат экспорта:</h3>
        <div class="format-grid">
          <button 
            v-for="format in exportFormats" 
            :key="format.id"
            @click="activeFormat = format.id"
            class="format-card"
            :class="{ active: activeFormat === format.id }"
          >
            <div class="format-icon">{{ format.icon }}</div>
            <div class="format-info">
              <h4>{{ format.name }}</h4>
              <p>{{ format.description }}</p>
            </div>
          </button>
        </div>
      </div>
      
      <div class="export-options">
        <h3>Настройки экспорта:</h3>
        <div class="options-grid">
          <div class="option">
            <label>
              <input type="checkbox" v-model="exportOptions.prefix">
              Добавить префикс (--color-)
            </label>
          </div>
          <div class="option">
            <label>
              <input type="checkbox" v-model="exportOptions.comments">
              Добавить комментарии
            </label>
          </div>
          <div class="option">
            <label>
              <input type="checkbox" v-model="exportOptions.minify">
              Минифицировать код
            </label>
          </div>
          <div class="option">
            <label>
              <input type="checkbox" v-model="exportOptions.camelCase">
              Использовать camelCase
            </label>
          </div>
        </div>
        
        <div class="palette-selector">
          <label>Выберите палитру для экспорта:</label>
          <select v-model="selectedPalette" class="palette-select">
            <option value="current">Текущая палитра</option>
            <option 
              v-for="palette in savedPalettes" 
              :key="palette.id"
              :value="palette.id"
            >
              {{ palette.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="export-preview">
      <div class="preview-header">
        <h3>Предпросмотр кода:</h3>
        <div class="preview-actions">
          <button @click="copyToClipboard" class="btn btn-secondary">
            📋 Копировать код
          </button>
          <button @click="downloadFile" class="btn btn-primary">
            ⬇️ Скачать файл
          </button>
        </div>
      </div>
      
      <div class="code-preview">
        <pre><code>{{ exportCode }}</code></pre>
      </div>
    </div>
    
    <div class="export-examples">
      <h3>Примеры использования:</h3>
      <div class="examples-grid">
        <div class="example-card">
          <div class="example-icon">🎨</div>
          <h4>CSS Variables</h4>
          <p>Используйте переменные в вашем CSS коде</p>
          <pre class="example-code">.button {
  background: var(--primary);
  color: var(--text-on-primary);
}</pre>
        </div>
        <div class="example-card">
          <div class="example-icon">⚛️</div>
          <h4>React/Vue</h4>
          <p>Импортируйте цвета в компоненты</p>
          <pre class="example-code">const colors = {
  primary: '#667eea',
  secondary: '#764ba2'
}</pre>
        </div>
        <div class="example-card">
          <div class="example-icon">🎯</div>
          <h4>Tailwind</h4>
          <p>Расширьте конфигурацию Tailwind</p>
          <pre class="example-code">module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#667eea'
      }
    }
  }
}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ExportView',
  
  setup() {
    const activeFormat = ref('css')
    const exportOptions = ref({
      prefix: true,
      comments: true,
      minify: false,
      camelCase: false
    })
    const selectedPalette = ref('current')
    const savedPalettes = ref([])
    const currentPalette = ref([
      { value: '#667eea', name: 'primary' },
      { value: '#764ba2', name: 'secondary' },
      { value: '#f56565', name: 'accent' },
      { value: '#48bb78', name: 'success' },
      { value: '#ed8936', name: 'warning' }
    ])
    
    const exportFormats = [
      { id: 'css', name: 'CSS Variables', icon: '🎨', description: 'Современные CSS переменные' },
      { id: 'scss', name: 'SCSS Variables', icon: '⚡', description: 'SCSS переменные и миксины' },
      { id: 'less', name: 'LESS Variables', icon: '📦', description: 'LESS переменные' },
      { id: 'tailwind', name: 'Tailwind Config', icon: '🎯', description: 'Конфигурация Tailwind CSS' },
      { id: 'js', name: 'JavaScript Object', icon: '⚛️', description: 'JS объект для React/Vue' },
      { id: 'json', name: 'JSON', icon: '📄', description: 'Стандартный JSON формат' }
    ]
    
    const selectedColors = computed(() => {
      if (selectedPalette.value === 'current') {
        return currentPalette.value
      }
      
      const palette = savedPalettes.value.find(p => p.id === selectedPalette.value)
      if (palette) {
        return palette.colors.map((color, index) => ({
          value: color,
          name: `color-${index + 1}`
        }))
      }
      
      return currentPalette.value
    })
    
    const exportCode = computed(() => {
      const format = exportFormats.find(f => f.id === activeFormat.value)
      if (!format) return ''
      
      switch (format.id) {
        case 'css':
          return generateCSSVariables()
        case 'scss':
          return generateSCSSVariables()
        case 'less':
          return generateLESSVariables()
        case 'tailwind':
          return generateTailwindConfig()
        case 'js':
          return generateJSObject()
        case 'json':
          return generateJSON()
        default:
          return ''
      }
    })
    
    const generateCSSVariables = () => {
      let code = exportOptions.value.comments ? 
        '/* Color Palette Variables */\n' +
        '/* Generated by PalettePro */\n\n' : ''
      
      code += ':root {\n'
      
      selectedColors.value.forEach(color => {
        const name = exportOptions.value.camelCase 
          ? color.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          : color.name
        
        const varName = exportOptions.value.prefix 
          ? `--color-${name}`
          : `--${name}`
        
        code += `  ${varName}: ${color.value};\n`
      })
      
      code += '}'
      
      if (exportOptions.value.minify) {
        code = code.replace(/\s+/g, ' ').trim()
      }
      
      return code
    }
    
    const generateSCSSVariables = () => {
      let code = exportOptions.value.comments ? 
        '// Color Palette Variables\n' +
        '// Generated by PalettePro\n\n' : ''
      
      selectedColors.value.forEach(color => {
        const name = exportOptions.value.camelCase 
          ? color.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          : color.name
        
        const varName = exportOptions.value.prefix 
          ? `$color-${name}`
          : `$${name}`
        
        code += `${varName}: ${color.value};\n`
      })
      
      code += '\n// Mixin for easy color usage\n'
      code += '@mixin color($property, $color) {\n'
      code += '  #{$property}: map-get($colors, $color);\n'
      code += '}\n\n'
      code += '$colors: (\n'
      
      selectedColors.value.forEach((color, index) => {
        const name = exportOptions.value.camelCase 
          ? color.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          : color.name
        
        code += `  ${name}: ${color.value}${index < selectedColors.value.length - 1 ? ',' : ''}\n`
      })
      
      code += ');'
      
      return code
    }
    
    const generateTailwindConfig = () => {
      let code = exportOptions.value.comments ? 
        '// Tailwind CSS Configuration\n' +
        '// Generated by PalettePro\n\n' : ''
      
      code += 'module.exports = {\n'
      code += '  theme: {\n'
      code += '    extend: {\n'
      code += '      colors: {\n'
      
      selectedColors.value.forEach((color, index) => {
        const name = exportOptions.value.camelCase 
          ? color.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          : color.name
        
        code += `        '${name}': '${color.value}'${index < selectedColors.value.length - 1 ? ',' : ''}\n`
      })
      
      code += '      }\n'
      code += '    }\n'
      code += '  }\n'
      code += '}'
      
      return code
    }
    
    const generateJSObject = () => {
      let code = exportOptions.value.comments ? 
        '// Color Palette Object\n' +
        '// Generated by PalettePro\n\n' : ''
      
      if (exportOptions.value.camelCase) {
        code += 'const colors = {\n'
        selectedColors.value.forEach((color, index) => {
          const name = color.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          code += `  ${name}: '${color.value}'${index < selectedColors.value.length - 1 ? ',' : ''}\n`
        })
        code += '}'
      } else {
        code += 'export const COLORS = {\n'
        selectedColors.value.forEach((color, index) => {
          code += `  '${color.name.toUpperCase()}': '${color.value}'${index < selectedColors.value.length - 1 ? ',' : ''}\n`
        })
        code += '}'
      }
      
      if (exportOptions.value.minify) {
        code = code.replace(/\s+/g, ' ').trim()
      }
      
      return code
    }
    
    const generateJSON = () => {
      const colorsObj = {}
      selectedColors.value.forEach(color => {
        const name = exportOptions.value.camelCase 
          ? color.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          : color.name
        
        colorsObj[name] = color.value
      })
      
      return JSON.stringify(
        { 
          palette: colorsObj,
          generatedAt: new Date().toISOString(),
          generator: 'PalettePro'
        }, 
        null, 
        exportOptions.value.minify ? 0 : 2
      )
    }
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(exportCode.value)
        alert('Код скопирован в буфер обмена!')
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }
    
    const downloadFile = () => {
      const format = exportFormats.find(f => f.id === activeFormat.value)
      if (!format) return
      
      const extensions = {
        css: 'css',
        scss: 'scss',
        less: 'less',
        tailwind: 'js',
        js: 'js',
        json: 'json'
      }
      
      const extension = extensions[activeFormat.value]
      const filename = `palette-${new Date().toISOString().slice(0, 10)}.${extension}`
      
      const blob = new Blob([exportCode.value], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    const loadSavedPalettes = () => {
      const palettes = JSON.parse(localStorage.getItem('palettes') || '[]')
      savedPalettes.value = palettes
    }
    
    onMounted(() => {
      loadSavedPalettes()
    })
    
    return {
      activeFormat,
      exportOptions,
      selectedPalette,
      savedPalettes,
      exportFormats,
      exportCode,
      copyToClipboard,
      downloadFile
    }
  }
}
</script>

<style scoped>
.export-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.export-view h1 {
  color: #2d3748;
  text-align: center;
}

.subtitle {
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
}

.export-controls {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.format-selector,
.export-options {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.format-selector h3,
.export-options h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.format-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.format-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.format-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.format-icon {
  font-size: 2rem;
}

.format-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.format-info p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.format-card.active .format-info h4,
.format-card.active .format-info p {
  color: white;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.palette-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.palette-select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.export-preview {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.preview-header h3 {
  color: #2d3748;
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

.code-preview {
  background: #1a202c;
  border-radius: 8px;
  padding: 1.5rem;
  overflow-x: auto;
}

.code-preview pre {
  margin: 0;
  color: #cbd5e0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.code-preview code {
  white-space: pre-wrap;
}

.export-examples {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.export-examples h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.example-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.example-card:hover {
  transform: translateY(-4px);
}

.example-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.example-card h4 {
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.example-card p {
  color: #718096;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.example-code {
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
  text-align: left;
  overflow-x: auto;
}

[data-theme="dark"] .format-selector,
[data-theme="dark"] .export-options,
[data-theme="dark"] .export-preview,
[data-theme="dark"] .export-examples {
  background: #2d3748;
}

[data-theme="dark"] .format-selector h3,
[data-theme="dark"] .export-options h3,
[data-theme="dark"] .preview-header h3,
[data-theme="dark"] .export-examples h3,
[data-theme="dark"] .example-card h4 {
  color: white;
}

[data-theme="dark"] .format-card:not(.active) {
  background: #4a5568;
  border-color: #4a5568;
}

[data-theme="dark"] .example-card {
  background: #4a5568;
}

[data-theme="dark"] .example-card p {
  color: #cbd5e0;
}

[data-theme="dark"] .example-code {
  background: #1a202c;
  color: #cbd5e0;
}

@media (max-width: 1024px) {
  .export-controls {
    grid-template-columns: 1fr;
  }
  
  .format-grid {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .preview-actions {
    flex-direction: column;
  }
}
</style>