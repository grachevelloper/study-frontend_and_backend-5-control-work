<template>
  <nav class="navigation">
    <div class="nav-container">
      <router-link to="/" class="logo">
        🎨 PalettePro
      </router-link>
      
      <div class="nav-links">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: $route.path === link.path }"
        >
          {{ link.name }}
        </router-link>
      </div>
      
      <div class="theme-toggle">
        <button @click="toggleTheme" class="theme-btn">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Navigation',
  
  setup() {
    const route = useRoute()
    const isDark = ref(false)
    
    const navLinks = [
      { path: '/', name: 'Главная' },
      { path: '/generator', name: 'Генератор' },
      { path: '/library', name: 'Библиотека' },
      { path: '/analyzer', name: 'Анализатор' },
      { path: '/export', name: 'Экспорт' }
    ]
    
    const toggleTheme = () => {
      isDark.value = !isDark.value
      document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    }
    
    watch(isDark, (newVal) => {
      localStorage.setItem('theme', newVal ? 'dark' : 'light')
    })
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDark.value = true
      document.documentElement.setAttribute('data-theme', 'dark')
    }
    
    return {
      navLinks,
      isDark,
      toggleTheme,
      route
    }
  }
}
</script>

<style scoped>
.navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.nav-link.active {
  color: white;
  background: #667eea;
}

.theme-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.theme-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .navigation {
  background: rgba(26, 32, 44, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .nav-link {
  color: #cbd5e0;
}

[data-theme="dark"] .nav-link:hover {
  color: white;
  background: rgba(102, 126, 234, 0.2);
}

[data-theme="dark"] .nav-link.active {
  color: #1a202c;
  background: #667eea;
}

[data-theme="dark"] .theme-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>