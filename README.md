
## Project Structure

```
gyandayini/
├── backend/
│   ├── models/
│   │   ├── User.model.js         # Users & Owners (role-based)
│   │   ├── Request.model.js      # All customer requests + receipt
│   │   ├── Template.model.js     # Card templates with dynamic fields
│   │   ├── Media.model.js        # Demo/Ad/Rate (auto-expire TTL index)
│   ├── routes/
│   │   ├── auth.routes.js        # Signup, login, owner-login
│   │   ├── request.routes.js     # Submit, track, my requests
│   │   ├── template.routes.js    # Template CRUD
│   │   ├── owner.routes.js       # Dashboard: requests, receipt, media
│   │   ├── otp.routes.js         # Email OTP send & verify
│   │   ├── captcha.routes.js     # SVG captcha generate & verify
│   │   ├── upload.routes.js      # Cloudinary file uploads
│   │   └── media.routes.js       # Public media access
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT protect & ownerOnly
│   │   └── cloudinary.middleware.js
│   └── utils/
│       └── otp.util.js           # Email OTP via Nodemailer
│
└── frontend/src/
    ├── pages/
    │   ├── user/
    │   │   ├── HomePage.jsx         # Hero + ads carousel + demo gallery
    │   │   ├── PrintingServicePage  # 3-step: upload → verify → submit
    │   │   ├── GovtFormServicePage  # Form selection + doc upload
    │   │   ├── CardPrintingPage     # Category → template → fill form
    │   │   ├── TrackRequestPage     # 3-step progress + saved IDs box
    │   │   ├── RateListPage         # Rate list + demo images (public)
    │   │   ├── ContactPage          # Map + social links
    │   │   ├── ReceiptPage          # Itemized receipt after submission
    │   │   ├── SignUpPage            # Register
    │   │   └── SignInPage            # Login
    │   └── owner/
    │       ├── OwnerLoginPage        # Secure admin login
    │       ├── DashboardHomePage     # Stats + recent requests
    │       ├── RequestsPage          # All requests + receipt builder + download
    │       ├── TemplateManagementPage# Card templates CRUD
    │       └── MediaManagementPage   # Demo/Ad/Rate list image management
    ├── components/
    │   ├── common/  Navbar, Footer, StatusBadge
    │   ├── user/    EmailOTPInput (4-digit), CaptchaInput, FileUpload
    │   └── owner/   OwnerSidebar
    └── context/
        └── AuthContext.jsx
```

### Environment Variables

Create a `.env` file in backend using `.env.example` and fill:

- MONGODB_URI
- JWT_SECRET
- CLOUDINARY keys

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd gyandayini
npm install              # root dev tools
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env 
# Fill in MongoDB URI, Cloudinary keys, Gmail credentials
```

### 3. Create Owner Account

After starting the server, register a user normally then update their role in MongoDB Atlas:

```js
// In MongoDB Atlas → Collections → users → find your user → Edit
{ $set: { role: "owner" } }
```

### 4. Start

```bash
# From root — runs both backend (5000) + frontend (5173)
npm run dev
```

---

## 🌐 User Flow

```
Visit Site → Browse Rate List → Place Order (upload + email OTP + captcha)
  → Get Receipt with Request ID
  → Contact owner (phone/email) to pay
  → Track order: Pending → Payment Received → Completed
```

## 👤 Owner Flow

```
Login → Dashboard → Review Requests → Build Receipt (item/qty/price)
  → Mark "Payment Received" when paid → Mark "Completed" when done
  → Manage Card Templates → Upload Rate List / Demo / Ads to Media section
```

---

## 📌 Key Features (v2)

| Feature | Status |
|---------|--------|
| SVG Captcha verification | ✅ |
| 3-step order tracking (Pending → Payment Received → Completed) | ✅ |
| Saved Request IDs box (localStorage) | ✅ |
| Itemized Receipt builder (owner) | ✅ |
| Download uploaded files (owner panel) | ✅ |
| Media Management (Demo/Ad/Rate List images) | ✅ |
| Rate List public page with lightbox | ✅ |
| Advertisement carousel on home page | ✅ |
| Manual payment workflow (no payment gateway) | ✅ |
| Cloudinary file uploads | ✅ |
| MongoDB Atlas | ✅ |
| Fully responsive (mobile-first) | ✅ |

---

## 🔌 API Reference

### Auth
```
POST /api/auth/signup          Customer registration
POST /api/auth/login           Customer login
POST /api/auth/owner-login     Owner login
GET  /api/auth/me              Verify token / get current user
```

### Captcha
```
GET  /api/captcha/generate     Get SVG captcha + captchaId
POST /api/captcha/verify       Verify answer
```

### Requests (Customer)
```
POST /api/requests             Submit new request (printing/form/card)
GET  /api/requests/track       Track by requestId + phone (public)
GET  /api/requests/my          My requests (auth required)
```

### Owner (Protected — requires owner role JWT)
```
GET  /api/owner/requests           All requests (filter + paginate)
GET  /api/owner/requests/stats     Dashboard stats (3-step breakdown)
PUT  /api/owner/requests/:id/status   Update status (pending/payment_received/completed)
PUT  /api/owner/requests/:id/receipt  Set itemized receipt
GET  /api/owner/media              All media items
POST /api/owner/media              Add media item
PUT  /api/owner/media/:id          Update media (title, isActive)
DELETE /api/owner/media/:id        Delete media
```

### Media (Public)
```
GET  /api/media?type=demo          Public demo images
GET  /api/media?type=advertisement Public ad banners
GET  /api/media?type=rate_list     Public rate list images
```

### Templates (Public + Owner CRUD)
```
GET    /api/templates              All active templates
GET    /api/templates/:id          Single template
POST   /api/templates              Create (owner)
PUT    /api/templates/:id          Update (owner)
DELETE /api/templates/:id          Delete (owner)
```

### Uploads (Cloudinary)
```
POST /api/upload/file              Image or PDF (for printing orders)
POST /api/upload/template-preview  Template image (also used for media)
POST /api/upload/docs              Multiple govt docs (up to 5)
```

---
## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)

**Services:**
- Cloudinary (file uploads)
- Nodemailer (Email OTP)
- JWT Authentication
---

## 🚢 Deployment

### Backend (Render)
- Set all `.env` variables in Render dashboard
- Entry point: `node server.js`
- Add `CLIENT_URL` env var pointing to your Vercel frontend URL

### Frontend (Vercel)
- Add `VITE_API_URL` env var in Vercel dashboard (not needed if using `vercel.json` proxy)
- Create `frontend/vercel.json` to proxy API calls:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend.onrender.com/api/$1"
    }
  ]
}
```
```bash
cd frontend && npm run build
```