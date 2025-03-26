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

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login`    | Login a user        |

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

# Create Article API Documentation

## Endpoint

**POST** `/api/articles`

## Description

This endpoint allows authenticated users to create an article with a featured image and multiple content blocks, including text and images.

## Authorization

- Required Roles: `reporter`, `super_admin`
- Authentication: Bearer Token (JWT required)

## Request Format

### Headers

```http
Content-Type: multipart/form-data
Authorization: Bearer <your_token>
```

### Form Data

| Field           | Type                | Description                             |
| --------------- | ------------------- | --------------------------------------- |
| `featuredImage` | `file` (optional)   | A single featured image for the article |
| `blockImages`   | `file[]` (optional) | Multiple image files for image blocks   |
| `data`          | `JSON (string)`     | JSON object containing article details  |

### JSON Structure in `data` Field

```json
{
  "title": "AI Revolution in 2025",
  "subtitle": "How AI is changing the world",
  "region": "Global",
  "tags": ["AI", "Technology", "Future"],
  "readTime": 5,
  "blocks": [
    {
      "type": "paragraph",
      "data": {
        "text": "AI is improving diagnostics and patient care."
      }
    },
    {
      "type": "image",
      "data": {
        "caption": "AI-powered diagnostics",
        "altText": "A doctor using AI for medical imaging"
      }
    }
  ],
  "featuredImage": {
    "caption": "AI in the future",
    "altText": "AI-powered robot"
  }
}
```

## Response Format

### Success Response

**Status Code:** `201 Created`

```json
{
  "message": "Article created successfully",
  "article": {
    "title": "AI Revolution in 2025",
    "subtitle": "How AI is changing the world",
    "region": "Global",
    "tags": ["AI", "Technology", "Future"],
    "readTime": 5,
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "AI is improving diagnostics and patient care."
        }
      },
      {
        "type": "image",
        "data": {
          "url": "/public/uploads/1700000000-image1.jpg",
          "caption": "AI-powered diagnostics",
          "altText": "A doctor using AI for medical imaging"
        }
      }
    ],
    "featuredImage": {
      "url": "/public/uploads/1700000000-featured.jpg",
      "caption": "AI in the future",
      "altText": "AI-powered robot"
    }
  }
}
```

### Error Responses

#### 400 Bad Request (Invalid JSON)

```json
{
  "error": "Invalid JSON format in data"
}
```

#### 401 Unauthorized

```json
{
  "error": "Unauthorized. Token is missing or invalid."
}
```

#### 500 Internal Server Error

```json
{
  "error": "Something went wrong on the server. Please try again."
}
```

## Notes

- The `data` field should be sent as a JSON string.
- `blockImages` should align with `blocks` where `type` is `image`.
- Images are stored in `/public/uploads/`.
- The API automatically assigns URLs to uploaded images.

**Example Usage (cURL):**

```sh
curl -X POST "http://localhost:5000/api/articles" \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: multipart/form-data" \
-F "featuredImage=@/path/to/featured.jpg" \
-F "blockImages=@/path/to/image1.jpg" \
-F "blockImages=@/path/to/image2.jpg" \
-F "data={\"title\":\"AI Revolution in 2025\",\"region\":\"Global\",...}"
```

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

```
