<template>
  <div class="chat-widget" :class="widgetClasses">
    <!-- Chat Button (Minimized State) -->
    <Transition name="fade">
      <div 
        v-if="!isExpanded" 
        class="chat-button"
        @click="toggleChat"
        :class="{ 'has-notification': unreadCount > 0 }"
      >
        <div class="chat-icon">
          <i class="fas fa-comments"></i>
        </div>
        <div v-if="unreadCount > 0" class="notification-badge">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </div>
        <div class="chat-tooltip">
          Need help? Chat with us!
        </div>
      </div>
    </Transition>

    <!-- Chat Window (Expanded State) -->
    <Transition name="slide-up">
      <div v-if="isExpanded" class="chat-window">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="agent-info">
            <div class="agent-avatar">
              <i v-if="!currentAgent" class="fas fa-headset"></i>
              <img v-else :src="currentAgent.avatar" :alt="currentAgent.name" />
            </div>
            <div class="agent-details">
              <h4>{{ currentAgent ? currentAgent.name : 'COMPHILITY Support' }}</h4>
              <span class="status" :class="connectionStatus">
                <i class="fas fa-circle"></i>
                {{ getStatusText() }}
              </span>
            </div>
          </div>
          <div class="chat-controls">
            <button 
              @click="minimizeChat" 
              class="control-btn minimize-btn"
              title="Minimize"
            >
              <i class="fas fa-minus"></i>
            </button>
            <button 
              @click="closeChat" 
              class="control-btn close-btn"
              title="Close"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Quick Actions (when no messages) -->
        <div v-if="messages.length === 0" class="quick-actions">
          <h5>How can we help you today?</h5>
          <div class="action-buttons">
            <button 
              @click="sendQuickMessage('I need help tracking my order')"
              class="action-btn"
            >
              <i class="fas fa-shipping-fast"></i>
              Track Order
            </button>
            <button 
              @click="sendQuickMessage('I have a question about a product')"
              class="action-btn"
            >
              <i class="fas fa-desktop"></i>
              Product Info
            </button>
            <button 
              @click="sendQuickMessage('I need help building a PC')"
              class="action-btn"
            >
              <i class="fas fa-tools"></i>
              PC Building
            </button>
            <button 
              @click="sendQuickMessage('I have a payment issue')"
              class="action-btn"
            >
              <i class="fas fa-credit-card"></i>
              Payment Help
            </button>
          </div>
        </div>

        <!-- Messages Container -->
        <div class="messages-container" ref="messagesContainer">
          <div class="messages-list">
            <!-- Welcome Message -->
            <div v-if="messages.length === 0" class="welcome-message">
              <div class="welcome-avatar">
                <i class="fas fa-robot"></i>
              </div>
              <div class="welcome-content">
                <p>Hi there! 👋</p>
                <p>Welcome to COMPHILITY support. I'm here to help with any questions about our products, orders, or technical support.</p>
                <p>What can I help you with today?</p>
              </div>
            </div>

            <!-- Chat Messages -->
            <MessageBubble
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :is-own="isOwnMessage(message)"
              @retry-send="retrySendMessage"
            />

            <!-- Typing Indicator -->
            <div v-if="isAgentTyping" class="typing-indicator">
              <div class="typing-avatar">
                <i class="fas fa-headset"></i>
              </div>
              <div class="typing-bubbles">
                <div class="typing-bubble">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-container">
          <ChatInput
            @send-message="handleSendMessage"
            @send-file="handleSendFile"
            @typing="handleTyping"
            :disabled="!isConnected"
            :placeholder="getInputPlaceholder()"
          />
        </div>

        <!-- Connection Status -->
        <div v-if="!isConnected" class="connection-status">
          <i class="fas fa-wifi"></i>
          Reconnecting...
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import chatService from '@/services/chatService'
import MessageBubble from './MessageBubble.vue'
import ChatInput from './ChatInput.vue'

export default {
  name: 'ChatWidget',
  components: {
    MessageBubble,
    ChatInput
  },
  data() {
    return {
      isExpanded: false,
      isConnected: false,
      connectionStatus: 'offline',
      currentAgent: null,
      messages: [],
      unreadCount: 0,
      isAgentTyping: false,
      typingTimeout: null,
      isInitializing: false
    }
  },
  computed: {
    ...mapState(['user']),
    
    widgetClasses() {
      return {
        'expanded': this.isExpanded,
        'has-unread': this.unreadCount > 0,
        'connecting': this.isInitializing
      }
    }
  },
  methods: {
    async toggleChat() {
      if (!this.isExpanded) {
        this.isExpanded = true
        await this.initializeChat()
      } else {
        this.minimizeChat()
      }
    },

    minimizeChat() {
      this.isExpanded = false
    },

    async closeChat() {
      if (confirm('Are you sure you want to close this chat session?')) {
        await chatService.closeChat()
        this.resetChatState()
      }
    },

    async initializeChat() {
      if (this.isInitializing) return
      
      this.isInitializing = true
      
      try {
        const result = await chatService.initializeChat(this.user?.id)
        
        if (result.success) {
          this.setupChatListeners()
          await this.loadChatHistory()
        } else {
          console.error('Failed to initialize chat:', result.message)
        }
      } catch (error) {
        console.error('Chat initialization error:', error)
      } finally {
        this.isInitializing = false
      }
    },

    setupChatListeners() {
      // Message listener
      chatService.addMessageListener((message) => {
        this.handleIncomingMessage(message)
      })

      // Status listener
      chatService.addStatusListener((status, data) => {
        this.handleStatusChange(status, data)
      })

      // Typing listener
      chatService.addTypingListener((data) => {
        this.handleTypingIndicator(data)
      })
    },

    async loadChatHistory() {
      const result = await chatService.getChatHistory()
      if (result.success) {
        this.messages = result.messages || []
        this.scrollToBottom()
      }
    },

    handleIncomingMessage(message) {
      // Add to messages if not already present
      if (!this.messages.find(m => m.id === message.id)) {
        this.messages.push(message)
        
        // Increment unread count if chat is minimized
        if (!this.isExpanded && !this.isOwnMessage(message)) {
          this.unreadCount++
        }
        
        this.scrollToBottom()
      }
    },

    handleStatusChange(status, data) {
      this.connectionStatus = status
      
      switch (status) {
        case 'connected':
          this.isConnected = true
          break
        case 'disconnected':
        case 'error':
        case 'failed':
          this.isConnected = false
          break
        case 'agent_connected':
          this.currentAgent = data
          break
        case 'agent_disconnected':
          this.currentAgent = null
          break
      }
    },

    handleTypingIndicator(data) {
      if (data.isTyping) {
        this.isAgentTyping = true
        this.scrollToBottom()
      } else {
        this.isAgentTyping = false
      }
    },

    async handleSendMessage(content) {
      const result = await chatService.sendMessage(content, 'text')
      
      if (result.success) {
        this.scrollToBottom()
      } else {
        console.error('Failed to send message:', result.message)
      }
    },

    async handleSendFile(file) {
      const uploadResult = await chatService.uploadFile(file)
      
      if (uploadResult.success) {
        const messageContent = file.type.startsWith('image/') 
          ? 'Sent an image' 
          : `Sent file: ${file.name}`
          
        const result = await chatService.sendMessage(messageContent, 'file', [uploadResult.file])
        
        if (result.success) {
          this.scrollToBottom()
        }
      } else {
        alert(uploadResult.message)
      }
    },

    handleTyping(isTyping) {
      chatService.sendTypingIndicator(isTyping)
    },

    sendQuickMessage(message) {
      this.handleSendMessage(message)
    },

    async retrySendMessage(message) {
      const result = await chatService.sendMessage(message.content, message.type, message.attachments)
      
      if (result.success) {
        // Update message status
        const index = this.messages.findIndex(m => m.id === message.id)
        if (index !== -1) {
          this.messages[index].status = 'sent'
        }
      }
    },

    isOwnMessage(message) {
      return message.senderType === 'customer' && 
             (!this.user || message.senderId === this.user.id)
    },

    getStatusText() {
      switch (this.connectionStatus) {
        case 'connected':
          return this.currentAgent ? 'Online' : 'Online'
        case 'connecting':
          return 'Connecting...'
        case 'disconnected':
          return 'Offline'
        default:
          return 'Offline'
      }
    },

    getInputPlaceholder() {
      if (!this.isConnected) {
        return 'Connecting...'
      }
      return this.currentAgent 
        ? 'Type your message...' 
        : 'Type your message... (automated responses active)'
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messagesContainer) {
          const container = this.$refs.messagesContainer
          container.scrollTop = container.scrollHeight
        }
      })
    },

    resetChatState() {
      this.isExpanded = false
      this.messages = []
      this.unreadCount = 0
      this.currentAgent = null
      this.isAgentTyping = false
      this.connectionStatus = 'offline'
      this.isConnected = false
    }
  },

  mounted() {
    // Auto-expand chat if there are URL parameters indicating support need
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('support') || urlParams.get('chat')) {
      this.toggleChat()
    }
  },

  beforeUnmount() {
    chatService.disconnect()
  }
}
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: var(--font-family-primary);
}

/* Chat Button */
.chat-button {
  position: relative;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark));
  border-radius: 50%;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.chat-button:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
}

.chat-button.has-notification {
  animation: bounce 1s infinite;
}

.chat-icon {
  color: white;
  font-size: 1.5rem;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.chat-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--gray-900);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.chat-button:hover .chat-tooltip {
  opacity: 1;
}

/* Chat Window */
.chat-window {
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--gray-200);
}

/* Chat Header */
.chat-header {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark));
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.agent-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.agent-details h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.9;
}

.status.connected {
  color: #10b981;
}

.status.offline {
  color: #ef4444;
}

.chat-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Quick Actions */
.quick-actions {
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.quick-actions h5 {
  margin: 0 0 1rem 0;
  color: var(--gray-700);
  font-size: 0.875rem;
  font-weight: 600;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  background: white;
  color: var(--gray-700);
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--gray-50);
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.action-btn i {
  font-size: 1rem;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: var(--gray-50);
}

.welcome-message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.welcome-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.welcome-content {
  flex: 1;
}

.welcome-content p {
  margin: 0 0 0.5rem 0;
  color: var(--gray-700);
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin: 1rem 0;
}

.typing-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.typing-bubble {
  background: white;
  padding: 0.75rem;
  border-radius: 18px;
  display: flex;
  gap: 0.25rem;
  box-shadow: var(--shadow-sm);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gray-400);
  animation: typing 1.4s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Chat Input Container */
.chat-input-container {
  padding: 1rem;
  background: white;
  border-top: 1px solid var(--gray-200);
}

/* Connection Status */
.connection-status {
  padding: 0.5rem 1rem;
  background: var(--warning-light);
  color: var(--warning);
  text-align: center;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Animations */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.3s ease;
}

.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .chat-widget {
    bottom: 10px;
    right: 10px;
  }
  
  .chat-window {
    width: calc(100vw - 20px);
    max-width: 380px;
    height: 60vh;
    max-height: 500px;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
