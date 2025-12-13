# 🚀 Quick Start Deployment Guide

## ⚡ Deploy Nhanh (5 phút)

### Frontend (GitHub Pages)

1. **Bật GitHub Pages:**
   - Vào Settings → Pages → Source: `GitHub Actions`

2. **Thêm Secret:**
   - Settings → Secrets → Actions → New secret
   - Name: `VITE_API_URL`
   - Value: URL backend của bạn (sẽ có sau khi deploy backend)

3. **Push code:**
   ```bash
   git push origin main
   ```

4. **Kiểm tra:**
   - Vào tab Actions → Xem workflow chạy
   - Frontend sẽ có tại: `https://YOUR_USERNAME.github.io/Final-1682/`

### Backend (Render - Miễn phí)

1. **Đăng ký Render:**
   - Vào https://render.com
   - Đăng nhập bằng GitHub

2. **Tạo Web Service:**
   - New → Web Service
   - Connect repository
   - Cấu hình:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Thêm Environment Variables:**
   ```
   MONGO_URL=mongodb+srv://...
   JWT_SECRET=your-secret-key
   PORT=4000
   ```

4. **Lấy URL và cập nhật:**
   - Copy URL từ Render (ví dụ: `https://your-app.onrender.com`)
   - Cập nhật vào `VITE_API_URL` secret trong GitHub

## 📝 Lưu Ý Quan Trọng

- ✅ Backend đã được cấu hình sẵn với `process.env.PORT`
- ✅ Frontend đã được cấu hình với environment variables
- ✅ Cần có MongoDB Atlas (miễn phí) cho database
- ✅ Render có thể sleep sau 15 phút không dùng (gói free)

## 🔗 Xem Hướng Dẫn Chi Tiết

Xem file `HUONG_DAN_DEPLOY.md` để biết hướng dẫn đầy đủ và các tùy chọn deploy khác.

