<template>
  <div class="palette-library">
    <h3>Сохранённые палитры</h3>
    
    <input 
      v-model="search" 
      placeholder="Поиск..." 
      class="search-input"
    >
    
    <div class="palette-list">
      <div 
        v-for="palette in filteredPalettes" 
        :key="palette.id"
        class="palette-item"
        @click="$emit('load', palette)"
      >
        <div class="palette-colors">
          <div 
            v-for="color in palette.colors.slice(0, 5)" 
            :key="color"
            class="color-dot"
            :style="{ background: color }"
          />
        </div>
        <div class="palette-info">
          <strong>{{ palette.name }}</strong>
          <small>{{ palette.colors.length }} цветов</small>
        </div>
        <button @click.stop="deletePalette(palette.id)" class="delete-btn">
          ×
        </button>
      </div>
      
      <div v-if="!filteredPalettes.length" class="empty">
        Нет сохранённых палитр
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'PaletteLibrary',
  emits: ['load'],
  setup(_, { emit }) {
    const palettes = ref([])
    const search = ref('')

    const filteredPalettes = computed(() => {
      if (!search.value) return palettes.value
      return palettes.value.filter(p => 
        p.name.toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const loadPalettes = () => {
      palettes.value = JSON.parse(localStorage.getItem('palettes') || '[]')
    }

    const deletePalette = (id) => {
      if (!confirm('Удалить палитру?')) return
      
      palettes.value = palettes.value.filter(p => p.id !== id)
      localStorage.setItem('palettes', JSON.stringify(palettes.value))
    }

    onMounted(() => {
      loadPalettes()
    })

    return {
      palettes,
      search,
      filteredPalettes,
      deletePalette
    }
  }
}
</script>

<style scoped>
.palette-library {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.palette-library h3 {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.palette-list {
  max-height: 300px;
  overflow-y: auto;
}

.palette-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
}

.palette-item:hover {
  background: #f7fafc;
}

.palette-colors {
  display: flex;
  gap: 2px;
  margin-right: 1rem;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
}

.palette-info {
  flex: 1;
}

.palette-info small {
  color: #718096;
  display: block;
}

.delete-btn {
  background: #f56565;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #718096;
  padding: 2rem;
}
</style>