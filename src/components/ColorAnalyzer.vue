<template>
  <div class="color-analyzer">
    <h3>Анализатор цвета</h3>
    
    <div class="color-inputs">
      <div class="input-group">
        <label>Фон:</label>
        <input type="color" v-model="bgColor">
        <input v-model="bgColor" @input="updateHex('bg')">
      </div>
      
      <div class="input-group">
        <label>Текст:</label>
        <input type="color" v-model="textColor">
        <input v-model="textColor" @input="updateHex('text')">
      </div>
    </div>
    
    <div class="swap-btn" @click="swapColors">
      🔄 Поменять местами
    </div>
    
    <div class="contrast-results">
      <div class="result" :class="contrastClass">
        <strong>Контраст: {{ contrast.ratio }}:1</strong>
        <div>{{ contrast.level }}</div>
      </div>
      
      <div class="wcag-check">
        <div :class="{ pass: contrast.meetsAA }">
          AA: {{ contrast.meetsAA ? '✅' : '❌' }}
        </div>
        <div :class="{ pass: contrast.meetsAAA }">
          AAA: {{ contrast.meetsAAA ? '✅' : '❌' }}
        </div>
      </div>
    </div>
    
    <div class="demo" :style="{ background: bgColor, color: textColor }">
      <h4>Пример текста</h4>
      <p>Это пример текста для проверки читаемости.</p>
      <a :style="{ color: textColor }">Пример ссылки</a>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { checkContrast } from '../utils/contrastChecker'

export default {
  name: 'ColorAnalyzer',
  setup() {
    const bgColor = ref('#ffffff')
    const textColor = ref('#000000')

    const contrast = computed(() => checkContrast(bgColor.value, textColor.value))

    const contrastClass = computed(() => {
      if (contrast.value.ratio >= 7) return 'aaa'
      if (contrast.value.ratio >= 4.5) return 'aa'
      return 'poor'
    })

    const swapColors = () => {
      const temp = bgColor.value
      bgColor.value = textColor.value
      textColor.value = temp
    }

    const updateHex = (type) => {
      if (type === 'bg' && !bgColor.value.startsWith('#')) {
        bgColor.value = '#' + bgColor.value
      }
      if (type === 'text' && !textColor.value.startsWith('#')) {
        textColor.value = '#' + textColor.value
      }
    }

    return {
      bgColor,
      textColor,
      contrast,
      contrastClass,
      swapColors,
      updateHex
    }
  }
}
</script>

<style scoped>
.color-analyzer {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.color-analyzer h3 {
  margin-bottom: 1rem;
}

.color-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group input[type="color"] {
  width: 100%;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.swap-btn {
  text-align: center;
  margin: 1rem 0;
  cursor: pointer;
  color: #667eea;
}

.contrast-results {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: #f7fafc;
}

.result {
  text-align: center;
  margin-bottom: 1rem;
}

.result.aaa {
  color: #38a169;
}
.result.aa {
  color: #d69e2e;
}
.result.poor {
  color: #e53e3e;
}

.wcag-check {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.wcag-check .pass {
  color: #38a169;
}

.demo {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.demo h4 {
  margin-bottom: 0.5rem;
}

.demo a {
  display: block;
  margin-top: 0.5rem;
  text-decoration: underline;
}
</style>