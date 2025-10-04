<template>
  <div class="message-bubble" :class="messageClasses">
    <div class="message-content">
      <!-- Text Message -->
      <div v-if="message.type === 'text'" class="text-message">
        <p v-for="(line, index) in formattedContent" :key="index" v-html="line"></p>
      </div>
      
      <!-- Image Message -->
      <div v-else-if="message.type === 'image' || hasImageAttachment" class="image-message">
        <div class="image-container">
          <img 
            :src="getImageUrl()" 
            :alt="message.content"
            @load="onImageLoad"
            @error="onImageError"
            class="message-image"
          />
        </div>
        <p v-if="message.content" class="image-caption">{{ message.content }}</p>
      </div>
      
      <!-- File Message -->
      <div v-else-if="message.type === 'file' && !hasImageAttachment" class="file-message">
        <div class="file-container">
          <div class="file-icon">
            <i :class="getFileIcon()"></i>
          </div>
          <div class="file-info">
            <div class="file-name">{{ getFileName() }}</div>
            <div class="file-size">{{ formatFileSize(getFileSize()) }}</div>
          </div>
          <a 
            :href="getFileUrl()" 
            download 
            class="file-download"
            title="Download file"
          >
            <i class="fas fa-download"></i>
          </a>
        </div>
        <p v-if="message.content" class="file-caption">{{ message.content }}</p>
      </div>
      
      <!-- System Message -->
      <div v-else-if="message.type === 'system'" class="system-message">
        <i class="fas fa-info-circle"></i>
        <span>{{ message.content }}</span>
      </div>
    </div>
    
    <!-- Message Meta Info -->
    <div class="message-meta">
      <span class="message-time">{{ formatTime(message.timestamp) }}</span>
      
      <!-- Message Status (for own messages) -->
      <div v-if="isOwn" class="message-status">
        <i v-if="message.status === 'sending'" class="fas fa-clock sending"></i>
        <i v-else-if="message.status === 'sent'" class="fas fa-check sent"></i>
        <i v-else-if="message.status === 'delivered'" class="fas fa-check-double delivered"></i>
        <i v-else-if="message.status === 'read'" class="fas fa-check-double read"></i>
        <i v-else-if="message.status === 'failed'" class="fas fa-exclamation-triangle failed"></i>
      </div>
      
      <!-- Retry Button (for failed messages) -->
      <button 
        v-if="isOwn && message.status === 'failed'" 
        @click="retryMessage"
        class="retry-btn"
        title="Retry sending message"
      >
        <i class="fas fa-redo"></i>
        Retry
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageBubble',
  props: {
    message: {
      type: Object,
      required: true
    },
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  emits: ['retry-send'],
  computed: {
    messageClasses() {
      return {
        'own-message': this.isOwn,
        'agent-message': !this.isOwn && this.message.senderType === 'agent',
        'system-message': this.message.type === 'system',
        [`status-${this.message.status}`]: this.message.status
      }
    },
    
    formattedContent() {
      if (!this.message.content) return []
      
      // Split by line breaks and format each line
      return this.message.content
        .split('\n')
        .map(line => this.formatTextLine(line))
    },
    
    hasImageAttachment() {
      return this.message.attachments && 
             this.message.attachments.some(att => att.type && att.type.startsWith('image/'))
    }
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      
      if (diffInMinutes < 1) {
        return 'Just now'
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`
      } else if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    
    formatTextLine(line) {
      // Auto-link URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g
      let formatted = line.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Auto-link emails
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
      formatted = formatted.replace(emailRegex, '<a href="mailto:$1">$1</a>')
      
      // Format order numbers
      const orderRegex = /(ORD-[A-Z0-9]+)/g
      formatted = formatted.replace(orderRegex, '<strong class="order-number">$1</strong>')
      
      // Format product codes
      const productRegex = /([A-Z]{2,}\d{3,})/g
      formatted = formatted.replace(productRegex, '<strong class="product-code">$1</strong>')
      
      return formatted
    },
    
    getImageUrl() {
      if (this.hasImageAttachment) {
        const imageAttachment = this.message.attachments.find(att => 
          att.type && att.type.startsWith('image/')
        )
        return imageAttachment?.url || ''
      }
      return ''
    },
    
    getFileUrl() {
      if (this.message.attachments && this.message.attachments.length > 0) {
        return this.message.attachments[0].url || ''
      }
      return ''
    },
    
    getFileName() {
      if (this.message.attachments && this.message.attachments.length > 0) {
        return this.message.attachments[0].name || 'Unnamed file'
      }
      return 'File'
    },
    
    getFileSize() {
      if (this.message.attachments && this.message.attachments.length > 0) {
        return this.message.attachments[0].size || 0
      }
      return 0
    },
    
    getFileIcon() {
      const fileName = this.getFileName().toLowerCase()
      
      if (fileName.includes('.pdf')) return 'fas fa-file-pdf'
      if (fileName.includes('.doc') || fileName.includes('.docx')) return 'fas fa-file-word'
      if (fileName.includes('.xls') || fileName.includes('.xlsx')) return 'fas fa-file-excel'
      if (fileName.includes('.ppt') || fileName.includes('.pptx')) return 'fas fa-file-powerpoint'
      if (fileName.includes('.zip') || fileName.includes('.rar')) return 'fas fa-file-archive'
      if (fileName.includes('.txt')) return 'fas fa-file-alt'
      
      return 'fas fa-file'
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    retryMessage() {
      this.$emit('retry-send', this.message)
    },
    
    onImageLoad() {
      // Scroll parent container if needed
      this.$emit('message-updated')
    },
    
    onImageError(event) {
      // Handle broken image
      event.target.style.display = 'none'
      console.error('Failed to load image:', this.getImageUrl())
    }
  }
}
</script>

<style scoped>
.message-bubble {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  max-width: 80%;
  word-wrap: break-word;
}

/* Message alignment */
.message-bubble.own-message {
  align-self: flex-end;
  align-items: flex-end;
}

.message-bubble.agent-message {
  align-self: flex-start;
  align-items: flex-start;
}

.message-bubble.system-message {
  align-self: center;
  align-items: center;
  max-width: 90%;
}

/* Message content styling */
.message-content {
  border-radius: 18px;
  padding: 0.75rem 1rem;
  position: relative;
  max-width: 100%;
}

.own-message .message-content {
  background: var(--primary-blue);
  color: white;
  border-bottom-right-radius: 6px;
}

.agent-message .message-content {
  background: white;
  color: var(--gray-800);
  border: 1px solid var(--gray-200);
  border-bottom-left-radius: 6px;
}

.system-message .message-content {
  background: var(--gray-100);
  color: var(--gray-600);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Text message */
.text-message p {
  margin: 0;
  line-height: 1.4;
  font-size: 0.875rem;
}

.text-message p + p {
  margin-top: 0.5rem;
}

.text-message :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.own-message .text-message :deep(a) {
  color: rgba(255, 255, 255, 0.9);
}

.text-message :deep(.order-number) {
  font-weight: 600;
  color: var(--success);
}

.text-message :deep(.product-code) {
  font-weight: 600;
  color: var(--primary-blue);
}

.own-message .text-message :deep(.order-number),
.own-message .text-message :deep(.product-code) {
  color: rgba(255, 255, 255, 0.9);
}

/* Image message */
.image-message {
  max-width: 250px;
}

.image-container {
  border-radius: 12px;
  overflow: hidden;
  background: var(--gray-100);
}

.message-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}

.image-caption {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* File message */
.file-message {
  min-width: 200px;
}

.file-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: var(--gray-50);
  border-radius: 8px;
  border: 1px solid var(--gray-200);
}

.own-message .file-container {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-blue);
  color: white;
  border-radius: 6px;
  font-size: 1.125rem;
}

.own-message .file-icon {
  background: rgba(255, 255, 255, 0.2);
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--gray-800);
  margin-bottom: 0.125rem;
}

.own-message .file-name {
  color: white;
}

.file-size {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.own-message .file-size {
  color: rgba(255, 255, 255, 0.7);
}

.file-download {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-blue);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.own-message .file-download {
  background: rgba(255, 255, 255, 0.2);
}

.file-download:hover {
  background: var(--primary-blue-dark);
}

.file-caption {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* System message */
.system-message .message-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.system-message i {
  color: var(--primary-blue);
  font-size: 0.875rem;
}

/* Message meta */
.message-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--gray-500);
}

.own-message .message-meta {
  flex-direction: row-reverse;
}

.message-time {
  font-size: 0.75rem;
}

.message-status i {
  font-size: 0.75rem;
}

.message-status .sending {
  color: var(--gray-400);
}

.message-status .sent {
  color: var(--gray-500);
}

.message-status .delivered {
  color: var(--primary-blue);
}

.message-status .read {
  color: var(--success);
}

.message-status .failed {
  color: var(--error);
}

/* Retry button */
.retry-btn {
  background: none;
  border: none;
  color: var(--error);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: var(--error-light);
}

/* Status-based styling */
.status-failed .message-content {
  opacity: 0.7;
  border-color: var(--error);
}

.status-sending .message-content {
  opacity: 0.8;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 90%;
  }
  
  .image-message {
    max-width: 200px;
  }
  
  .file-container {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .file-info {
    order: 1;
  }
  
  .file-download {
    order: 2;
  }
}
</style>
