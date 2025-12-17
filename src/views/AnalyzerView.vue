<template>
  <div class="analyzer-view">
    <h1>🔍 Анализатор цветов</h1>
    <p class="subtitle">Проверяйте контрастность, доступность и получайте рекомендации</p>

    <div class="analyzer-grid">
      <div class="main-analyzer">
        <div class="contrast-checker card">
          <h3>📊 Проверка контрастности</h3>
          <div class="color-inputs">
            <div class="color-input-group">
              <label>Фон:</label>
              <input type="color" v-model="backgroundColor" class="color-picker-large">
              <input v-model="backgroundColor" class="color-value" @input="updateFromInput('background')">
            </div>
            <div class="color-input-group">
              <label>Текст:</label>
              <input type="color" v-model="textColor" class="color-picker-large">
              <input v-model="textColor" class="color-value" @input="updateFromInput('text')">
            </div>
          </div>

          <div class="contrast-results">
            <div class="result-card" :class="contrastClass">
              <h4>Коэффициент контраста</h4>
              <div class="ratio">{{ contrastRatio.toFixed(2) }}:1</div>
              <div class="level">{{ contrastLevel }}</div>
            </div>

            <div class="wcag-compliance">
              <h4>Соответствие WCAG 2.1</h4>
              <div class="compliance-item" :class="{ compliant: meetsAA }">
                <span>Уровень AA (мин. 4.5:1)</span>
                <span>{{ meetsAA ? '✅' : '❌' }}</span>
              </div>
              <div class="compliance-item" :class="{ compliant: meetsAAA }">
                <span>Уровень AAA (мин. 7:1)</span>
                <span>{{ meetsAAA ? '✅' : '❌' }}</span>
              </div>
              <div class="compliance-item" :class="{ compliant: meetsLargeAA }">
                <span>Крупный текст AA (мин. 3:1)</span>
                <span>{{ meetsLargeAA ? '✅' : '❌' }}</span>
              </div>
            </div>
          </div>

          <!-- Блок демонстрации текста с эмуляцией -->
          <div class="contrast-demo">
            <div
              class="demo-text"
              :style="{
                backgroundColor: simulatedBackgroundColor,
                color: simulatedTextColor
              }"
            >
              <h4>Пример текста (эмуляция: {{ activeBlindnessName }})</h4>
              <p>Это пример текста для проверки читаемости. Используйте эту комбинацию для заголовков, основного текста и ссылок.</p>
              <a href="#" :style="{ color: simulatedTextColor }">Пример ссылки</a>
            </div>
          </div>
        </div>

        <div class="color-blindness card">
          <h3>👁️ Эмуляция цветовой слепоты</h3>
            <p>Текущий режим: <strong>{{ activeBlindness }} ({{ activeBlindnessName }})</strong></p>
          <div class="blindness-types">
            <button
              v-for="type in blindnessTypes"
              :key="type.id"
              @click="activeBlindness = type.id"
              class="blindness-btn"
              :class="{ active: activeBlindness === type.id }"
            >
              {{ type.icon }} {{ type.name }}
            </button>
          </div>

          <div class="blindness-preview">
            <div
              v-for="color in simulatedDemoColors"
              :key="color"
              class="color-box"
              :style="{ backgroundColor: color }"
            >
              <span>{{ color }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <!-- Блок рекомендаций (оставлен без изменений) -->
        <div class="recommendations card">
          <h3>💡 Рекомендации</h3>
          <div class="recommendation-list">
            <div v-if="!meetsAA" class="recommendation warning">
              <strong>⚠️ Проблема с доступностью</strong>
              <p>Эта комбинация не соответствует минимальным требованиям доступности. Рассмотрите возможность изменить один из цветов.</p>
            </div>
            <div v-if="isTooBright" class="recommendation warning">
              <strong>🌞 Слишком ярко</strong>
              <p>Фон может быть слишком ярким для комфортного чтения. Попробуйте темнее оттенок.</p>
            </div>
            <div v-if="isTooDark" class="recommendation warning">
              <strong>🌙 Слишком темно</strong>
              <p>Комбинация может быть слишком контрастной. Рассмотрите более светлые оттенки.</p>
            </div>
            <div v-if="meetsAAA" class="recommendation success">
              <strong>🎉 Отличная доступность</strong>
              <p>Эта комбинация соответствует самым строгим стандартам доступности!</p>
            </div>
            <div class="recommendation info">
              <strong>💡 Советы по использованию</strong>
              <p>Для основного текста используйте контраст не менее 4.5:1, для крупного текста — 3:1.</p>
            </div>
          </div>
        </div>

        <div class="color-info card">
          <h3>📈 Информация о цветах</h3>
          <div class="color-details">
            <div class="color-detail">
              <span>Фон (HEX):</span>
              <code>{{ backgroundColor.toUpperCase() }}</code>
            </div>
            <div class="color-detail">
              <span>Текст (HEX):</span>
              <code>{{ textColor.toUpperCase() }}</code>
            </div>
            <div class="color-detail">
              <span>Яркость фона:</span>
              <span>{{ backgroundLuminance.toFixed(3) }}</span>
            </div>
            <div class="color-detail">
              <span>Яркость текста:</span>
              <span>{{ textLuminance.toFixed(3) }}</span>
            </div>
          </div>

          <div class="quick-tools">
            <h4>Быстрые инструменты</h4>
            <div class="tool-buttons">
              <button @click="swapColors" class="btn btn-secondary">
                🔄 Поменять местами
              </button>
              <button @click="generateAccessibleText" class="btn btn-secondary">
                🎨 Подобрать текст
              </button>
              <button @click="generateAccessibleBg" class="btn btn-secondary">
                🖼️ Подобрать фон
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { getContrastRatio, getLuminance } from '../utils/colorUtils'

function simulateColorBlindness(hexColor, type = 'normal') {
  // Убираем # если есть и проверяем длину
  const hex = hexColor.replace('#', '');
  
  // Поддерживаем как 6-символьные, так и 3-символьные HEX
  let r, g, b;
  
  if (hex.length === 3) {
    // Для формата #RGB -> #RRGGBB
    r = parseInt(hex[0] + hex[0], 16) / 255;
    g = parseInt(hex[1] + hex[1], 16) / 255;
    b = parseInt(hex[2] + hex[2], 16) / 255;
  } else {
    // Для формата #RRGGBB (берем первые 6 символов)
    const cleanHex = hex.substring(0, 6);
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  }
  
  // Оригинальные матрицы (оставляем как есть)
  const matrices = {
    normal: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ],
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758]
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7]
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114]
    ]
  };
  
  const matrix = matrices[type] || matrices.normal;
  
  // Применяем преобразование
  const newR = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2];
  const newG = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
  const newB = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];
  
  // Обратно в HEX с правильным округлением
  const toHex = (value) => {
    const intValue = Math.min(255, Math.max(0, Math.round(value * 255)));
    const hex = intValue.toString(16).padStart(2, '0');
    return hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

export default {
  name: 'AnalyzerView',

  setup() {
    const backgroundColor = ref('#ffffff');
    const textColor = ref('#000000');
    const activeBlindness = ref('normal');

    const blindnessTypes = [
      { id: 'normal', name: 'Нормальное', icon: '👁️' },
      { id: 'protanopia', name: 'Протанопия', icon: '🔴' },
      { id: 'deuteranopia', name: 'Дейтеранопия', icon: '🟢' },
      { id: 'tritanopia', name: 'Тританопия', icon: '🔵' },
      { id: 'achromatopsia', name: 'Ахроматопсия', icon: '⚫' }
    ];

    const demoColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];

    const simulatedDemoColors = computed(() => {
      if (activeBlindness.value === 'normal') {
        return demoColors;
      }
      return demoColors.map(color =>
        simulateColorBlindness(color, activeBlindness.value)
      );
    });

    const simulatedBackgroundColor = computed(() => {
      if (activeBlindness.value === 'normal') {
        return backgroundColor.value;
      }
      return simulateColorBlindness(backgroundColor.value, activeBlindness.value);
    });

    const simulatedTextColor = computed(() => {
      if (activeBlindness.value === 'normal') {
        return textColor.value;
      }
      return simulateColorBlindness(textColor.value, activeBlindness.value);
    });

    // Для отображения названия активного типа
    const activeBlindnessName = computed(() => {
      const type = blindnessTypes.find(t => t.id === activeBlindness.value);
      return type ? type.name : 'Нормальное';
    });

    // Остальные вычисляемые свойства (контраст, яркость и т.д.)
    const contrastRatio = computed(() => {
      return getContrastRatio(backgroundColor.value, textColor.value);
    });

    const backgroundLuminance = computed(() => {
      return getLuminance(backgroundColor.value);
    });

    const textLuminance = computed(() => {
      return getLuminance(textColor.value);
    });

    const meetsAA = computed(() => contrastRatio.value >= 4.5);
    const meetsAAA = computed(() => contrastRatio.value >= 7);
    const meetsLargeAA = computed(() => contrastRatio.value >= 3);

    const contrastLevel = computed(() => {
      if (contrastRatio.value >= 7) return 'AAA (Отлично)';
      if (contrastRatio.value >= 4.5) return 'AA (Хорошо)';
      if (contrastRatio.value >= 3) return 'AA для крупного текста';
      return 'Недостаточно';
    });

    const contrastClass = computed(() => {
      if (contrastRatio.value >= 4.5) return 'good';
      if (contrastRatio.value >= 3) return 'ok';
      return 'poor';
    });

    const isTooBright = computed(() => {
      return backgroundLuminance.value > 0.8 && contrastRatio.value < 4.5;
    });

    const isTooDark = computed(() => {
      return backgroundLuminance.value < 0.2 && textLuminance.value < 0.2;
    });

    const swapColors = () => {
      const temp = backgroundColor.value;
      backgroundColor.value = textColor.value;
      textColor.value = temp;
    };

    const updateFromInput = (type) => {
      // Добавляем # если его нет
      if (type === 'background' && !backgroundColor.value.startsWith('#')) {
        backgroundColor.value = '#' + backgroundColor.value.replace(/^#/, '');
      }
      if (type === 'text' && !textColor.value.startsWith('#')) {
        textColor.value = '#' + textColor.value.replace(/^#/, '');
      }
    };

    const generateAccessibleText = () => {
      const bgLum = backgroundLuminance.value;
      textColor.value = bgLum > 0.5 ? '#000000' : '#ffffff';
    };

    const generateAccessibleBg = () => {
      const textLum = textLuminance.value;
      backgroundColor.value = textLum > 0.5 ? '#000000' : '#ffffff';
    };

    // ВАЖНО: Возвращаем все используемые в шаблоне переменные
    return {
      backgroundColor,
      textColor,
      activeBlindness,
      blindnessTypes,
      demoColors,
      simulatedDemoColors,
      simulatedBackgroundColor,
      simulatedTextColor,
      activeBlindnessName,
      contrastRatio,
      backgroundLuminance,
      textLuminance,
      meetsAA,
      meetsAAA,
      meetsLargeAA,
      contrastLevel,
      contrastClass,
      isTooBright,
      isTooDark,
      swapColors,
      updateFromInput,
      generateAccessibleText,
      generateAccessibleBg
    };
  }
};
</script>

<style scoped>
/* Стили остаются без изменений, как в вашем исходном коде */
.analyzer-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.analyzer-view h1 {
  color: #2d3748;
  text-align: center;
}

.subtitle {
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
}

.analyzer-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.color-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-input-group label {
  font-weight: 600;
  color: #4a5568;
}

.color-picker-large {
  width: 100%;
  height: 80px;
  border: 3px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
}

.color-value {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Monaco', 'Courier New', monospace;
  text-align: center;
}

.contrast-results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.result-card {
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.result-card.good {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.result-card.ok {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

.result-card.poor {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
}

.result-card .ratio {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.result-card .level {
  font-size: 1.1rem;
  opacity: 0.9;
}

.wcag-compliance {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
}

.wcag-compliance h4 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.compliance-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.compliance-item:last-child {
  border-bottom: none;
}

.compliance-item.compliant {
  color: #38a169;
}

.contrast-demo {
  margin-top: 2rem;
}

.demo-text {
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.demo-text h4 {
  margin-bottom: 1rem;
}

.demo-text p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.demo-text a {
  text-decoration: none;
  font-weight: 600;
}

.blindness-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.blindness-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.blindness-btn:hover {
  border-color: #667eea;
}

.blindness-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.blindness-preview {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.color-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation {
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.recommendation.warning {
  background: #fff5f5;
  border-left-color: #f56565;
}

.recommendation.success {
  background: #f0fff4;
  border-left-color: #48bb78;
}

.recommendation.info {
  background: #ebf8ff;
  border-left-color: #4299e1;
}

.recommendation strong {
  display: block;
  margin-bottom: 0.5rem;
}

.color-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.color-detail {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 6px;
}

.color-detail code {
  font-family: 'Monaco', 'Courier New', monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.quick-tools h4 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.tool-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

[data-theme="dark"] .card {
  background: #2d3748;
}

[data-theme="dark"] .card h3,
[data-theme="dark"] .demo-text h4 {
  color: white;
}

[data-theme="dark"] .wcag-compliance {
  background: #4a5568;
}

[data-theme="dark"] .color-detail {
  background: #4a5568;
}

[data-theme="dark"] .color-detail code {
  background: #2d3748;
  color: white;
}

@media (max-width: 1024px) {
  .analyzer-grid {
    grid-template-columns: 1fr;
  }

  .color-inputs {
    grid-template-columns: 1fr;
  }

  .contrast-results {
    grid-template-columns: 1fr;
  }

  .tool-buttons {
    grid-template-columns: 1fr;
  }
}
</style>