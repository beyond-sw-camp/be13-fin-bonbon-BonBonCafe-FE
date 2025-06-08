<template>
  <div
    v-if="userRole === 'ROLE_FRANCHISEE'"
    class="chatbot-icon"
    @click="toggleChatWindow"
    title="챗봇 열기/닫기"
  >
    💬
  </div>

  <!-- 챗봇 창 -->
  <div :class="['chatbot-window', { hidden: !isOpen }]">
    <div class="chatbot-header">
      <span>챗봇</span>
      <button class="chatbot-close" @click="toggleChatWindow">✕</button>
    </div>

    <!-- 메시지 리스트 -->
    <div class="chatbot-messages" ref="messagesContainer">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message', msg.sender]"
      >
        <div class="bubble">{{ msg.text }}</div>
      </div>
    </div>

    <!-- 선택지 버튼 영역 -->
    <div class="suggestion-buttons">
      <button
        v-for="(item, idx) in suggestions"
        :key="idx"
        class="suggestion-btn"
        type="button"
        @click="onSuggestionClick(item)"
      >
        {{ item }}
      </button>
    </div>

    <!-- 입력 폼 -->
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
import { computed, ref, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api'

export default {
  name: 'ChatBot',
  setup() {
    const authStore = useAuthStore()
    const userRole = computed(() => authStore.userInfo.role)

    const isOpen = ref(false)
    const inputText = ref('')
    const isSending = ref(false)
    const messages = ref([])
    const conversationHistory = ref([])

    const suggestions = ref([
      '챗봇 가이드',
      '지난주 매출 조회',
      '지난주 메뉴 판매량 조회',
      '다음 주 예상 매출 조회',
      '다음 달 예상 매출 조회',
    ])

    const toggleChatWindow = () => {
      isOpen.value = !isOpen.value
      
      // 열었을 때 첫 가이드 메시지 띄우기
      if (isOpen.value && messages.value.length === 0) {
        sendToServer('', true)
      }
      nextTick(() => {
        if (isOpen.value && chatInputEl.value) {
          chatInputEl.value.focus()
        }
      })
    }

    const appendMessage = (sender, text) => {
      messages.value.push({ sender, text })
      nextTick(() => {
        const container = messagesContainerEl.value
        if (container) container.scrollTop = container.scrollHeight
      })
    }

    const onSubmit = async () => {
      const text = inputText.value.trim()
      if (!text) return

      appendMessage('user', text)
      conversationHistory.value.push(`user: ${text}`)
      inputText.value = ''
      isSending.value = true

      await sendToServer(text, false)
      isSending.value = false
      nextTick(() => {
        if (chatInputEl.value) chatInputEl.value.focus()
      })
    }

    const messagesContainerEl = ref(null)
    const chatInputEl = ref(null)

    const sendToServer = async (userMessage, isInitialGuide) => {
      try {
        const payload = {
          model: 'gpt-3.5-turbo',
          role: 'user',
          message: userMessage,
          maxTokens: 500,
          conversation: conversationHistory.value
        }
        const res = await apiClient.post(
          '/api/chatgpt/rest/completion/chat',
          payload
        )
        const botText = res.data.messages[0].message
        appendMessage('bot', botText)
        conversationHistory.value.push(`assistant: ${botText}`)
      } catch (err) {
        console.error(err)
        appendMessage('bot', '오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }

    const onSuggestionClick = async (chosenText) => {
        
      // 선택 버튼
      appendMessage('user', chosenText)
      
      conversationHistory.value.push(`user: ${chosenText}`)
      // 서버 호출
      isSending.value = true
      await sendToServer(chosenText, false)
      isSending.value = false
      // 메시지 전송 후 다시 입력창에 포커스를 주기
      nextTick(() => {
        if (chatInput.value) chatInput.value.focus()
      })
    }


    return {
      isOpen,
      inputText,
      isSending,
      messages,
      toggleChatWindow,
      onSubmit,
      messagesContainerEl,
      chatInputEl,
      userRole,
      suggestions,
      onSuggestionClick
    }
  }
}
</script>


<style scoped>
/* 1) 챗봇 아이콘 (우측 하단 고정) */
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

/* 2) 채팅창: hidden 클래스 토글 */
.chatbot-window {
  position: fixed;
  bottom: 80px; /* 아이콘 위쪽 */
  right: 20px;
  width: 450px;
  height: 700px;
  max-height: 600px;
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

/* 3) 헤더 스타일 */
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

/* 4) 메시지 영역 */
.chatbot-messages {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #e3e3e4;
}

/* 4-1) 사용자/챗봇 메시지 스타일 */
.message {
  margin-bottom: 8px;
  display: flex;
}

.message.user .bubble {
  background-color: #05B5E6;
  margin-left: auto;
  color: #ffffff;
}

.message.bot .bubble {
  background-color: #ffffff;
  margin-right: auto;
  color: black;
}

.bubble {
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
  word-break: break-word;
  white-space: pre-wrap;
}

/* 5) 입력 폼 스타일 */
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

.suggestion-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
}

.suggestion-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-btn:hover {
  background-color: #3672c3;
}
</style>
