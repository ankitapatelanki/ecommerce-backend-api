# E-Commerce Backend API

A RESTful E-Commerce Backend API built using Node.js, Express.js, MongoDB, and Mongoose.

This project provides APIs for user authentication, product management, shopping cart, and order management.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Joi Validation
- Git & GitHub
- Postman

## Features

### User
- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Get user profile

### Product
- Create product (Admin only)
- Get all products
- Get product by ID
- Update product (Admin only)
- Delete product (Admin only)

### Cart
- Add product to cart
- Get user cart
- Update cart item quantity
- Remove product from cart

### Order
- Create order
- Get user's orders
- Get order by ID
- Get all orders (Admin only)
- Update order status (Admin only)
- Stock management during order creation

## Project Structure

```text
ecommerce-backend-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Installation

Clone the repository:

```bash
git clone https://github.com/ankitapatelanki/ecommerce-backend-api.git
```

Go to the project directory:

```bash
cd ecommerce-backend-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN=1d
```

Replace the placeholder values with your own credentials.

## Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server runs at:

`http://localhost:3000`

## API Endpoints

Base URL: `http://localhost:3000`

| Module | Method | Endpoint | Access |
|---|---|---|---|
| User | POST | `/api/users/register` | Public |
| User | POST | `/api/users/login` | Public |
| User | GET | `/api/users/profile` | User |
| Product | GET | `/api/products` | Public |
| Product | GET | `/api/products/:id` | Public |
| Product | POST | `/api/products` | Admin |
| Product | PUT | `/api/products/:id` | Admin |
| Product | DELETE | `/api/products/:id` | Admin |
| Cart | POST | `/api/cart` | User |
| Cart | GET | `/api/cart` | User |
| Cart | PUT | `/api/cart/:itemId` | User |
| Cart | DELETE | `/api/cart/:itemId` | User |
| Order | POST | `/api/orders` | User |
| Order | GET | `/api/orders/my-orders` | User |
| Order | GET | `/api/orders/:id` | User |
| Order | GET | `/api/orders/all` | Admin |
| Order | PATCH | `/api/orders/:id/status` | Admin |

## Authentication

Protected routes require a JWT token.

Add the following header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Admin-only routes require an authenticated user with the `admin` role.

## API Testing

APIs can be tested using Postman.

## Author

Ankita