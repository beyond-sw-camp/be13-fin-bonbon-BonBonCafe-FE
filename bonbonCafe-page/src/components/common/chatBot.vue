<template>
  <!-- 1) 챗봇 아이콘 (항상 우측 하단에 고정) -->
  <div
    class="chatbot-icon"
    @click="toggleChatWindow"
    title="챗봇 열기/닫기"
  >
    💬
  </div>

  <!-- 2) 채팅창: hidden 클래스 유무로 보여주기/숨기기 -->
  <div :class="['chatbot-window', { hidden: !isOpen }]">
    <!-- 2-1) 헤더: 닫기 버튼 포함 -->
    <div class="chatbot-header">
      <span>챗봇</span>
      <button class="chatbot-close" @click="toggleChatWindow">✕</button>
    </div>

    <!-- 2-2) 메시지 리스트 -->
    <div class="chatbot-messages" ref="messagesContainer">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message', msg.sender]"
      >
        <div class="bubble">{{ msg.text }}</div>
      </div>
    </div>

    <!-- 2-3) 입력 폼 -->
    <form class="chatbot-form" @submit.prevent="onSubmit">

      <input
        ref="chatInput"
        v-model="inputText"
        type="text"
        class="chatbot-input"
        placeholder="메시지를 입력하세요..."
        autocomplete="off"
        required
        :disabled="isSending"
      />
      <button type="submit" class="send-button" :disabled="isSending">
        {{ isSending ? '전송 중...' : '전송' }}
      </button>
    </form>
  </div>
</template>

<script>
import apiClient from '@/api'

export default {
  name: 'ChatBot',
  data() {
    return {
      isOpen: false,
      inputText: '',
      isSending: false,
      messages: [],
      conversationHistory: []
    }
  },
  methods: {
    toggleChatWindow() {
      this.isOpen = !this.isOpen
      this.$nextTick(() => {
        
        if (this.isOpen && this.$refs.chatInput) {
          this.$refs.chatInput.focus()
          if (this.messages.length === 0) {
            // 처음 열었을 때 가이트 프롬포트 뜨게
            this.sendToServer('', true)
          }
        }
      })
    },
    async onSubmit() {
      const text = this.inputText.trim()
      if (!text) return

      // 사용자 메시지 화면에 추가
      this.appendMessage('user', text)
      this.conversationHistory.push(`user: ${text}`)
      this.inputText = ''
      this.isSending = true

      await this.sendToServer(text, false)

      this.isSending = false
      if (this.$refs.chatInput) this.$refs.chatInput.focus()
    },
    appendMessage(sender, text) {
      this.messages.push({ sender, text })
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) container.scrollTop = container.scrollHeight
      })
    },
    async sendToServer(userMessage, isInitialGuide) {
      try {
        const payload = {
          model: 'gpt-3.5-turbo',
          role: 'user',
          message: userMessage,
          maxTokens: 500,
          conversation: this.conversationHistory
        }
        // axios 인스턴스 사용
        const res = await apiClient.post(
          '/api/chatgpt/rest/completion/chat',
          payload
        )
       
        const botText = res.data.messages[0].message
        this.appendMessage('bot', botText)
        this.conversationHistory.push(`assistant: ${botText}`)
      } catch (err) {
        console.error(err)
        this.appendMessage('bot', '오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }
}
</script>


<style scoped>
/* 
   1) 챗봇 아이콘 (우측 하단 고정)
 */
.chatbot-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #2A3663;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

/* 
   2) 채팅창: hidden 클래스 토글
 */
.chatbot-window {
  position: fixed;
  bottom: 80px; /* 아이콘 위쪽 */
  right: 20px;
  width: 400px;
  height: 700px;
  max-height: 400px;
  background-color: white;
  border: 1px solid #cccccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.hidden {
  display: none;
}

/* 
   3) 헤더 스타일
 */
.chatbot-header {
  background-color: #4a90e2;
  color: white;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbot-header span {
  font-weight: bold;
}

.chatbot-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

/* 
   4) 메시지 영역
 */
.chatbot-messages {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

/* 4-1) 사용자/챗봇 메시지 스타일 */
.message {
  margin-bottom: 8px;
  display: flex;
}

.message.user .bubble {
  background-color: #e2daf1;
  margin-left: auto;
}

.message.bot .bubble {
  background-color: #e1e1e1;
  margin-right: auto;
}

.bubble {
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
  word-break: break-word;
}

/* 
   5) 입력 폼 스타일
 */
.chatbot-form {
  display: flex;
  border-top: 1px solid #ccc;
}

.chatbot-input {
  flex-grow: 1;
  padding: 8px;
  border: none;
  border-bottom-left-radius: 8px;
  outline: none;
}

.send-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0 16px;
  cursor: pointer;
  border-bottom-right-radius: 8px;
}
</style>
