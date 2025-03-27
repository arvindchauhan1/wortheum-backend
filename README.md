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
| POST   | `BASE_URL/auth/register` | Register a new user |
| POST   | `BASE_URL/auth/login`    | Login a user        |

---

### 💻 Example Request Body

#### Register:

```json
POST BASE_URL/auth/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "role": "user"
}
```

#### Login:

```json
POST BASE_URL/auth/login
{
    "email": "john@example.com",
    "password": "123456"
}
```

### Article API Documentation

### Article Routes :


| Method | Endpoint              | Description                         | Authorization |
|:-----:|:---------------------:|:-----------------------------------:|:------------:|
| POST  | `BASE_URL/articles/`      | Create a new article               | Authenticated Users |
| GET   | `BASE_URL/articles/`      | Fetch all articles                 | None         |
| GET   | `BASE_URL/articles/:id`   | Fetch article by ID                | None         |
| DELETE| `BASE_URL/articles/:id`   | Delete article (soft/permanent)    | Publisher, `admin`, `super_admin` |
| PUT   | `BASE_URL/articles/:id`   | Update article                     | Publisher, `admin`, `super_admin` |

### 1. Create Article
**Endpoint:** `POST BASE_URL/articles/`


#### Description

This endpoint allows authenticated users to create an article with a featured image and multiple content blocks, including text and images.

#### Authorization

- Required Roles: `reporter`, `super_admin`
- Authentication: Bearer Token (JWT required)

#### Request Format

##### Headers

```http
Content-Type: multipart/form-data
Authorization: Bearer <your_token>
```

##### Form Data

| Field           | Type                | Description                             |
| --------------- | ------------------- | --------------------------------------- |
| `featuredImage` | `file` (optional)   | A single featured image for the article |
| `blockImages`   | `file[]` (optional) | Multiple image files for image blocks   |
| `data`          | `JSON (string)`     | JSON object containing article details  |

##### JSON Structure in `data` Field

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

#### Response Format

##### Success Response

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

#### Error Responses

###### 400 Bad Request (Invalid JSON)

```json
{
  "error": "Invalid JSON format in data"
}
```

###### 401 Unauthorized

```json
{
  "error": "Unauthorized. Token is missing or invalid."
}
```

###### 500 Internal Server Error

```json
{
  "error": "Something went wrong on the server. Please try again."
}
```

###### Notes

- The `data` field should be sent as a JSON string.
- `blockImages` should align with `blocks` where `type` is `image`.
- Images are stored in `/public/uploads/`.
- The API automatically assigns URLs to uploaded images.

### 2. Get All Articles
**Endpoint:** `GET BASE_URL/articles/`

**Response:**
- `200 OK` - Returns an array of articles
- `204 No Content` - No articles found

### 3. Get Article by ID
**Endpoint:** `GET BASE_URL/articles/:id`

**Response:**
- `200 OK` - Returns the requested article
- `404 Not Found` - Article not found

### 4. Delete Article by ID
**Endpoint:** `DELETE BASE_URL/articles/:id`

**Authorization Required:**
- User must be either the publisher of the article or have the role `local_admin` or `super_admin`.

**Behavior:**
- **Development Mode (`NODE_ENV=dev`)**: Permanently deletes the article and removes associated images from `public/uploads`.
- **Production Mode (`NODE_ENV=production`)**: Soft deletes the article by marking `isDeleted: true`.

**Response:**
- `200 OK` - Article deleted successfully
- `403 Forbidden` - Unauthorized action
- `404 Not Found` - Article not found

### 5. Update Article
**Endpoint:** `PUT BASE_URL/articles/:id`

Update article content, featured image, or block images.  
**Roles:** `publisher`, `local_admin`, `super_admin`

#### Request

**Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`

**Form Data:**
| Field           | Type                | Description                  |
| --------------- | ------------------- | ---------------------------- |
| `featuredImage` | `file` (optional)   | New featured image           |
| `blockImages`   | `file[]` (optional) | New block images             |
| `data`          | `JSON (string)`     | Updated article details     |

__📌 Note__ : Refer Create Article Api for more details.

#### Success Response
`200 OK`
```json
{ "message": "Article updated successfully", "article": { /* updated data */ } }
```

#### Errors
`400` Invalid JSON, `403` Unauthorized, `404` Not Found, `500` Server Error


---
## 🎯 Future Scope

- Password Reset with Email
- and many more...

---

## 🙌 Contribution

Feel free to fork and contribute by submitting a pull request!

---

## 🐛 License

MIT License

```

```
