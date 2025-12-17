<template>
  <div class="palette-preview">
    <h3>🎨 Предпросмотр палитры</h3>
    
    <!-- Отладка: показываем полученные цвета -->
    <div class="debug-info" v-if="showDebug">
      <p>Получено цветов: {{ palette.length }}</p>
      <div class="debug-colors">
        <div v-for="(color, index) in palette" :key="index" 
             class="debug-color" 
             :style="{ background: color.value || '#ccc' }">
          {{ index }}: {{ color.name || 'Цвет' }}
        </div>
      </div>
    </div>
    
    <!-- Мокап интерфейса -->
    <div class="preview-mockup" :style="{ background: mockupBg }">
      <!-- Заголовок -->
      <div class="mockup-header" :style="{ 
        color: getFirstColor(),
        background: mockupBg === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'
      }">
        <h4>Заголовок страницы</h4>
        <p>Подзаголовок с поясняющим текстом</p>
      </div>
      
      <!-- Основной контент -->
      <div class="mockup-content">
        <!-- Основная кнопка -->
        <button class="mockup-btn primary-btn" :style="{ 
          background: getSecondColor(),
          color: getContrastColor(getSecondColor())
        }">
          Основная кнопка
        </button>
        
        <!-- Вторичная кнопка -->
        <button class="mockup-btn secondary-btn" :style="{ 
          borderColor: getThirdColor(),
          color: getThirdColor()
        }">
          Вторичная кнопка
        </button>
        
        <!-- Карточка -->
        <div class="mockup-card" :style="{ 
          borderColor: getFourthColor(),
          background: mockupBg === '#ffffff' ? '#fff' : 'rgba(255,255,255,0.05)'
        }">
          <div class="card-header" :style="{ color: getFirstColor() }">
            Заголовок карточки
          </div>
          <p class="card-text" :style="{ 
            color: mockupBg === '#ffffff' ? '#4a5568' : '#cbd5e0'
          }">
            Это пример карточки с контентом. Здесь может быть текст, изображения или другие элементы интерфейса.
          </p>
          <div class="card-footer">
            <span class="badge" :style="{ 
              background: getFifthColor(),
              color: getContrastColor(getFifthColor())
            }">
              Метка
            </span>
          </div>
        </div>
        
        <!-- Ссылки -->
        <div class="mockup-links">
          <a href="#" class="mockup-link" :style="{ color: getSecondColor() }">
            Основная ссылка
          </a>
          <a href="#" class="mockup-link" :style="{ color: getFourthColor() }">
            Вторичная ссылка
          </a>
        </div>
      </div>
    </div>
    
    <!-- Управление -->
    <div class="preview-controls">
      <button @click="toggleBg" class="bg-toggle">
        {{ mockupBg === '#ffffff' ? '🌙 Тёмный фон' : '☀️ Светлый фон' }}
      </button>
      <button @click="toggleDebug" class="debug-toggle">
        {{ showDebug ? '🔒 Скрыть отладку' : '🐛 Показать отладку' }}
      </button>
      <div class="color-indicators">
        <div v-for="(color, index) in displayColors" :key="index" 
             class="color-indicator" 
             :style="{ background: color.value }"
             :title="color.name || `Цвет ${index + 1}`">
          {{ index + 1 }}
        </div>
      </div>
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
    const showDebug = ref(false)

    // Берем первые 5 цветов из палитры
    const displayColors = computed(() => {
      return props.palette.slice(0, 5)
    })

    // Вспомогательные функции для получения конкретных цветов
    const getFirstColor = () => displayColors.value[0]?.value || '#4a5568'
    const getSecondColor = () => displayColors.value[1]?.value || '#3182ce'
    const getThirdColor = () => displayColors.value[2]?.value || '#718096'
    const getFourthColor = () => displayColors.value[3]?.value || '#38a169'
    const getFifthColor = () => displayColors.value[4]?.value || '#d69e2e'

    const toggleBg = () => {
      mockupBg.value = mockupBg.value === '#ffffff' ? '#1a202c' : '#ffffff'
    }

    const toggleDebug = () => {
      showDebug.value = !showDebug.value
    }

    const getContrastColor = (hex) => {
      if (!hex || typeof hex !== 'string') return '#000000'
      
      // Нормализуем HEX
      let cleanHex = hex.replace('#', '')
      
      // Конвертируем короткий формат (#RGB) в полный (#RRGGBB)
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('')
      }
      
      if (cleanHex.length < 6) return '#000000'
      
      try {
        const r = parseInt(cleanHex.substring(0, 2), 16)
        const g = parseInt(cleanHex.substring(2, 4), 16)
        const b = parseInt(cleanHex.substring(4, 6), 16)
        
        // Вычисляем яркость по формуле WCAG
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness > 128 ? '#000000' : '#ffffff'
      } catch (e) {
        return '#000000'
      }
    }

    return {
      mockupBg,
      showDebug,
      displayColors,
      getFirstColor,
      getSecondColor,
      getThirdColor,
      getFourthColor,
      getFifthColor,
      toggleBg,
      toggleDebug,
      getContrastColor
    }
  }
}
</script>

<style scoped>
.palette-preview {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  margin-bottom: 2rem;
}

.palette-preview h3 {
  margin-bottom: 1.5rem;
  color: #2d3748;
  font-size: 1.25rem;
}

/* Отладочная информация */
.debug-info {
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #4299e1;
}

.debug-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.debug-color {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  min-width: 80px;
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* Мокап интерфейса */
.preview-mockup {
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.mockup-header {
  padding: 1.5rem;
  border-radius: 8px;
}

.mockup-header h4 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.mockup-header p {
  opacity: 0.8;
}

.mockup-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mockup-btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: fit-content;
}

.mockup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mockup-btn.primary-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mockup-btn.secondary-btn {
  background: transparent;
  border: 2px solid;
}

.mockup-card {
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid;
  margin-top: 0.5rem;
}

.card-header {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.card-text {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-footer {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.mockup-links {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.mockup-link {
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.mockup-link:hover {
  border-bottom-color: currentColor;
}

/* Управление */
.preview-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.bg-toggle, .debug-toggle {
  padding: 0.625rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.bg-toggle:hover, .debug-toggle:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.color-indicators {
  display: flex;
  gap: 0.5rem;
}

.color-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: help;
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  .palette-preview {
    background: #2d3748;
    border-color: #4a5568;
  }
  
  .palette-preview h3 {
    color: #e2e8f0;
  }
  
  .debug-info {
    background: #4a5568;
  }
  
  .bg-toggle, .debug-toggle {
    background: #4a5568;
    border-color: #718096;
    color: #e2e8f0;
  }
  
  .bg-toggle:hover, .debug-toggle:hover {
    background: #5a6578;
  }
}

@media (max-width: 768px) {
  .preview-mockup {
    padding: 1.5rem;
  }
  
  .preview-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .color-indicators {
    justify-content: center;
  }
}
</style>