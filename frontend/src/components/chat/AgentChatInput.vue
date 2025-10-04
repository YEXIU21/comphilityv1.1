<template>
  <div class="agent-chat-input">
    <form @submit.prevent="sendMessage" class="input-form">
      <div class="input-container">
        <textarea
          ref="textInput"
          v-model="inputText"
          :placeholder="placeholder"
          class="message-input"
          rows="1"
          @input="handleInput"
          @keydown="handleKeyDown"
          @focus="handleFocus"
          @blur="handleBlur"
        ></textarea>
        
        <div class="input-actions">
          <button type="submit" :disabled="!canSend" class="send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AgentChatInput',
  props: {
    placeholder: {
      type: String,
      default: 'Type your response...'
    }
  },
  emits: ['send-message', 'typing'],
  data() {
    return {
      inputText: '',
      typingTimer: null
    }
  },
  computed: {
    canSend() {
      return this.inputText.trim().length > 0
    }
  },
  methods: {
    sendMessage() {
      if (!this.canSend) return
      
      const message = this.inputText.trim()
      this.$emit('send-message', message)
      this.inputText = ''
      this.autoResize()
    },
    
    handleInput() {
      this.autoResize()
      this.handleTyping()
    },
    
    handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage()
      }
    },
    
    handleFocus() {
      // Agent focused on input
    },
    
    handleBlur() {
      this.$emit('typing', false)
    },
    
    handleTyping() {
      this.$emit('typing', true)
      
      if (this.typingTimer) {
        clearTimeout(this.typingTimer)
      }
      
      this.typingTimer = setTimeout(() => {
        this.$emit('typing', false)
      }, 1000)
    },
    
    autoResize() {
      this.$nextTick(() => {
        const textarea = this.$refs.textInput
        if (textarea) {
          textarea.style.height = 'auto'
          textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
        }
      })
    }
  },
  
  beforeUnmount() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer)
    }
  }
}
</script>

<style scoped>
.agent-chat-input {
  width: 100%;
}

.input-form {
  width: 100%;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  transition: border-color 0.2s ease;
}

.input-container:focus-within {
  border-color: var(--primary-blue);
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.4;
  font-family: var(--font-family-primary);
  min-height: 20px;
  max-height: 120px;
}

.message-input::placeholder {
  color: var(--gray-500);
}

.send-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--primary-blue);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-blue-dark);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
