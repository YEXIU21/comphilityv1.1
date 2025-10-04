import api from './api'

/**
 * Chat Service for real-time customer support
 * Handles WebSocket connections, message sending, and chat management
 */
class ChatService {
  constructor() {
    this.socket = null
    this.chatId = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    
    // Event listeners for UI components
    this.messageListeners = new Set()
    this.statusListeners = new Set()
    this.typingListeners = new Set()
    
    // Auto-response patterns for common queries
    this.autoResponses = {
      greeting: {
        triggers: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
        response: `Hi there! 👋 Welcome to COMPHILITY!

How can I help you today?
• Ask about products
• Track your order
• Get technical support
• General inquiries

Type your question or choose from the options above.`
      },
      orderTracking: {
        triggers: ['track order', 'order status', 'where is my order', 'delivery'],
        response: 'I can help you track your order! Please provide your order number (starts with ORD-) or your email address.',
        requiresInput: true
      },
      productInquiry: {
        triggers: ['product', 'price', 'availability', 'in stock', 'specs'],
        response: `I'd be happy to help with product information! 

Could you tell me:
• Which product you're interested in?
• What specifications you need?
• Your budget range?

I can also help check compatibility for PC builds!`,
        requiresInput: true
      },
      technicalSupport: {
        triggers: ['pc build', 'compatible', 'technical', 'installation', 'help build'],
        response: `🔧 Technical Support Available

I can help with:
• PC building advice
• Compatibility checking
• Component recommendations
• Installation guidance
• Troubleshooting

What specific technical help do you need?`
      },
      paymentIssues: {
        triggers: ['payment', 'gcash', 'maya', 'cod', 'billing', 'checkout'],
        response: `💳 Payment Support

I can assist with:
• GCash payment issues
• Maya payment problems
• Cash on Delivery questions
• Order payment status
• Billing inquiries

Please describe your payment issue.`
      }
    }
  }

  // Initialize chat session
  async initializeChat(userId = null) {
    try {
      const response = await api.post('/chat/sessions', {
        userId,
        source: 'website',
        userAgent: navigator.userAgent
      })

      this.chatId = response.sessionId
      this.connectWebSocket()
      
      return {
        success: true,
        chatId: this.chatId,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initialize chat'
      }
    }
  }

  // WebSocket connection management
  connectWebSocket() {
    const wsUrl = process.env.VUE_APP_WS_URL || 'ws://localhost:3000'
    this.socket = new WebSocket(`${wsUrl}/chat/${this.chatId}`)
    
    this.socket.onopen = () => {
      this.isConnected = true
      this.reconnectAttempts = 0
      this.notifyStatusListeners('connected')
      console.log('Chat WebSocket connected')
      
      // Send initial greeting
      this.sendSystemMessage('Chat session started. An agent will be with you shortly.')
    }

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        this.handleIncomingMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    this.socket.onclose = () => {
      this.isConnected = false
      this.notifyStatusListeners('disconnected')
      this.attemptReconnection()
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.notifyStatusListeners('error')
    }
  }

  // Reconnection logic
  attemptReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`)
      
      setTimeout(() => {
        this.connectWebSocket()
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
      this.notifyStatusListeners('failed')
    }
  }

  // Send message to chat
  async sendMessage(content, type = 'text', attachments = null) {
    const messageData = {
      id: this.generateMessageId(),
      chatId: this.chatId,
      content: content.trim(),
      type,
      attachments,
      timestamp: new Date().toISOString(),
      status: 'sending'
    }

    // Check for auto-responses first
    const autoResponse = this.checkAutoResponse(content)
    
    try {
      // Send via WebSocket if connected
      if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'message',
          ...messageData
        }))
        
        messageData.status = 'sent'
        this.notifyMessageListeners(messageData)
        
        // Send auto-response if matched
        if (autoResponse) {
          setTimeout(() => {
            this.sendSystemMessage(autoResponse.response)
          }, 1000)
        }
      } else {
        // Fallback to HTTP API
        const response = await api.post('/chat/messages', messageData)
        messageData.status = 'sent'
        this.notifyMessageListeners(messageData)
      }

      return { success: true, message: messageData }
    } catch (error) {
      messageData.status = 'failed'
      this.notifyMessageListeners(messageData)
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      }
    }
  }

  // Send typing indicator
  sendTypingIndicator(isTyping) {
    if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'typing',
        chatId: this.chatId,
        isTyping
      }))
    }
  }

  // Send system message (automated)
  sendSystemMessage(content) {
    const systemMessage = {
      id: this.generateMessageId(),
      chatId: this.chatId,
      content,
      type: 'system',
      senderType: 'system',
      timestamp: new Date().toISOString(),
      status: 'delivered'
    }
    
    this.notifyMessageListeners(systemMessage)
  }

  // Check for auto-response patterns
  checkAutoResponse(message) {
    const lowerMessage = message.toLowerCase()
    
    for (const [category, config] of Object.entries(this.autoResponses)) {
      for (const trigger of config.triggers) {
        if (lowerMessage.includes(trigger)) {
          return config
        }
      }
    }
    
    return null
  }

  // Handle incoming WebSocket messages
  handleIncomingMessage(data) {
    switch (data.type) {
      case 'message':
        this.notifyMessageListeners(data.message)
        break
        
      case 'typing':
        this.notifyTypingListeners(data)
        break
        
      case 'agent_joined':
        this.sendSystemMessage(`Agent ${data.agent.name} has joined the conversation.`)
        this.notifyStatusListeners('agent_connected', data.agent)
        break
        
      case 'agent_left':
        this.sendSystemMessage('Agent has left the conversation. Your messages will be answered shortly.')
        this.notifyStatusListeners('agent_disconnected')
        break
        
      case 'chat_closed':
        this.sendSystemMessage('Chat session has been closed.')
        this.notifyStatusListeners('chat_closed')
        break
    }
  }

  // Upload file for chat
  async uploadFile(file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('chatId', this.chatId)

    try {
      const response = await api.post('/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return {
        success: true,
        file: {
          url: response.url,
          name: file.name,
          size: file.size,
          type: file.type
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'File upload failed'
      }
    }
  }

  // Get chat history
  async getChatHistory() {
    try {
      const response = await api.get(`/chat/sessions/${this.chatId}/messages`)
      return { success: true, messages: response.messages }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load chat history'
      }
    }
  }

  // Close chat session
  async closeChat() {
    try {
      await api.put(`/chat/sessions/${this.chatId}/close`)
      
      if (this.socket) {
        this.socket.close()
      }
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to close chat'
      }
    }
  }

  // Event listener management
  addMessageListener(callback) {
    this.messageListeners.add(callback)
  }

  removeMessageListener(callback) {
    this.messageListeners.delete(callback)
  }

  addStatusListener(callback) {
    this.statusListeners.add(callback)
  }

  removeStatusListener(callback) {
    this.statusListeners.delete(callback)
  }

  addTypingListener(callback) {
    this.typingListeners.add(callback)
  }

  removeTypingListener(callback) {
    this.typingListeners.delete(callback)
  }

  // Notify listeners
  notifyMessageListeners(message) {
    this.messageListeners.forEach(callback => callback(message))
  }

  notifyStatusListeners(status, data = null) {
    this.statusListeners.forEach(callback => callback(status, data))
  }

  notifyTypingListeners(data) {
    this.typingListeners.forEach(callback => callback(data))
  }

  // Utility functions
  generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  formatTime(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    
    this.messageListeners.clear()
    this.statusListeners.clear()
    this.typingListeners.clear()
    this.isConnected = false
    this.chatId = null
  }
}

// Export singleton instance
export const chatService = new ChatService()
export default chatService
