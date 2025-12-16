<template>
  <div 
    class="color-card"
    :style="{ backgroundColor: color.value }"
    @click="copyToClipboard"
  >
    <div class="color-info" :class="{ 'light-text': isDarkColor }">
      <div class="color-value">
        {{ formattedColor }}
      </div>
      <div class="color-actions">
        <button 
          @click.stop="togglePin"
          class="action-btn"
          :class="{ pinned: color.pinned }"
          :title="color.pinned ? 'Открепить' : 'Закрепить'"
        >
          📌
        </button>
        <button 
          @click.stop="copyToClipboard"
          class="action-btn"
          title="Копировать"
        >
          📋
        </button>
      </div>
    </div>
    
    <div 
      v-if="copied" 
      class="copy-notification"
      :class="{ 'light-text': isDarkColor }"
    >
      ✓ Скопировано!
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ColorCard',
  props: {
    color: {
      type: Object,
      required: true
    },
    format: {
      type: String,
      default: 'hex',
      validator: (value) => ['hex', 'rgb'].includes(value)
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const copied = ref(false)
    const copyTimeout = ref(null)
    
    const formattedColor = computed(() => {
      if (props.format === 'rgb') {
        return hexToRgb(props.color.value)
      }
      return props.color.value.toUpperCase()
    })
    
    const isDarkColor = computed(() => {
      const hex = props.color.value.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness < 128
    })
    
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : hex
    }
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(formattedColor.value)
        copied.value = true
        emit('copy', formattedColor.value)
        
        if (copyTimeout.value) {
          clearTimeout(copyTimeout.value)
        }
        
        copyTimeout.value = setTimeout(() => {
          copied.value = false
        }, 2000)
      } catch (err) {
        console.error('Ошибка копирования:', err)
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea')
        textArea.value = formattedColor.value
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        copied.value = true
        emit('copy', formattedColor.value)
        
        setTimeout(() => {
          copied.value = false
        }, 2000)
      }
    }
    
    const togglePin = () => {
      emit('pin', props.index)
    }
    
    return {
      copied,
      formattedColor,
      isDarkColor,
      copyToClipboard,
      togglePin,
      hexToRgb
    }
  }
}
</script>

<style scoped>
.color-card {
  flex: 1;
  height: 120px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.light-text .color-value {
  color: white;
}

.light-text .action-btn {
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.color-value {
  font-family: 'Monaco', 'Courier New', monospace;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
}

.color-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
}

.action-btn.pinned {
  background: #fbbf24;
  border-color: #f59e0b;
}

.copy-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
</style>