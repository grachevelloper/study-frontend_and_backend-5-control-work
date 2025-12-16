<template>
  <div class="library-view">
    <div class="library-header">
      <h1>📚 Библиотека палитр</h1>
      <div class="header-controls">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Поиск по названию или тегам..." 
          class="search-input"
        >
        <select v-model="sortBy" class="sort-select">
          <option value="date">По дате</option>
          <option value="name">По имени</option>
          <option value="colors">По количеству цветов</option>
        </select>
      </div>
    </div>

    <div class="library-content">
      <div class="saved-palettes">
        <div 
          v-for="palette in filteredPalettes" 
          :key="palette.id"
          class="palette-card"
        >
          <div class="palette-card-header">
            <h3>{{ palette.name }}</h3>
            <div class="palette-actions">
              <button @click="loadPalette(palette)" class="icon-btn" title="Загрузить">
                📂
              </button>
              <button @click="editPalette(palette)" class="icon-btn" title="Редактировать">
                ✏️
              </button>
              <button @click="deletePalette(palette.id)" class="icon-btn" title="Удалить">
                🗑️
              </button>
            </div>
          </div>
          
          <div class="palette-preview">
            <div 
              v-for="(color, index) in palette.colors" 
              :key="index"
              class="color-swatch"
              :style="{ backgroundColor: color }"
              :title="color"
            ></div>
          </div>
          
          <div class="palette-info">
            <span>{{ palette.colors.length }} цветов</span>
            <span>{{ formatDate(palette.createdAt) }}</span>
          </div>
          
          <div class="palette-tags" v-if="palette.tags && palette.tags.length">
            <span 
              v-for="tag in palette.tags" 
              :key="tag"
              class="tag"
              @click="searchQuery = tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div v-if="!filteredPalettes.length" class="empty-state">
          <div class="empty-icon">🎨</div>
          <h3>Библиотека пуста</h3>
          <p>Сохраните свою первую палитру в генераторе!</p>
          <router-link to="/generator" class="btn btn-primary">
            Создать палитру
          </router-link>
        </div>
      </div>
      
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>📁 Коллекции</h3>
          <div class="collections">
            <button 
              v-for="collection in collections" 
              :key="collection.id"
              class="collection-item"
              :class="{ active: activeCollection === collection.id }"
              @click="activeCollection = collection.id"
            >
              <span class="collection-icon">{{ collection.icon }}</span>
              <span class="collection-name">{{ collection.name }}</span>
              <span class="collection-count">{{ collection.count }}</span>
            </button>
          </div>
          
          <button @click="createNewCollection" class="btn btn-secondary btn-block">
            + Новая коллекция
          </button>
        </div>
        
        <div class="sidebar-section">
          <h3>📊 Статистика</h3>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">Всего палитр:</span>
              <span class="stat-value">{{ savedPalettes.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Цветов всего:</span>
              <span class="stat-value">{{ totalColors }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Последняя:</span>
              <span class="stat-value">{{ lastSavedDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LibraryView',
  
  setup() {
    const router = useRouter()
    const savedPalettes = ref([])
    const searchQuery = ref('')
    const sortBy = ref('date')
    const activeCollection = ref('all')
    
    const collections = ref([
      { id: 'all', name: 'Все палитры', icon: '📚', count: 0 },
      { id: 'favorites', name: 'Избранное', icon: '⭐', count: 0 },
      { id: 'work', name: 'Рабочие', icon: '💼', count: 0 },
      { id: 'personal', name: 'Личные', icon: '👤', count: 0 }
    ])
    
    const filteredPalettes = computed(() => {
      let filtered = [...savedPalettes.value]
      
      // Фильтрация по поиску
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(palette => 
          palette.name.toLowerCase().includes(query) ||
          (palette.tags && palette.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      }
      
      // Фильтрация по коллекции
      if (activeCollection.value !== 'all') {
        filtered = filtered.filter(palette => 
          palette.collection === activeCollection.value
        )
      }
      
      // Сортировка
      switch (sortBy.value) {
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'colors':
          filtered.sort((a, b) => b.colors.length - a.colors.length)
          break
        case 'date':
        default:
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
      
      return filtered
    })
    
    const totalColors = computed(() => {
      return savedPalettes.value.reduce((sum, palette) => sum + palette.colors.length, 0)
    })
    
    const lastSavedDate = computed(() => {
      if (savedPalettes.value.length === 0) return '—'
      const last = savedPalettes.value[0]
      return formatDate(last.createdAt, true)
    })
    
    const loadPalettes = () => {
      const palettes = JSON.parse(localStorage.getItem('palettes') || '[]')
      savedPalettes.value = palettes
      
      // Обновляем счетчики коллекций
      collections.value[0].count = palettes.length
      collections.value[1].count = palettes.filter(p => p.favorite).length
      collections.value[2].count = palettes.filter(p => p.collection === 'work').length
      collections.value[3].count = palettes.filter(p => p.collection === 'personal').length
    }
    
    const loadPalette = (palette) => {
      // Сохраняем палитру как текущую
      localStorage.setItem('currentPalette', JSON.stringify({
        palette: palette.colors.map(color => ({ value: color, pinned: false })),
        pinned: [],
        baseColor: palette.colors[0],
        colorCount: palette.colors.length
      }))
      
      // Переходим в генератор
      router.push('/generator')
    }
    
    const editPalette = (palette) => {
      // Переходим в генератор с ID для редактирования
      router.push({ path: '/generator', query: { edit: palette.id } })
    }
    
    const deletePalette = (id) => {
      if (confirm('Удалить эту палитру?')) {
        const updatedPalettes = savedPalettes.value.filter(p => p.id !== id)
        localStorage.setItem('palettes', JSON.stringify(updatedPalettes))
        loadPalettes()
      }
    }
    
    const createNewCollection = () => {
      const name = prompt('Введите название коллекции:')
      if (name) {
        collections.value.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          icon: '📁',
          count: 0
        })
      }
    }
    
    const formatDate = (dateString, short = false) => {
      const date = new Date(dateString)
      if (short) {
        return date.toLocaleDateString()
      }
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    onMounted(() => {
      loadPalettes()
    })
    
    return {
      savedPalettes,
      searchQuery,
      sortBy,
      activeCollection,
      collections,
      filteredPalettes,
      totalColors,
      lastSavedDate,
      loadPalette,
      editPalette,
      deletePalette,
      createNewCollection,
      formatDate
    }
  }
}
</script>

<style scoped>
.library-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.library-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.library-header h1 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.sort-select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.library-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.saved-palettes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  align-content: start;
}

.palette-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.palette-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.palette-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.palette-card-header h3 {
  color: #2d3748;
  margin: 0;
  font-size: 1.25rem;
}

.palette-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: #f7fafc;
  transform: scale(1.1);
}

.palette-preview {
  display: flex;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.color-swatch {
  flex: 1;
  transition: transform 0.3s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
  z-index: 1;
}

.palette-info {
  display: flex;
  justify-content: space-between;
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.palette-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #e2e8f0;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
  margin-bottom: 2rem;
}

.sidebar {
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

.collections {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.collection-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: none;
  background: #f7fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.collection-item:hover {
  background: #edf2f7;
}

.collection-item.active {
  background: #667eea;
  color: white;
}

.collection-icon {
  font-size: 1.25rem;
}

.collection-name {
  flex: 1;
}

.collection-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.875rem;
}

.collection-item.active .collection-count {
  background: rgba(255, 255, 255, 0.2);
}

.btn-block {
  width: 100%;
  margin-top: 0.5rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #718096;
}

.stat-value {
  color: #2d3748;
  font-weight: 600;
}

[data-theme="dark"] .library-header,
[data-theme="dark"] .palette-card,
[data-theme="dark"] .empty-state,
[data-theme="dark"] .sidebar-section {
  background: #2d3748;
}

[data-theme="dark"] .library-header h1,
[data-theme="dark"] .palette-card-header h3,
[data-theme="dark"] .empty-state h3,
[data-theme="dark"] .sidebar-section h3 {
  color: white;
}

[data-theme="dark"] .search-input,
[data-theme="dark"] .sort-select {
  background: #4a5568;
  border-color: #4a5568;
  color: white;
}

[data-theme="dark"] .tag {
  background: #4a5568;
  color: #cbd5e0;
}

[data-theme="dark"] .stat-label {
  color: #cbd5e0;
}

[data-theme="dark"] .stat-value {
  color: white;
}

@media (max-width: 1024px) {
  .library-content {
    grid-template-columns: 1fr;
  }
}
</style>