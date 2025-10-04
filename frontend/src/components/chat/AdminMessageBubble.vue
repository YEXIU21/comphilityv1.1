<template>
  <div class="admin-message-bubble" :class="messageClasses">
    <div class="message-content">
      <div v-if="message.type === 'text'" class="text-message">
        <p>{{ message.content }}</p>
      </div>
      
      <div v-else-if="message.type === 'system'" class="system-message">
        <i class="fas fa-info-circle"></i>
        <span>{{ message.content }}</span>
      </div>
    </div>
    
    <div class="message-meta">
      <span class="sender-name">{{ getSenderName() }}</span>
      <span class="message-time">{{ formatTime(message.timestamp) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminMessageBubble',
  props: {
    message: {
      type: Object,
      required: true
    },
    isAgent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    messageClasses() {
      return {
        'agent-message': this.isAgent,
        'customer-message': !this.isAgent && this.message.senderType === 'customer',
        'system-message': this.message.type === 'system'
      }
    }
  },
  methods: {
    getSenderName() {
      if (this.message.type === 'system') return 'System'
      if (this.isAgent) return 'You'
      return 'Customer'
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.admin-message-bubble {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.admin-message-bubble.agent-message {
  align-self: flex-end;
  align-items: flex-end;
}

.admin-message-bubble.customer-message {
  align-self: flex-start;
  align-items: flex-start;
}

.admin-message-bubble.system-message {
  align-self: center;
  align-items: center;
  max-width: 80%;
}

.message-content {
  border-radius: 12px;
  padding: 0.75rem 1rem;
}

.agent-message .message-content {
  background: var(--primary-blue);
  color: white;
  border-bottom-right-radius: 4px;
}

.customer-message .message-content {
  background: white;
  color: var(--gray-800);
  border: 1px solid var(--gray-200);
  border-bottom-left-radius: 4px;
}

.system-message .message-content {
  background: var(--gray-100);
  color: var(--gray-600);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.text-message p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.message-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--gray-500);
}

.agent-message .message-meta {
  flex-direction: row-reverse;
}
</style>
