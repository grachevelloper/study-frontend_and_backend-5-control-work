<template>
  <div class="home-view">
    <div class="hero">
      <h1>🎨 Создавайте идеальные цветовые палитры</h1>
      <p class="subtitle">
        Профессиональный инструмент для дизайнеров и разработчиков. 
        Генерируйте, анализируйте и экспортируйте палитры в один клик.
      </p>
      <div class="hero-actions">
        <router-link to="/generator" class="btn btn-primary btn-lg">
          Начать создавать
        </router-link>
        <router-link to="/library" class="btn btn-secondary btn-lg">
          Посмотреть примеры
        </router-link>
      </div>
    </div>
    
    <div class="features">
      <div class="feature-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
    
    <div class="quick-generator">
      <h2>Быстрая генерация палитры</h2>
      <PaletteGenerator :showControls="false" />
    </div>
  </div>
</template>

<script>
import PaletteGenerator from '../components/PaletteGenerator.vue'

export default {
  name: 'HomeView',
  components: {
    PaletteGenerator
  },
  setup() {
    const features = [
      {
        icon: '🎯',
        title: 'Умная генерация',
        description: 'Алгоритмы создают гармоничные палитры на основе цветовой теории'
      },
      {
        icon: '📊',
        title: 'Анализ доступности',
        description: 'Проверка контрастности по стандартам WCAG 2.1'
      },
      {
        icon: '💾',
        title: 'Библиотека палитр',
        description: 'Сохраняйте и организовывайте ваши любимые цветовые схемы'
      },
      {
        icon: '📤',
        title: 'Экспорт во всех форматах',
        description: 'CSS, SCSS, Tailwind, Figma и другие популярные форматы'
      }
    ]
    
    return {
      features
    }
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.hero h1 {
  font-size: 3rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.features {
  padding: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
}

.quick-generator {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.quick-generator h2 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 2rem;
}

[data-theme="dark"] .hero,
[data-theme="dark"] .feature-card,
[data-theme="dark"] .quick-generator {
  background: #2d3748;
  color: white;
}

[data-theme="dark"] .hero h1,
[data-theme="dark"] .feature-card h3,
[data-theme="dark"] .quick-generator h2 {
  color: white;
}

[data-theme="dark"] .subtitle,
[data-theme="dark"] .feature-card p {
  color: #cbd5e0;
}
</style>