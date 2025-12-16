<template>
  <div class="palette-preview">
    <h3>Предпросмотр</h3>
    
    <div class="preview-mockup" :style="{ background: mockupBg }">
      <div class="mockup-header" :style="{ color: colors[0]?.value }">
        Заголовок
      </div>
      <div class="mockup-content">
        <button class="mockup-btn" :style="{ 
          background: colors[1]?.value, 
          color: getContrastColor(colors[1]?.value) 
        }">
          Кнопка
        </button>
        <div class="mockup-card" :style="{ 
          borderColor: colors[2]?.value 
        }">
          Карточка
        </div>
      </div>
    </div>
    
    <div class="preview-controls">
      <button @click="toggleBg" class="bg-toggle">
        {{ mockupBg === '#ffffff' ? '🌙 Тёмный фон' : '☀️ Светлый фон' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PalettePreview',
  props: {
    palette: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const mockupBg = ref('#ffffff')
    const colors = computed(() => props.palette.slice(0, 5))

    const toggleBg = () => {
      mockupBg.value = mockupBg.value === '#ffffff' ? '#1a202c' : '#ffffff'
    }

    const getContrastColor = (hex) => {
      if (!hex) return '#000'
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128 ? '#000000' : '#ffffff'
    }

    return {
      mockupBg,
      colors,
      toggleBg,
      getContrastColor
    }
  }
}
</script>

<style scoped>
.palette-preview {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.palette-preview h3 {
  margin-bottom: 1rem;
}

.preview-mockup {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mockup-header {
  font-size: 1.5rem;
  font-weight: bold;
}

.mockup-content {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.mockup-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.mockup-card {
  padding: 1rem;
  border: 2px solid;
  border-radius: 8px;
  flex: 1;
}

.preview-controls {
  display: flex;
  gap: 1rem;
}

.bg-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
</style>