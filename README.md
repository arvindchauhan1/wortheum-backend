# Wortheum Backend API

A modular and scalable RESTful API built using **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features
- User Registration & Login
- Role-based User Handling (user, reporter, local_admin, super_admin)
- Validation with **express-validator**
- Centralized Error & Success Handlers
- Async Middleware Support
- MongoDB with **Mongoose ODM**
- Environment-based configuration with **dotenv**

---

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- bcryptjs (password hashing)
- express-validator
- dotenv

---

## 📁 Folder Structure

```
wortheum-backend/
├── controllers/
│   └── authController.js
├── middlewares/
│   ├── asyncHandler.js
│   └── errorHandler.js
├── models/
│   └── userModel.js
├── routes/
│   └── authRoutes.js
│   └── index.js
├── utils/
│   ├── successHandler.js
│   ├── ApiError.js
│   └── authValidator.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## 🔗 Clone & Get Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/wortheum-backend.git
cd wortheum-backend
```

### 2️⃣ Create a `.env` file in the root directory
```env
NODE_ENV="dev"
PORT=8000
MONGO_URI="mongodb://127.0.0.1:27017/wortheum"
JWT_SECRET="fast"
```

### 3️⃣ Install project dependencies
```bash
npm install
```

### 4️⃣ Start the development server
```bash
npm run dev
```

> Server will start at: **http://localhost:8000**

---

## 🧩 API Endpoints

### Auth Routes:
| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| POST   | `/api/v1/auth/register`   | Register a new user        |
| POST   | `/api/v1/auth/login`      | Login a user               |

---

## 💻 Example Request Body

### Register:
```json
POST /api/v1/auth/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "role": "user"
}
```

### Login:
```json
POST /api/v1/auth/login
{
    "email": "john@example.com",
    "password": "123456"
}
```

---

## 📌 Notes
- Clean & modular folder structure.
- Centralized response handlers.
- Express-validator based validation.
- Async error handling with custom `asyncHandler()`.

---

## 🎯 Future Scope
- JWT Authentication
- Password Reset with Email
- Role Permissions Middleware
- Testing with Jest or Mocha

---

## 🙌 Contribution
Feel free to fork and contribute by submitting a pull request!

---

## 🐛 License
MIT License
```