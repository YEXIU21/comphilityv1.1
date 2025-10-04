<template>
  <div class="chat-input">
    <form @submit.prevent="handleSubmit" class="input-form">
      <!-- File Upload Area (Hidden) -->
      <input
        ref="fileInput"
        type="file"
        @change="handleFileSelect"
        accept="image/*,.pdf,.doc,.docx,.txt"
        style="display: none"
        multiple
      />
      
      <!-- Main Input Container -->
      <div class="input-container" :class="{ 'focused': isFocused, 'disabled': disabled }">
        <!-- File Preview Area -->
        <div v-if="selectedFiles.length > 0" class="file-preview">
          <div v-for="(file, index) in selectedFiles" :key="index" class="file-preview-item">
            <div v-if="file.type.startsWith('image/')" class="image-preview">
              <img :src="file.preview" :alt="file.name" />
              <button @click="removeFile(index)" class="remove-file-btn" type="button">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-else class="file-preview">
              <div class="file-preview-icon">
                <i :class="getFileIcon(file.name)"></i>
              </div>
              <div class="file-preview-info">
                <div class="file-name">{{ file.name }}</div>
                <div class="file-size">{{ formatFileSize(file.size) }}</div>
              </div>
              <button @click="removeFile(index)" class="remove-file-btn" type="button">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Input Controls -->
        <div class="input-controls">
          <!-- Attach File Button -->
          <button
            @click="$refs.fileInput.click()"
            type="button"
            class="attach-btn"
            :disabled="disabled"
            title="Attach file"
          >
            <i class="fas fa-paperclip"></i>
          </button>
          
          <!-- Text Input -->
          <div class="text-input-wrapper">
            <textarea
              ref="textInput"
              v-model="inputText"
              :placeholder="placeholder"
              :disabled="disabled"
              class="text-input"
              rows="1"
              @input="handleInput"
              @keydown="handleKeyDown"
              @focus="isFocused = true"
              @blur="isFocused = false"
              @paste="handlePaste"
            ></textarea>
            
            <!-- Emoji Button -->
            <button
              @click="toggleEmojiPicker"
              type="button"
              class="emoji-btn"
              :disabled="disabled"
              title="Add emoji"
            >
              <i class="fas fa-smile"></i>
            </button>
          </div>
          
          <!-- Send Button -->
          <button
            type="submit"
            class="send-btn"
            :disabled="!canSend || disabled"
            title="Send message"
          >
            <i v-if="isSending" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      
      <!-- Emoji Picker -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-header">
          <span>Frequently Used</span>
          <button @click="toggleEmojiPicker" class="close-emoji-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="emoji-grid">
          <button
            v-for="emoji in frequentEmojis"
            :key="emoji"
            @click="insertEmoji(emoji)"
            class="emoji-item"
            type="button"
          >
            {{ emoji }}
          </button>
        </div>
        <div class="emoji-categories">
          <div class="emoji-category">
            <span class="category-label">Smileys</span>
            <div class="emoji-grid">
              <button
                v-for="emoji in smileyEmojis"
                :key="emoji"
                @click="insertEmoji(emoji)"
                class="emoji-item"
                type="button"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
          <div class="emoji-category">
            <span class="category-label">Gestures</span>
            <div class="emoji-grid">
              <button
                v-for="emoji in gestureEmojis"
                :key="emoji"
                @click="insertEmoji(emoji)"
                class="emoji-item"
                type="button"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Upload Progress -->
      <div v-if="uploadProgress > 0" class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <span class="progress-text">Uploading... {{ uploadProgress }}%</span>
      </div>
    </form>
    
    <!-- Quick Suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0" class="quick-suggestions">
      <button
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="suggestion-btn"
        type="button"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatInput',
  props: {
    placeholder: {
      type: String,
      default: 'Type your message...'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 1000
    }
  },
  emits: ['send-message', 'send-file', 'typing'],
  data() {
    return {
      inputText: '',
      selectedFiles: [],
      isFocused: false,
      isSending: false,
      showEmojiPicker: false,
      showSuggestions: false,
      uploadProgress: 0,
      typingTimer: null,
      
      // Quick suggestions based on common queries
      suggestions: [
        "What's the status of my order?",
        "I need help with product compatibility",
        "Can you recommend a graphics card?",
        "What payment methods do you accept?",
        "How do I track my delivery?",
        "I want to return an item",
        "Technical support needed",
        "When will my order ship?"
      ],
      
      // Emoji collections
      frequentEmojis: ['😊', '👍', '❤️', '😢', '😮', '👏', '🔥', '💯'],
      smileyEmojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😊', '😇', '🥰', '😍', '🤩', '😘'],
      gestureEmojis: ['👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '✌️', '🤞', '👌', '🤟', '🤘', '🤙', '💪', '🦾', '🖐️']
    }
  },
  computed: {
    canSend() {
      return (this.inputText.trim().length > 0 || this.selectedFiles.length > 0) && !this.isSending
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.canSend) return
      
      this.isSending = true
      
      try {
        // Send files first if any
        if (this.selectedFiles.length > 0) {
          await this.sendFiles()
        }
        
        // Send text message if any
        if (this.inputText.trim()) {
          await this.sendMessage()
        }
        
        this.clearInput()
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        this.isSending = false
      }
    },
    
    async sendMessage() {
      const message = this.inputText.trim()
      this.$emit('send-message', message)
    },
    
    async sendFiles() {
      for (const file of this.selectedFiles) {
        this.$emit('send-file', file.file)
      }
    },
    
    handleInput() {
      this.autoResize()
      this.handleTyping()
      this.updateSuggestions()
    },
    
    handleKeyDown(event) {
      // Send on Enter (without Shift)
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.handleSubmit()
        return
      }
      
      // Add new line on Shift+Enter
      if (event.key === 'Enter' && event.shiftKey) {
        // Allow default behavior (new line)
        return
      }
      
      // Hide suggestions on Escape
      if (event.key === 'Escape') {
        this.showSuggestions = false
        this.showEmojiPicker = false
      }
    },
    
    handleTyping() {
      // Emit typing indicator
      this.$emit('typing', true)
      
      // Clear previous timer
      if (this.typingTimer) {
        clearTimeout(this.typingTimer)
      }
      
      // Set timer to stop typing indicator
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
    },
    
    updateSuggestions() {
      const text = this.inputText.toLowerCase().trim()
      
      if (text.length < 3) {
        this.showSuggestions = false
        return
      }
      
      // Show suggestions if text matches common patterns
      const matchingSuggestions = this.suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(text)
      )
      
      this.showSuggestions = matchingSuggestions.length > 0 && text.length >= 3
    },
    
    selectSuggestion(suggestion) {
      this.inputText = suggestion
      this.showSuggestions = false
      this.autoResize()
      this.$refs.textInput.focus()
    },
    
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      
      for (const file of files) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
          continue
        }
        
        // Check file count limit
        if (this.selectedFiles.length >= 5) {
          alert('Maximum 5 files can be attached at once.')
          break
        }
        
        const fileData = {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: null
        }
        
        // Generate preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            fileData.preview = e.target.result
          }
          reader.readAsDataURL(file)
        }
        
        this.selectedFiles.push(fileData)
      }
      
      // Clear the input
      event.target.value = ''
    },
    
    handlePaste(event) {
      const items = event.clipboardData?.items
      if (!items) return
      
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          event.preventDefault()
          
          const file = item.getAsFile()
          if (file) {
            this.handleFileSelect({ target: { files: [file] } })
          }
        }
      }
    },
    
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker
      this.showSuggestions = false
    },
    
    insertEmoji(emoji) {
      const textarea = this.$refs.textInput
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      this.inputText = this.inputText.substring(0, start) + emoji + this.inputText.substring(end)
      
      this.$nextTick(() => {
        textarea.focus()
        const newPosition = start + emoji.length
        textarea.setSelectionRange(newPosition, newPosition)
      })
      
      this.autoResize()
    },
    
    getFileIcon(fileName) {
      const extension = fileName.toLowerCase().split('.').pop()
      
      switch (extension) {
        case 'pdf': return 'fas fa-file-pdf'
        case 'doc':
        case 'docx': return 'fas fa-file-word'
        case 'xls':
        case 'xlsx': return 'fas fa-file-excel'
        case 'ppt':
        case 'pptx': return 'fas fa-file-powerpoint'
        case 'txt': return 'fas fa-file-alt'
        case 'zip':
        case 'rar': return 'fas fa-file-archive'
        default: return 'fas fa-file'
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    clearInput() {
      this.inputText = ''
      this.selectedFiles = []
      this.showEmojiPicker = false
      this.showSuggestions = false
      this.autoResize()
    },
    
    focusInput() {
      this.$refs.textInput?.focus()
    }
  },
  
  mounted() {
    // Auto-resize on mount
    this.autoResize()
  },
  
  beforeUnmount() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer)
    }
  }
}
</script>

<style scoped>
.chat-input {
  position: relative;
}

.input-form {
  width: 100%;
}

.input-container {
  border: 2px solid var(--gray-300);
  border-radius: 12px;
  background: white;
  transition: all 0.2s ease;
  overflow: hidden;
}

.input-container.focused {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-container.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* File Preview */
.file-preview {
  padding: 0.75rem;
  border-bottom: 1px solid var(--gray-200);
  max-height: 120px;
  overflow-y: auto;
}

.file-preview-item {
  position: relative;
  margin-bottom: 0.5rem;
}

.file-preview-item:last-child {
  margin-bottom: 0;
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-right: 0.5rem;
}

.image-preview img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--gray-50);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.file-preview-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-blue);
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
}

.file-preview-info {
  flex: 1;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 0.125rem;
}

.file-size {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.remove-file-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--error);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: background 0.2s ease;
}

.remove-file-btn:hover {
  background: #dc2626;
}

/* Input Controls */
.input-controls {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem;
}

.attach-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--gray-100);
  color: var(--gray-600);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.attach-btn:hover:not(:disabled) {
  background: var(--gray-200);
  color: var(--gray-700);
}

.attach-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  background: var(--gray-50);
  border-radius: 8px;
  padding-right: 0.5rem;
}

.text-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.4;
  resize: none;
  font-family: var(--font-family-primary);
  color: var(--gray-800);
  min-height: 20px;
  max-height: 120px;
}

.text-input::placeholder {
  color: var(--gray-500);
}

.text-input:disabled {
  cursor: not-allowed;
}

.emoji-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--gray-500);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.emoji-btn:hover:not(:disabled) {
  background: var(--gray-200);
  color: var(--gray-700);
}

.send-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--primary-blue);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-blue-dark);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Emoji Picker */
.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  margin-bottom: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
  z-index: 10;
}

.emoji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--gray-700);
}

.close-emoji-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--gray-500);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.25rem;
}

.emoji-item {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-item:hover {
  background: var(--gray-100);
}

.emoji-category {
  margin-top: 1rem;
}

.category-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
}

/* Quick Suggestions */
.quick-suggestions {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  margin-bottom: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.suggestion-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--gray-700);
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--gray-100);
}

.suggestion-btn:hover {
  background: var(--gray-50);
}

.suggestion-btn:last-child {
  border-bottom: none;
}

/* Upload Progress */
.upload-progress {
  padding: 0.75rem;
  border-top: 1px solid var(--gray-200);
}

.progress-bar {
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-blue);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--gray-600);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .input-controls {
    gap: 0.25rem;
  }
  
  .attach-btn,
  .send-btn {
    width: 32px;
    height: 32px;
  }
  
  .emoji-picker {
    max-height: 200px;
  }
}
</style>
