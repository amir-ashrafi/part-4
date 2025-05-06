# Blog List Application (Part 4)

✅ **Answers 4.1–4.23 completed**

This repository contains the server-side implementation of the Blog List application as defined in Part 4 of the Fullstack Open course. The application provides a RESTful API for managing blog posts and user administration, built with Node.js, Express, and MongoDB.

---

## Prerequisites

- Node.js version **>= v22.3.0** (check with `node -v`)  
- npm or yarn  
- MongoDB (local or Atlas)  

---

## Install dependencies
bash
Copy
Edit
npm install
# or
yarn install

Create a .env file in the root directory based on the sample below.

## Start the server with hot reload:

npm run dev
The API will be available at http://localhost:3003/api.

## 📁 Project Structure
```md
├── controllers/       # Express route handlers
│   ├── blogs.js
│   ├── users.js
│   └── login.js
├── models/            # Mongoose schemas and models
│   ├── blog.js
│   └── user.js
├── utils/             # Helpers, middleware, configuration
│   ├── list_helper.js
│   ├── config.js
├── tests/             # Jest & SuperTest test files
│   ├── blog_api.test.js
│   ├── list_helper.test.js
│   └── user_api.test.js
├── middleware/             # middleware
│   ├── tokenExtractor.js
│   ├── userExtractor.js
├── app.js             # Express application setup
├── index.js           # Server entry point
├── package-lock.json   
├── package.json
└── README.md          # This documentation
Environment Variables
Create a .env file at the project root with the following:

the code env
```
## Environment Variables

Create a `.env` file in the project root with the following keys:

```dotenv
MONGODB_URI=your_production_db_uri
TEST_MONGODB_URI=your_test_db_uri
PORT=3003
SECRET=your_jwt_secret ```