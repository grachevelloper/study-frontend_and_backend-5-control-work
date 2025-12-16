<template>
  <div class="generator-view">
    <h1>Генератор палитр</h1>
    
    <div class="controls">
      <div class="control-group">
        <label>Цветов:</label>
        <select v-model="colorCount" class="input">
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="7">7</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Тип:</label>
        <select v-model="paletteType" class="input">
          <option value="random">Случайная</option>
          <option value="analogous">Аналогичная</option>
          <option value="monochromatic">Монохромная</option>
          <option value="complementary">Комплементарная</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Основной цвет:</label>
        <input type="color" v-model="baseColor">
      </div>
    </div>
    
    <div class="actions">
      <button @click="generate" class="btn generate-btn">
        🔄 Сгенерировать
      </button>
      <button @click="save" class="btn save-btn">
        💾 Сохранить
      </button>
    </div>
    
    <div class="palette-display">
      <div 
        v-for="(color, index) in colors" 
        :key="index"
        class="color-card"
        :style="{ background: color.value }"
        @click="copyColor(color.value)"
      >
        <div class="color-info" :class="{ light: isLight(color.value) }">
          {{ formatColor(color.value) }}
        </div>
        <button 
          @click.stop="togglePin(index)"
          class="pin-btn"
          :class="{ pinned: color.pinned }"
        >
          📌
        </button>
      </div>
    </div>
    
    <div class="tools">
      <PalettePreview :palette="colors" />
      <ColorAnalyzer />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import PalettePreview from '../components/PalettePreview.vue'
import ColorAnalyzer from '../components/ColorAnalyzer.vue'
import { useColorPalette } from '../composables/useColorPalette'
import { generateAnalogous, generateMonochromatic, generateComplementary } from '../utils/paletteGenerators'
import { generateRandomColor } from '../utils/colorUtils'

export default {
  name: 'GeneratorView',
  components: {
    PalettePreview,
    ColorAnalyzer
  },
  setup() {
    const colorCount = ref(5)
    const paletteType = ref('random')
    const baseColor = ref('#667eea')
    const colorFormat = ref('hex')
    
    const { colors, pinned, togglePin, saveToStorage } = useColorPalette()
    
    const generate = () => {
      let newColors = []
      
      switch(paletteType.value) {
        case 'analogous':
          newColors = generateAnalogous(baseColor.value, parseInt(colorCount.value))
          break
        case 'monochromatic':
          newColors = generateMonochromatic(baseColor.value, parseInt(colorCount.value))
          break
        case 'complementary':
          newColors = generateComplementary(baseColor.value, parseInt(colorCount.value))
          break
        default:
          newColors = Array.from({ length: parseInt(colorCount.value) }, () => generateRandomColor())
      }
      
      colors.value = newColors.map((color, index) => ({
        value: color,
        pinned: pinned.has(index)
      }))
      
      saveToLocalStorage()
    }
    
    const save = () => {
      const name = prompt('Название палитры:', `Палитра ${new Date().toLocaleDateString()}`)
      if (name) {
        saveToStorage(name)
        alert('Палитра сохранена!')
      }
    }
    
    const copyColor = async (color) => {
      try {
        await navigator.clipboard.writeText(color.toUpperCase())
        alert(`${color} скопирован!`)
      } catch {
        const textarea = document.createElement('textarea')
        textarea.value = color
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        alert(`${color} скопирован!`)
      }
    }
    
    const formatColor = (color) => {
      return colorFormat.value === 'hex' 
        ? color.toUpperCase()
        : hexToRgb(color)
    }
    
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgb(${r}, ${g}, ${b})`
    }
    
    const isLight = (color) => {
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128
    }
    
    const saveToLocalStorage = () => {
      localStorage.setItem('currentPalette', JSON.stringify({
        colors: colors.value,
        settings: { colorCount: colorCount.value, paletteType: paletteType.value, baseColor: baseColor.value }
      }))
    }
    
    onMounted(() => {
      const saved = JSON.parse(localStorage.getItem('currentPalette'))
      if (saved) {
        colors.value = saved.colors
        colorCount.value = saved.settings.colorCount
        paletteType.value = saved.settings.paletteType
        baseColor.value = saved.settings.baseColor
      } else {
        generate()
      }
    })
    
    return {
      colorCount,
      paletteType,
      baseColor,
      colorFormat,
      colors,
      generate,
      save,
      togglePin,
      copyColor,
      formatColor,
      isLight
    }
  }
}
</script>

<style scoped>
.generator-view {
  padding: 1rem;
}

.generator-view h1 {
  margin-bottom: 1.5rem;
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.generate-btn {
  background: #667eea;
  color: white;
}

.save-btn {
  background: #edf2f7;
  color: #4a5568;
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.color-card {
  height: 120px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.1);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: rgba(0,0,0,0.8);
  color: white;
  font-family: monospace;
  font-size: 0.9rem;
}

.color-info.light {
  background: rgba(255,255,255,0.9);
  color: black;
}

.pin-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.pin-btn.pinned {
  background: #fbbf24;
}

.tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .tools {
    grid-template-columns: 1fr;
  }
}
</style>