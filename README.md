# Launchpad Intensive Private Limited 🚀

India's premier internship platform for college students — full-stack web application with payment, certificate generation, and email delivery.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Payments | Razorpay (test mode) |
| Certificates | PDFKit |
| Email | Nodemailer (Gmail) |
| Deploy | Docker + Nginx |

---

## 📁 Project Structure

```
launchpad/
├── backend/
│   ├── config/         # DB & email config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & admin guards
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── seeds/          # DB seed script
│   ├── services/       # PDF & email services
│   ├── utils/          # JWT helper
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/ # Navbar, Footer
│   │   ├── context/    # AuthContext
│   │   ├── pages/      # All pages
│   │   └── services/   # Axios API layer
│   └── index.html
└── docker-compose.yml
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB 8.x (local installation)
- Git

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend `.env`** (already created at `backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/launchpad
JWT_SECRET=your_secret_here
ADMIN_EMAIL=admin@launchpad.com
ADMIN_PASSWORD=your_secure_password

# Razorpay Test Keys
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_secret

# Gmail (for certificate emails)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend `.env`**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

```bash
# Windows (using installed MongoDB 8.2)
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C:\data\db
```

### 4. Seed the Database

```bash
cd backend
node seeds/seed.js
```

Output:
```
✅ Connected to MongoDB for seeding
🗑️  Cleared internships
👤 Admin user created
🎓 3 internships seeded
✅ Seeding complete!
```

### 5. Start Servers

```bash
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Visit: **http://localhost:5173**

---

## 🔐 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@launchpad.com | Admin@Launchpad2024 |
| Student | Sign up at /signup | — |

---

## 📄 API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register student |
| POST | `/api/auth/login` | Login |

### Internships
| Method | Route | Access |
|---|---|---|
| GET | `/api/internships` | Public |
| POST | `/api/internships` | Admin |
| PUT | `/api/internships/:id` | Admin |
| DELETE | `/api/internships/:id` | Admin |

### Payments
| Method | Route | Description |
|---|---|---|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify & enroll student |
| GET | `/api/payment/history` | Student payment history |

### Certificates
| Method | Route | Description |
|---|---|---|
| POST | `/api/certificate/generate/:userId` | Generate PDF cert (Admin) |
| POST | `/api/certificate/send/:userId` | Email cert to student (Admin) |
| GET | `/api/certificate/my` | Student's certificates |
| GET | `/api/certificate/download/:id` | Download PDF |

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

---

## 🎓 Certificate Flow

1. Student pays via Razorpay → payment verified → enrolled
2. Admin visits Admin Panel → Certificates tab → clicks "Generate"
3. PDF certificate generated with PDFKit, saved to `backend/uploads/`
4. Admin clicks "Email" → certificate sent via Gmail attachment
5. Student can download from their Dashboard

---

## 📧 Gmail Setup (for certificate emails)

1. Enable 2FA on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Set `EMAIL_USER` and `EMAIL_PASS` in `backend/.env`

---

## 🏆 Pages

| Route | Page |
|---|---|
| `/` | Home (Hero, Stats, Features, Testimonials, FAQ) |
| `/about` | About Us |
| `/internships` | All Programs |
| `/companies` | Partner with Us |
| `/contact` | Contact |
| `/signup` | Student Registration |
| `/login` | Login |
| `/dashboard` | Student Dashboard |
| `/admin` | Admin Panel |

---

*Built with ❤️ by Launchpad Intensive Private Limited*
