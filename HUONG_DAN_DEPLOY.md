# 🚀 Hướng Dẫn Deploy Ứng Dụng Lên GitHub

## 📋 Tổng Quan

Dự án này bao gồm:
- **Frontend**: React + Vite (sẽ deploy lên GitHub Pages)
- **Backend**: Node.js + Express (cần deploy lên dịch vụ cloud như Render, Railway, hoặc Heroku)

---

## 🔧 Bước 1: Cấu Hình GitHub Pages cho Frontend

### 1.1. Bật GitHub Pages trong Repository

1. Vào repository trên GitHub
2. Click vào **Settings** → **Pages**
3. Trong phần **Source**, chọn:
   - **Source**: `GitHub Actions`
4. Lưu lại

### 1.2. Cấu Hình Biến Môi Trường

1. Vào **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Thêm secret sau:
   - **Name**: `VITE_API_URL`
   - **Value**: URL của backend (ví dụ: `https://your-backend.onrender.com`)

### 1.3. Cập Nhật Base Path (Nếu cần)

Nếu repository của bạn không phải là `Final-1682`, cần cập nhật trong `frontend/vite.config.js`:

```javascript
base: process.env.NODE_ENV === 'production' ? '/TEN_REPO_CUA_BAN/' : '/',
```

---

## 🖥️ Bước 2: Deploy Backend

Bạn có thể chọn một trong các dịch vụ sau:

### Option 1: Deploy lên Render (Miễn phí)

#### 2.1. Tạo tài khoản Render
- Truy cập: https://render.com
- Đăng ký bằng GitHub account

#### 2.2. Tạo Web Service mới
1. Click **New** → **Web Service**
2. Kết nối repository GitHub của bạn
3. Cấu hình:
   - **Name**: `your-app-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (hoặc `npm start` nếu đã cấu hình)

#### 2.3. Cấu hình Environment Variables
Trong Render dashboard, thêm các biến môi trường:
- `MONGODB_URI`: Connection string của MongoDB
- `JWT_SECRET`: Secret key cho JWT
- `PORT`: 4000 (hoặc port mà Render cung cấp)
- Các biến khác cần thiết cho backend

#### 2.4. Lấy URL Backend
- Sau khi deploy xong, Render sẽ cung cấp URL dạng: `https://your-app-backend.onrender.com`
- Copy URL này và cập nhật vào `VITE_API_URL` secret trong GitHub

### Option 2: Deploy lên Railway

1. Truy cập: https://railway.app
2. Đăng nhập bằng GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Chọn repository và cấu hình:
   - **Root Directory**: `backend`
   - **Start Command**: `node server.js`
5. Thêm environment variables tương tự như Render
6. Lấy URL và cập nhật vào GitHub secrets

### Option 3: Deploy lên Heroku

1. Cài đặt Heroku CLI
2. Đăng nhập: `heroku login`
3. Tạo app: `heroku create your-app-backend`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Deploy: 
   ```bash
   cd backend
   git subtree push --prefix backend heroku main
   ```
6. Thêm environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   ```

---

## 📝 Bước 3: Cập Nhật Backend Package.json

Đảm bảo `backend/package.json` có script `start` phù hợp:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Nếu bạn đang dùng `nodemon`, cần thay đổi vì các dịch vụ cloud không cần nodemon.

---

## 🔄 Bước 4: Push Code và Kích Hoạt Deployment

### 4.1. Commit và Push
```bash
git add .
git commit -m "Configure deployment"
git push origin main
```

### 4.2. Kiểm Tra GitHub Actions
1. Vào tab **Actions** trên GitHub
2. Bạn sẽ thấy workflow **Deploy Frontend to GitHub Pages** chạy
3. Đợi workflow hoàn thành

### 4.3. Xem Kết Quả
- Frontend sẽ được deploy tại: `https://YOUR_USERNAME.github.io/Final-1682/`
- Backend URL sẽ là URL từ dịch vụ cloud bạn chọn

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: Frontend không kết nối được với Backend
- **Nguyên nhân**: CORS hoặc URL backend sai
- **Giải pháp**: 
  - Kiểm tra `VITE_API_URL` trong GitHub Secrets
  - Đảm bảo backend đã cấu hình CORS đúng

### Lỗi: Build Frontend thất bại
- **Nguyên nhân**: Thiếu dependencies hoặc lỗi code
- **Giải pháp**: 
  - Chạy `npm run build` local để kiểm tra
  - Xem log trong GitHub Actions

### Lỗi: Backend không start được
- **Nguyên nhân**: Thiếu environment variables hoặc port sai
- **Giải pháp**: 
  - Kiểm tra tất cả environment variables trong Render/Railway
  - Đảm bảo server.js sử dụng `process.env.PORT || 4000`

---

## 📚 Tài Liệu Tham Khảo

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Heroku Documentation](https://devcenter.heroku.com)

---

## ✅ Checklist Deploy

- [ ] Đã bật GitHub Pages trong repository settings
- [ ] Đã thêm `VITE_API_URL` vào GitHub Secrets
- [ ] Đã deploy backend lên Render/Railway/Heroku
- [ ] Đã cấu hình tất cả environment variables cho backend
- [ ] Đã cập nhật `vite.config.js` với base path đúng
- [ ] Đã push code lên GitHub
- [ ] Đã kiểm tra GitHub Actions workflow chạy thành công
- [ ] Đã test frontend và backend hoạt động đúng

---

## 🎉 Hoàn Thành!

Sau khi hoàn thành tất cả các bước, ứng dụng của bạn sẽ được deploy và có thể truy cập công khai!

**Lưu ý**: 
- GitHub Pages miễn phí nhưng có giới hạn bandwidth
- Render/Railway có gói miễn phí nhưng có thể sleep sau 15 phút không hoạt động
- Nên sử dụng MongoDB Atlas (miễn phí) cho database

