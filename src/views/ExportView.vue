<template>
  <div class="export-view">
    <h1>Экспорт палитр</h1>
    
    <div class="export-content">


      <div class="export-area">
        <ExportTools 
          :colors="selectedColors"
          :palette-name="paletteName"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ExportTools from '../components/ExportTools.vue'
import { useColorPalette } from '../composables/useColorPalette'

export default {
  name: 'ExportView',
  components: {
    ExportTools
  },
  setup() {
    const selectedPalette = ref('current')
    const savedPalettes = ref([])
    const { colors: currentColors } = useColorPalette()

    const selectedColors = computed(() => {
      if (selectedPalette.value === 'current') {
        return currentColors.value
      }
      
      const palette = savedPalettes.value.find(p => p.id === selectedPalette.value)
      if (palette) {
        return palette.colors.map(color => ({ value: color }))
      }
      
      return currentColors.value
    })

    const paletteName = computed(() => {
      if (selectedPalette.value === 'current') {
        return 'my-palette'
      }
      
      const palette = savedPalettes.value.find(p => p.id === selectedPalette.value)
      return palette ? palette.name.replace(/\s+/g, '-').toLowerCase() : 'palette'
    })

    const loadPalettes = () => {
      savedPalettes.value = JSON.parse(localStorage.getItem('palettes') || '[]')
    }

    onMounted(() => {
      loadPalettes()
    })

    return {
      selectedPalette,
      savedPalettes,
      selectedColors,
      paletteName
    }
  }
}
</script>
<style scoped>
.export-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.export-view h1 {
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.export-controls {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.format-selector {
  flex: 2;
}

.export-options {
  flex: 1;
  min-width: 300px;
}

.format-selector h3,
.export-options h3 {
  margin-bottom: 15px;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.format-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.format-card:hover {
  border-color: #667eea;
}

.format-card.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.format-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.format-info h4 {
  margin: 0 0 5px 0;
}

.format-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.options-grid {
  margin-bottom: 20px;
}

.option {
  margin-bottom: 10px;
}

.option label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.palette-selector {
  margin-top: 20px;
}

.palette-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
}

.export-preview {
  margin-bottom: 30px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #f0f0f0;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.code-preview {
  background: #1e1e1e;
  color: #f8f8f2;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  max-height: 400px;
}

.code-preview pre {
  margin: 0;
  font-family: 'Monaco', monospace;
  font-size: 14px;
}

.export-examples {
  margin-top: 30px;
}

.export-examples h3 {
  margin-bottom: 20px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.example-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.example-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.example-card h4 {
  margin: 0 0 10px 0;
}

.example-card p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.example-code {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Monaco', monospace;
  font-size: 12px;
  text-align: left;
  overflow-x: auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .export-controls {
    flex-direction: column;
  }
  
  .format-grid {
    grid-template-columns: 1fr;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .preview-actions {
    flex-direction: column;
  }
}
</style>