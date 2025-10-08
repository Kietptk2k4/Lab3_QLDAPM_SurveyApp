# SurveyApp - Ứng dụng Khảo sát Trực tuyến

## Mô tả

SurveyApp là hệ thống khảo sát trực tuyến gồm hai phần:
- **Backend**: Xây dựng bằng Node.js, Express, MongoDB, JWT, hỗ trợ xác thực, quản lý khảo sát, thu thập và thống kê kết quả.
- **Frontend**: Xây dựng bằng React + Vite, giao diện hiện đại, cho phép tạo, tham gia khảo sát, xem kết quả trực quan.

## Tính năng chính

- Đăng ký, đăng nhập, xác thực người dùng (JWT)
- Tạo, chỉnh sửa, xóa khảo sát (nhiều loại câu hỏi)
- Tham gia trả lời khảo sát (ẩn danh hoặc có tài khoản)
- Xem kết quả khảo sát dạng biểu đồ
- Quản lý khảo sát cá nhân

## Cấu trúc thư mục

```
Lab3_QLDAPM_SurveyApp/
│
├── survey-be/         # Backend (Node.js, Express, MongoDB)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db.js
│   │   └── index.js
│   ├── server.js
│   └── package.json
│
├── survey-fe/         # Frontend (React, Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── state/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## Hướng dẫn cài đặt & chạy dự án

### 1. Backend (survey-be)

**Yêu cầu:** Node.js >= 18, MongoDB

```bash
cd survey-be
npm install
```

**Cấu hình biến môi trường:** Tạo file `.env` với nội dung ví dụ:
```
MONGODB_URI=mongodb://localhost:27017/surveyapp
JWT_SECRET=your_secret_key
ALLOW_ORIGIN=http://localhost:5173
```

**Chạy server:**
```bash
npm run dev
```
Mặc định API chạy ở `http://localhost:3000`

---

### 2. Frontend (survey-fe)

**Yêu cầu:** Node.js >= 18

```bash
cd survey-fe
npm install
npm run dev
```
Truy cập giao diện tại `http://localhost:5173`

---

## Ghi chú

- Đảm bảo backend và frontend cùng bật khi sử dụng.
- Có thể tùy chỉnh biến môi trường cho phù hợp môi trường triển khai thực tế.
- Để build production:  
	- Backend: deploy như app Node.js thông thường  
	- Frontend: `npm run build` (thư mục `dist/`)

---

## Đóng góp

Mọi ý kiến đóng góp, báo lỗi hoặc đề xuất vui lòng tạo issue hoặc pull request.