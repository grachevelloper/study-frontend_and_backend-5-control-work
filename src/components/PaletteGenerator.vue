<template>
  <div class="palette-generator">
    <div class="generator-controls">
      <div class="controls-group">
        <label>Количество цветов:</label>
        <select v-model="colorCount" class="input">
          <option value="3">3 цвета</option>
          <option value="5">5 цветов</option>
          <option value="7">7 цветов</option>
        </select>
      </div>
      
      <div class="controls-group">
        <label>Формат отображения:</label>
        <div class="format-toggle">
          <button 
            @click="colorFormat = 'hex'" 
            :class="{ active: colorFormat === 'hex' }"
            class="format-btn"
          >
            HEX
          </button>
          <button 
            @click="colorFormat = 'rgb'" 
            :class="{ active: colorFormat === 'rgb' }"
            class="format-btn"
          >
            RGB
          </button>
        </div>
      </div>
      
      <div class="controls-group">
        <label>Основной цвет:</label>
        <input 
          type="color" 
          v-model="baseColor" 
          class="color-picker"
        >
      </div>
    </div>
    
    <div class="actions">
      <button @click="generatePalette" class="btn btn-primary">
        🔄 Случайная палитра
      </button>
      <button @click="saveCurrentPalette" class="btn btn-secondary">
        💾 Сохранить палитру
      </button>
      <button @click="resetPinned" class="btn btn-secondary" v-if="hasPinnedColors">
        🔓 Сбросить закрепленные
      </button>
    </div>
    
    <div class="palette-display">
      <div 
        v-for="(color, index) in currentPalette" 
        :key="index"
        class="palette-row"
      >
        <ColorCard 
          :color="color" 
          :format="colorFormat"
          :index="index"
          @pin="togglePin"
          @copy="showCopyNotification"
        />
      </div>
    </div>
    
    <div class="palette-info">
      <div class="info-card">
        <h4>Информация о палитре</h4>
        <p>Закреплено цветов: {{ pinnedCount }}</p>
        <p>Последнее обновление: {{ lastGenerated }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ColorCard from './ColorCard.vue'
import { generateRandomColor, generateAnalogousPalette } from '../utils/colorUtils'

export default {
  name: 'PaletteGenerator',
  components: {
    ColorCard
  },
  props: {
    showControls: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const colorCount = ref(5)
    const colorFormat = ref('hex')
    const baseColor = ref('#667eea')
    const currentPalette = ref([])
    const pinnedColors = ref(new Set())
    const lastGenerated = ref(new Date().toLocaleTimeString())
    
    const pinnedCount = computed(() => pinnedColors.value.size)
    const hasPinnedColors = computed(() => pinnedColors.value.size > 0)
    
    const generatePalette = () => {
      const newPalette = generateAnalogousPalette(baseColor.value, parseInt(colorCount.value))
      currentPalette.value = newPalette.map((color, index) => ({
        value: color,
        pinned: pinnedColors.value.has(index),
        id: Date.now() + index
      }))
      lastGenerated.value = new Date().toLocaleTimeString()
      saveToStorage()
    }
    
    const togglePin = (index) => {
      if (pinnedColors.value.has(index)) {
        pinnedColors.value.delete(index)
      } else {
        pinnedColors.value.add(index)
      }
      currentPalette.value[index].pinned = pinnedColors.value.has(index)
      saveToStorage()
    }
    
    const resetPinned = () => {
      pinnedColors.value.clear()
      currentPalette.value.forEach(color => {
        color.pinned = false
      })
      saveToStorage()
    }
    
    const saveCurrentPalette = () => {
      const paletteToSave = {
        id: Date.now(),
        name: `Палитра ${new Date().toLocaleDateString()}`,
        colors: currentPalette.value.map(c => c.value),
        createdAt: new Date().toISOString()
      }
      
      const savedPalettes = JSON.parse(localStorage.getItem('palettes') || '[]')
      savedPalettes.unshift(paletteToSave)
      localStorage.setItem('palettes', JSON.stringify(savedPalettes))
      
      emit('paletteSaved', paletteToSave)
      showNotification('Палитра сохранена!')
    }
    
    const showCopyNotification = (color) => {
      emit('copyNotification', `${color} скопирован в буфер`)
    }
    
    const showNotification = (message) => {
      emit('notification', message)
    }
    
    const saveToStorage = () => {
      localStorage.setItem('currentPalette', JSON.stringify({
        palette: currentPalette.value,
        pinned: Array.from(pinnedColors.value),
        baseColor: baseColor.value,
        colorCount: colorCount.value
      }))
    }
    
    const loadFromStorage = () => {
      const saved = JSON.parse(localStorage.getItem('currentPalette'))
      if (saved) {
        currentPalette.value = saved.palette
        pinnedColors.value = new Set(saved.pinned)
        baseColor.value = saved.baseColor
        colorCount.value = saved.colorCount
      } else {
        generatePalette()
      }
    }
    
    onMounted(() => {
      loadFromStorage()
    })
    
    return {
      colorCount,
      colorFormat,
      baseColor,
      currentPalette,
      pinnedCount,
      hasPinnedColors,
      lastGenerated,
      generatePalette,
      togglePin,
      resetPinned,
      saveCurrentPalette,
      showCopyNotification
    }
  }
}
</script>

<style scoped>
.palette-generator {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.generator-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.controls-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.controls-group label {
  font-weight: 600;
  color: #4a5568;
}

.format-toggle {
  display: flex;
  gap: 0.5rem;
}

.format-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.format-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.format-btn:hover:not(.active) {
  border-color: #667eea;
}

.color-picker {
  width: 100%;
  height: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.palette-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.palette-info {
  display: flex;
  justify-content: center;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 300px;
}

.info-card h4 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.info-card p {
  color: #718096;
  margin: 0.5rem 0;
}

[data-theme="dark"] .generator-controls,
[data-theme="dark"] .info-card {
  background: #2d3748;
}

[data-theme="dark"] .controls-group label,
[data-theme="dark"] .info-card h4 {
  color: white;
}

[data-theme="dark"] .format-btn {
  background: #4a5568;
  border-color: #4a5568;
  color: white;
}

[data-theme="dark"] .format-btn.active {
  background: #667eea;
  border-color: #667eea;
}
</style>