# 🚗 ThiBangLai.vn

Website ôn thi lý thuyết bằng lái xe — đầy đủ 6 hạng bằng theo bộ đề mới nhất của Cục Đường bộ Việt Nam.

---

## 📋 Tính năng

- ✅ 6 loại bằng lái: A1, A2, B1, B2, C, D
- ✅ 2 chế độ: **Thi thử** (có đồng hồ đếm ngược) và **Luyện tập** (hiện đáp án ngay)
- ✅ Câu hỏi **điểm liệt** được đánh dấu riêng
- ✅ Giải thích chi tiết từng đáp án
- ✅ Bảng điểm trực tiếp khi làm bài
- ✅ Xem lại bài làm sau khi nộp (lọc đúng / sai / tất cả)
- ✅ Giao diện responsive, chạy tốt trên điện thoại

---

## 🗂️ Cấu trúc dự án

```
public/
├── index.html        🏠 Trang chủ + chọn bằng lái
├── auth.html         🔐 Đăng nhập / Đăng ký
├── exam.html         🎯 Màn hình thi + kết quả
├── critical.html     ⚠️  Ôn câu điểm liệt
├── dashboard.html    📊 Hồ sơ cá nhân & thống kê
├── css/
│   ├── main.css      → layout, navbar, card, button...
│   ├── auth.css      → trang đăng nhập
│   ├── exam.css      → màn hình thi
│   └── chatbot.css   → chatbot AI
└── js/
    ├── data.js       → dữ liệu 6 bằng + 30 câu hỏi
    ├── auth.js       → đăng ký/đăng nhập localStorage
    ├── ui.js         → toast, navbar, helper
    ├── exam.js       → engine thi, timer, nộp bài
    └── chatbot.js    → Gemini API chatbot
```

---

## 🚀 Cách chạy

### Yêu cầu
- Python 3.x (kiểm tra: `python --version`)

### Khởi động server

```bash
# Vào thư mục dự án
cd thi-bang-lai

# Chạy server
python server.py
```

Trình duyệt sẽ **tự động mở** tại `http://localhost:3000`.  
Nhấn `Ctrl + C` để dừng server.

---

## 📖 Hướng dẫn sử dụng

1. **Chọn loại bằng** trên trang chủ (A1, A2, B1, B2, C, D)
2. **Chọn chế độ:**
   - 🎯 **Thi thử** — đồng hồ đếm ngược, nộp bài mới biết kết quả
   - 📚 **Luyện tập** — hiện đáp án và giải thích ngay sau mỗi câu
3. Nhấn **Bắt đầu thi**
4. Làm bài, dùng sidebar để nhảy đến câu bất kỳ
5. Nhấn **Nộp bài** hoặc chờ hết giờ
6. Xem kết quả và **xem lại từng câu** sai

---

## 📊 Tiêu chuẩn đậu theo từng hạng

| Hạng | Số câu | Thời gian | Câu đúng tối thiểu |
|------|--------|-----------|-------------------|
| A1   | 35 câu | 19 phút   | 29 câu            |
| A2   | 35 câu | 19 phút   | 29 câu            |
| B1   | 35 câu | 19 phút   | 32 câu            |
| B2   | 35 câu | 19 phút   | 32 câu            |
| C    | 40 câu | 22 phút   | 36 câu            |
| D    | 40 câu | 22 phút   | 36 câu            |

> ⚠️ **Lưu ý:** Trả lời sai bất kỳ câu **điểm liệt** nào là **trượt ngay**, dù các câu khác đúng hết.

---

## 🛠️ Mở rộng / Tùy chỉnh

### Thêm câu hỏi
Mở file `public/data.js`, thêm object vào mảng `QUESTION_TEMPLATES`:

```js
{
  id: 29,
  critical: false,        // true nếu là câu điểm liệt
  text: 'Nội dung câu hỏi?',
  options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
  correct: 0,             // index của đáp án đúng (0 = A)
  explain: 'Giải thích tại sao đáp án A đúng...'
}
```

### Đổi port
Mở `server.py`, sửa dòng:
```python
PORT = 3000  # đổi thành port khác nếu bị trùng
```

---

## 📄 Giấy phép

MIT License — tự do sử dụng, chỉnh sửa và phân phối.
