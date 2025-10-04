<template>
  <div class="chat-management">
    <div class="page-header">
      <div class="header-content">
        <h1>Chat Management</h1>
        <p>Monitor and manage customer support conversations</p>
      </div>
      <div class="header-actions">
        <div class="agent-status">
          <span class="status-label">Your Status:</span>
          <select v-model="agentStatus" @change="updateAgentStatus" class="status-select">
            <option value="online">🟢 Online</option>
            <option value="busy">🟡 Busy</option>
            <option value="offline">🔴 Offline</option>
          </select>
        </div>
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-number">{{ activeChats.length }}</span>
            <span class="stat-label">Active Chats</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ waitingChats.length }}</span>
            <span class="stat-label">Waiting</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-dashboard">
      <!-- Sidebar with Chat List -->
      <div class="chat-sidebar">
        <div class="sidebar-header">
          <h3>Active Conversations</h3>
          <div class="chat-filters">
            <button 
              @click="filterChats('all')" 
              :class="{ active: chatFilter === 'all' }"
              class="filter-btn"
            >
              All ({{ allChats.length }})
            </button>
            <button 
              @click="filterChats('waiting')" 
              :class="{ active: chatFilter === 'waiting' }"
              class="filter-btn"
            >
              Waiting ({{ waitingChats.length }})
            </button>
            <button 
              @click="filterChats('active')" 
              :class="{ active: chatFilter === 'active' }"
              class="filter-btn"
            >
              Active ({{ activeChats.length }})
            </button>
          </div>
        </div>

        <div class="chat-list">
          <div 
            v-for="chat in filteredChats" 
            :key="chat.id"
            @click="selectChat(chat)"
            :class="{ 
              'selected': selectedChat?.id === chat.id,
              'unread': chat.unreadCount > 0,
              'waiting': chat.status === 'waiting'
            }"
            class="chat-item"
          >
            <div class="chat-avatar">
              <i class="fas fa-user"></i>
              <span v-if="chat.unreadCount > 0" class="unread-badge">
                {{ chat.unreadCount }}
              </span>
            </div>
            <div class="chat-info">
              <div class="chat-header-info">
                <h4>{{ chat.customer.name || 'Anonymous User' }}</h4>
                <span class="chat-time">{{ formatChatTime(chat.lastMessage?.timestamp) }}</span>
              </div>
              <div class="chat-preview">
                <span class="last-message">{{ chat.lastMessage?.content || 'No messages yet' }}</span>
                <div class="chat-tags">
                  <span v-if="chat.status === 'waiting'" class="status-tag waiting">Waiting</span>
                  <span v-if="chat.priority === 'high'" class="priority-tag high">High Priority</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="filteredChats.length === 0" class="no-chats">
            <i class="fas fa-comments"></i>
            <p>No chats in this category</p>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="chat-main">
        <div v-if="selectedChat" class="chat-conversation">
          <!-- Chat Header -->
          <div class="conversation-header">
            <div class="customer-info">
              <div class="customer-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="customer-details">
                <h3>{{ selectedChat.customer.name || 'Anonymous User' }}</h3>
                <div class="customer-meta">
                  <span class="customer-email">{{ selectedChat.customer.email || 'No email' }}</span>
                  <span class="chat-duration">Duration: {{ getChatDuration(selectedChat) }}</span>
                </div>
              </div>
            </div>
            <div class="chat-actions">
              <button @click="assignToMe" v-if="!selectedChat.agentId" class="btn btn-primary">
                <i class="fas fa-hand-paper"></i>
                Take Chat
              </button>
              <button @click="transferChat" class="btn btn-outline">
                <i class="fas fa-exchange-alt"></i>
                Transfer
              </button>
              <button @click="closeChat" class="btn btn-danger">
                <i class="fas fa-times"></i>
                Close Chat
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="messages-container" ref="messagesContainer">
            <div class="messages-list">
              <AdminMessageBubble
                v-for="message in selectedChat.messages"
                :key="message.id"
                :message="message"
                :is-agent="message.senderType === 'agent'"
              />
              
              <div v-if="isCustomerTyping" class="typing-indicator">
                <div class="typing-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="typing-text">Customer is typing...</div>
              </div>
            </div>
          </div>

          <!-- Agent Reply Input -->
          <div class="agent-input-area">
            <div class="quick-responses">
              <button 
                v-for="response in quickResponses" 
                :key="response.id"
                @click="insertQuickResponse(response.content)"
                class="quick-response-btn"
                :title="response.title"
              >
                {{ response.shortcut }}
              </button>
            </div>
            
            <AgentChatInput
              @send-message="handleAgentMessage"
              @typing="handleAgentTyping"
              :placeholder="'Type your response to ' + (selectedChat.customer.name || 'customer') + '...'"
            />
          </div>
        </div>

        <!-- No Chat Selected State -->
        <div v-else class="no-chat-selected">
          <div class="empty-state">
            <i class="fas fa-comments"></i>
            <h3>Select a chat to start helping customers</h3>
            <p>Choose a conversation from the sidebar to view messages and respond to customers.</p>
          </div>
        </div>
      </div>

      <!-- Customer Info Panel -->
      <div v-if="selectedChat" class="customer-panel">
        <div class="panel-section">
          <h4>Customer Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <span>{{ selectedChat.customer.name || 'Not provided' }}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>{{ selectedChat.customer.email || 'Not provided' }}</span>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <span>{{ selectedChat.customer.phone || 'Not provided' }}</span>
            </div>
            <div class="info-item">
              <label>Location</label>
              <span>{{ selectedChat.customer.location || 'Unknown' }}</span>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h4>Recent Orders</h4>
          <div class="recent-orders">
            <div 
              v-for="order in selectedChat.customer.recentOrders || []" 
              :key="order.id"
              class="order-item"
            >
              <div class="order-info">
                <strong>{{ order.id }}</strong>
                <span class="order-status">{{ order.status }}</span>
              </div>
              <div class="order-total">₱{{ formatPrice(order.total) }}</div>
            </div>
            <div v-if="!selectedChat.customer.recentOrders?.length" class="no-orders">
              No recent orders
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h4>Chat Notes</h4>
          <textarea 
            v-model="chatNotes"
            @blur="saveChatNotes"
            class="notes-textarea"
            placeholder="Add internal notes about this conversation..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminMessageBubble from '@/components/chat/AdminMessageBubble.vue'
import AgentChatInput from '@/components/chat/AgentChatInput.vue'

export default {
  name: 'ChatManagement',
  components: {
    AdminMessageBubble,
    AgentChatInput
  },
  data() {
    return {
      selectedChat: null,
      chatFilter: 'all',
      agentStatus: 'online',
      isCustomerTyping: false,
      chatNotes: '',
      
      // Mock data - replace with real API calls
      allChats: [
        {
          id: '1',
          customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+63 912 345 6789',
            location: 'Manila, Philippines'
          },
          status: 'active',
          priority: 'normal',
          unreadCount: 2,
          agentId: null,
          startedAt: new Date(Date.now() - 300000), // 5 minutes ago
          lastMessage: {
            content: 'Can you help me with my order?',
            timestamp: new Date(Date.now() - 60000) // 1 minute ago
          },
          messages: [
            {
              id: '1',
              content: 'Hello! I need help with my order ORD-ABC123',
              senderType: 'customer',
              timestamp: new Date(Date.now() - 300000)
            },
            {
              id: '2',
              content: 'Can you help me with my order?',
              senderType: 'customer',
              timestamp: new Date(Date.now() - 60000)
            }
          ]
        },
        {
          id: '2',
          customer: {
            name: 'Maria Santos',
            email: 'maria@example.com',
            location: 'Cebu, Philippines'
          },
          status: 'waiting',
          priority: 'high',
          unreadCount: 1,
          agentId: null,
          startedAt: new Date(Date.now() - 120000), // 2 minutes ago
          lastMessage: {
            content: 'Is this graphics card compatible with my motherboard?',
            timestamp: new Date(Date.now() - 120000)
          },
          messages: [
            {
              id: '1',
              content: 'Is this graphics card compatible with my motherboard?',
              senderType: 'customer',
              timestamp: new Date(Date.now() - 120000)
            }
          ]
        }
      ],

      quickResponses: [
        { id: 1, shortcut: 'Hello', title: 'Greeting', content: 'Hello! Thank you for contacting COMPHILITY support. How can I help you today?' },
        { id: 2, shortcut: 'Order', title: 'Order Status', content: 'Let me check your order status for you. Could you please provide your order number?' },
        { id: 3, shortcut: 'Payment', title: 'Payment Help', content: 'I can help you with payment issues. Which payment method are you using?' },
        { id: 4, shortcut: 'Tech', title: 'Technical Support', content: 'I\'d be happy to help with technical questions. What specific issue are you experiencing?' },
        { id: 5, shortcut: 'Thanks', title: 'Thank You', content: 'Thank you for contacting COMPHILITY! Is there anything else I can help you with today?' }
      ]
    }
  },
  computed: {
    activeChats() {
      return this.allChats.filter(chat => chat.status === 'active')
    },
    
    waitingChats() {
      return this.allChats.filter(chat => chat.status === 'waiting')
    },
    
    filteredChats() {
      switch (this.chatFilter) {
        case 'active':
          return this.activeChats
        case 'waiting':
          return this.waitingChats
        default:
          return this.allChats
      }
    }
  },
  methods: {
    selectChat(chat) {
      this.selectedChat = chat
      this.chatNotes = chat.notes || ''
      this.scrollToBottom()
      this.markAsRead(chat)
    },

    filterChats(filter) {
      this.chatFilter = filter
    },

    updateAgentStatus() {
      // API call to update agent status
      console.log('Agent status updated:', this.agentStatus)
    },

    assignToMe() {
      if (this.selectedChat) {
        this.selectedChat.agentId = 'current-agent-id'
        this.selectedChat.status = 'active'
        // API call to assign chat
      }
    },

    transferChat() {
      // Open transfer modal or handle transfer logic
      console.log('Transfer chat:', this.selectedChat?.id)
    },

    closeChat() {
      if (confirm('Are you sure you want to close this chat?')) {
        this.selectedChat.status = 'closed'
        // API call to close chat
        this.selectedChat = null
      }
    },

    handleAgentMessage(content) {
      if (!this.selectedChat) return

      const message = {
        id: Date.now().toString(),
        content,
        senderType: 'agent',
        agentId: 'current-agent-id',
        timestamp: new Date()
      }

      this.selectedChat.messages.push(message)
      this.selectedChat.lastMessage = message
      this.scrollToBottom()
      
      // API call to send message
    },

    handleAgentTyping(isTyping) {
      // Send typing indicator to customer
      console.log('Agent typing:', isTyping)
    },

    insertQuickResponse(content) {
      this.handleAgentMessage(content)
    },

    markAsRead(chat) {
      chat.unreadCount = 0
      // API call to mark messages as read
    },

    saveChatNotes() {
      if (this.selectedChat) {
        this.selectedChat.notes = this.chatNotes
        // API call to save notes
      }
    },

    formatChatTime(timestamp) {
      if (!timestamp) return ''
      
      const now = new Date()
      const diff = now - new Date(timestamp)
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}h ago`
      
      return new Date(timestamp).toLocaleDateString()
    },

    getChatDuration(chat) {
      const duration = new Date() - new Date(chat.startedAt)
      const minutes = Math.floor(duration / 60000)
      return `${minutes} minutes`
    },

    formatPrice(price) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price)
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    }
  }
}
</script>

<style scoped>
.chat-management {
  padding: 2rem;
  max-width: 100%;
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.header-content h1 {
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.header-content p {
  color: var(--gray-600);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.agent-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  font-size: 0.875rem;
}

.stats-summary {
  display: flex;
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.chat-dashboard {
  display: grid;
  grid-template-columns: 300px 1fr 250px;
  gap: 1rem;
  flex: 1;
  overflow: hidden;
}

/* Chat Sidebar */
.chat-sidebar {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.sidebar-header h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--gray-800);
}

.chat-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--gray-300);
  background: white;
  color: var(--gray-700);
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--gray-100);
  cursor: pointer;
  transition: background 0.2s ease;
}

.chat-item:hover {
  background: var(--gray-50);
}

.chat-item.selected {
  background: var(--primary-blue);
  color: white;
}

.chat-item.unread {
  background: #fef3c7;
}

.chat-item.waiting {
  border-left: 4px solid var(--warning);
}

.chat-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--error);
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.chat-header-info h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  truncate: ellipsis;
}

.chat-time {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.chat-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-message {
  font-size: 0.75rem;
  color: var(--gray-600);
  truncate: ellipsis;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-tag,
.priority-tag {
  font-size: 0.625rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.status-tag.waiting {
  background: var(--warning-light);
  color: var(--warning);
}

.priority-tag.high {
  background: var(--error-light);
  color: var(--error);
}

/* Chat Main Area */
.chat-main {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.customer-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.customer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.customer-details h3 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--gray-800);
}

.customer-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--gray-600);
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: var(--gray-50);
}

.agent-input-area {
  padding: 1rem;
  border-top: 1px solid var(--gray-200);
  background: white;
}

.quick-responses {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.quick-response-btn {
  padding: 0.375rem 0.75rem;
  background: var(--gray-100);
  color: var(--gray-700);
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.quick-response-btn:hover {
  background: var(--gray-200);
}

.no-chat-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-state {
  text-align: center;
  color: var(--gray-500);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--gray-300);
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: var(--gray-600);
}

/* Customer Panel */
.customer-panel {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  padding: 1rem;
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 2rem;
}

.panel-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--gray-800);
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: 0.5rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
}

.info-item span {
  font-size: 0.875rem;
  color: var(--gray-800);
}

.notes-textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  font-size: 0.875rem;
  resize: vertical;
}

@media (max-width: 1024px) {
  .chat-dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .customer-panel {
    display: none;
  }
}
</style>
