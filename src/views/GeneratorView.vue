<template>
  <div class="generator-view">
    <h1>🎨 Генератор цветовых палитр</h1>
    <p class="subtitle">Создавайте гармоничные цветовые схемы одним кликом</p>
    
    <div class="view-content">
      <div class="main-generator">
        <PaletteGenerator 
          @notification="showNotification" 
          @paletteSaved="onPaletteSaved"
        />
      </div>
      
      <div class="sidebar">
        <PalettePreview :palette="currentPalette" />
        
        <div class="sidebar-section">
          <h3>📊 Быстрый анализ</h3>
          <div class="contrast-checker">
            <p>Проверьте контраст между цветами:</p>
            <div class="contrast-inputs">
              <input type="color" v-model="contrastColor1">
              <input type="color" v-model="contrastColor2">
            </div>
            <div v-if="contrastRatio" class="contrast-result">
              <p>Коэффициент контраста: <strong>{{ contrastRatio.toFixed(2) }}:1</strong></p>
              <p :class="contrastClass">{{ contrastLevel }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Notification v-if="notification.message" :message="notification.message" />
  </div>
</template>

<script>
import { ref, computed, provide } from 'vue'
import PaletteGenerator from '../components/PaletteGenerator.vue'
import PalettePreview from '../components/PalettePreview.vue'
import { getContrastRatio } from '../utils/colorUtils'

export default {
  name: 'GeneratorView',
  components: {
    PaletteGenerator,
    PalettePreview
  },
  setup() {
    const currentPalette = ref([])
    const notification = ref({ message: '', type: 'info' })
    const contrastColor1 = ref('#000000')
    const contrastColor2 = ref('#ffffff')
    
    const contrastRatio = computed(() => {
      return getContrastRatio(contrastColor1.value, contrastColor2.value)
    })
    
    const contrastLevel = computed(() => {
      if (contrastRatio.value >= 7) return 'AAA (Отлично)'
      if (contrastRatio.value >= 4.5) return 'AA (Хорошо)'
      if (contrastRatio.value >= 3) return 'AA для крупного текста'
      return 'Недостаточно'
    })
    
    const contrastClass = computed(() => {
      if (contrastRatio.value >= 4.5) return 'contrast-good'
      if (contrastRatio.value >= 3) return 'contrast-ok'
      return 'contrast-poor'
    })
    
    const showNotification = (message, type = 'info') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value.message = ''
      }, 3000)
    }
    
    const onPaletteSaved = (palette) => {
      showNotification(`Палитра "${palette.name}" сохранена!`, 'success')
    }
    
    // Предоставляем текущую палитру для дочерних компонентов
    provide('currentPalette', currentPalette)
    
    return {
      currentPalette,
      notification,
      contrastColor1,
      contrastColor2,
      contrastRatio,
      contrastLevel,
      contrastClass,
      showNotification,
      onPaletteSaved
    }
  }
}
</script>

<style scoped>
.generator-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.generator-view h1 {
  color: #2d3748;
  text-align: center;
}

.subtitle {
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
}

.view-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.main-generator {
  grid-column: 1;
}

.sidebar {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sidebar-section h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.contrast-checker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contrast-inputs {
  display: flex;
  gap: 1rem;
}

.contrast-inputs input[type="color"] {
  width: 50px;
  height: 50px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}

.contrast-result {
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.contrast-good {
  color: #38a169;
  font-weight: 600;
}

.contrast-ok {
  color: #d69e2e;
  font-weight: 600;
}

.contrast-poor {
  color: #e53e3e;
  font-weight: 600;
}

[data-theme="dark"] .generator-view h1 {
  color: white;
}

[data-theme="dark"] .subtitle {
  color: #cbd5e0;
}

[data-theme="dark"] .sidebar-section {
  background: #2d3748;
}

[data-theme="dark"] .sidebar-section h3 {
  color: white;
}

[data-theme="dark"] .contrast-result {
  background: #4a5568;
}

@media (max-width: 1024px) {
  .view-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    grid-column: 1;
  }
}
</style>