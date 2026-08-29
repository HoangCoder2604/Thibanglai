// Lấy cấu hình từ file config.js bên ngoài (giúp an toàn, không bị lộ key lên GitHub)
const CONFIG = window.CHATBOT_CONFIG || {
  apiKey: "", 
  model: "gemini-3.6-flash"
};

const SYSTEM_PROMPT = `Bạn là một Trợ lý AI chuyên gia về Luật Giao thông Đường bộ Việt Nam và Quy chế Thi Giấy phép Lái xe (GPLX các hạng A1, A2, B1, B2, C,...).

Nhiệm vụ duy nhất của bạn là hỗ trợ học viên giải đáp thắc mắc về:
1. Các quy tắc, quy định, biển báo trong Luật Giao thông Đường bộ Việt Nam.
2. Mẹo ghi nhớ, giải thích đáp án các câu hỏi lý thuyết và câu điểm liệt trong bộ đề thi GPLX.
3. Quy chế, thời gian, thủ tục đăng ký và cấu trúc đề thi giấy phép lái xe.

QUY TẮC BẮT BUỘC:
- Nếu câu hỏi của người dùng LIÊN QUAN đến luật giao thông hoặc thi GPLX, hãy trả lời ngắn gọn, chính xác, dễ hiểu và trích dẫn điều luật (nếu có).
- Nếu câu hỏi của người dùng NGOÀI LỀ (ví dụ: thời tiết, lập trình, nấu ăn, toán học, chuyện cá nhân, giải trí...), bạn PHẢI từ chối lịch sự bằng câu chuẩn sau:
  "Xin lỗi, tôi là trợ lý chuyên môn về Luật Giao thông và Ôn thi Giấy phép Lái xe. Tôi chỉ có thể hỗ trợ bạn các nội dung liên quan đến quy tắc giao thông, biển báo và cấu trúc đề thi. Bạn có câu hỏi nào về phần này không?"
- Tuyệt đối không trả lời các câu hỏi ngoài lề, không bịa đặt thông tin (ảo giác) về luật.`;

let chatHistory = [];

// Tự động dựng giao diện và gán sự kiện ngay khi trang web tải xong
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById('chatbot-toggle-btn')) return;

  const chatHTML = `
    <!-- Nút mở khung chat nổi -->
    <button id="chatbot-toggle-btn" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999; width: 60px; height: 60px; border-radius: 50%; background: #2563eb; color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
      💬
    </button>

    <!-- Khung cửa sổ chat chính -->
    <div id="chatbot-window" style="position: fixed; bottom: 90px; right: 20px; z-index: 99999; width: 380px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; border: 1px solid #e2e8f0; font-family: inherit;">
      
      <!-- Header -->
      <div style="background: #2563eb; color: white; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🤖</span>
          <div>
            <div style="font-weight: 600; font-size: 0.95rem;">Trợ lý Luật GPLX</div>
            <div style="font-size: 0.75rem; opacity: 0.85;">Hỏi đáp luật & mẹo thi 24/7</div>
          </div>
        </div>
        <button id="chatbot-close-btn" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 4px;">✕</button>
      </div>

      <!-- Khung chứa tin nhắn -->
      <div id="chat-messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
        <div style="align-self: flex-start; background: white; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; max-width: 85%; font-size: 0.9rem; color: #1e293b; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          Xin chào! Tôi là trợ lý AI chuyên về Luật Giao thông và Ôn thi GPLX. Bạn có thắc mắc gì về biển báo, quy tắc hay câu hỏi điểm liệt không?
        </div>
      </div>

      <!-- Ô nhập nội dung -->
      <div style="padding: 12px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 8px;">
        <input type="text" id="chat-input" placeholder="Nhập câu hỏi về luật giao thông..." style="flex: 1; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; font-size: 0.9rem;">
        <button id="chat-send-btn" style="background: #2563eb; color: white; border: none; padding: 0 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">Gửi</button>
      </div>
    </div>
  `;

  // Tự động chèn HTML vào cuối trang
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  // Bắt sự kiện tương tác
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');
  const chatWindow = document.getElementById('chatbot-window');

  toggleBtn.addEventListener('click', () => {
    const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
    chatWindow.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) chatInput.focus();
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
  });

  sendBtn.addEventListener('click', submitUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitUserMessage();
  });
});

async function submitUserMessage() {
  const inputEl = document.getElementById('chat-input');
  const msgContainer = document.getElementById('chat-messages');
  if (!inputEl || !msgContainer) return;

  const text = inputEl.value.trim();
  if (!text) return;

  // Hiển thị tin nhắn người dùng
  msgContainer.innerHTML += `<div style="align-self: flex-end; background: #2563eb; color: white; padding: 10px 14px; border-radius: 8px; max-width: 85%; font-size: 0.9rem; word-break: break-word;">${escapeHtml(text)}</div>`;
  inputEl.value = '';
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Hiển thị trạng thái đang suy nghĩ
  const loadingId = 'loading-' + Date.now();
  msgContainer.innerHTML += `<div id="${loadingId}" style="align-self: flex-start; background: white; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #64748b;">Trợ lý đang suy nghĩ...</div>`;
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Gọi API Gemini
  let botReply = await callGeminiAPI(text);

  // Xóa loading và in kết quả
  const loadingEl = document.getElementById(loadingId);
  if (loadingEl) loadingEl.remove();

  msgContainer.innerHTML += `<div style="align-self: flex-start; background: white; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; max-width: 85%; font-size: 0.9rem; color: #1e293b; box-shadow: 0 1px 2px rgba(0,0,0,0.05); word-break: break-word;">${formatBotReply(botReply)}</div>`;
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

async function callGeminiAPI(userMessage) {
  chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
  try {
    if (!CONFIG.apiKey || CONFIG.apiKey.includes("ĐIỀN_KEY")) {
      return "⚠️ Bạn chưa cấu hình API Key chính xác trong file config.js!";
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${CONFIG.apiKey}`;
    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: chatHistory
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Chi tiết lỗi từ Google API:", errorBody);
      throw new Error(`Lỗi API (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không thể xử lý yêu cầu lúc này.";

    chatHistory.push({ role: "model", parts: [{ text: botReply }] });
    return botReply;
  } catch (error) {
    console.error("Lỗi:", error);
    return "Đã xảy ra lỗi kết nối khi trò chuyện với trợ lý. Vui lòng kiểm tra Console (F12) để xem chi tiết.";
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatBotReply(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}