# Alpha NDT Manager — Trang Quản Trị

Admin Dashboard cho hệ thống Alpha NDT. Quản lý bài viết, liên hệ và tuyển dụng.

## Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** Tailwind CSS 3.4
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP:** Axios
- **Auth:** Laravel Sanctum (Bearer Token)

## Cài đặt

```bash
# Clone
git clone https://github.com/Nhut-dz/alpha-ndt-manager.git
cd alpha-ndt-manager

# Install dependencies
npm install

# Cấu hình
cp .env.example .env
# Sửa VITE_API_URL trong .env trỏ tới backend

# Chạy dev server
npm run dev
```

Mặc định chạy tại `http://localhost:3001`

## Cấu hình Backend

Đảm bảo backend `alpha-ndt-be` đang chạy và đã:
- Chạy migration: `php artisan migrate`
- Seed dữ liệu: `php artisan db:seed`
- Tài khoản mặc định: `superadmin@alphandt.com` / `alphandt@vungtau2002`

## Cấu trúc dự án

```
src/
├── components/
│   ├── layout/          # AdminLayout, Sidebar, Topbar
│   └── ui/              # StatsCard, DataTable, ConfirmDialog
├── context/
│   └── AuthContext.jsx   # Authentication state
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── ArticlesPage.jsx
│   ├── ArticleFormPage.jsx
│   ├── ContactsPage.jsx
│   ├── RecruitmentPage.jsx
│   └── RecruitmentFormPage.jsx
├── services/
│   └── api.js            # Axios instance + API endpoints
├── App.jsx
├── main.jsx
└── index.css
```

## Chức năng

| Module | Mô tả |
|--------|--------|
| Dashboard | Tổng quan hệ thống, biểu đồ thống kê |
| Bài viết | CRUD bài viết, phân loại, upload ảnh |
| Liên hệ | Xem, xử lý, lọc liên hệ từ khách hàng |
| Tuyển dụng | CRUD tin tuyển dụng |

## Build Production

```bash
npm run build
npm run preview
```

## Design System

Đồng bộ UI/UX với website Alpha NDT:
- **Primary:** #3b82f6 (Blue)
- **Accent:** #f97316 (Orange)
- **Font:** Inter
- **Layout:** Sidebar + Topbar + Content

## License

Private — Alpha NDT © 2002-2026
