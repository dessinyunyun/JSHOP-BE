# Product API with User Roles

A RESTful API built with Express.js, TypeScript, and Sequelize ORM for managing products with user role-based access control.

## Features

- User authentication (register, login)
- Role-based access control (admin and user roles)
- Product management (CRUD operations)
- Image upload functionality
- MYSQL database with Sequelize ORM
- TypeScript support
- JWT authentication

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies and migrate:

```bash
npm install
npm setup
```

3. Create a `.env` file in the root directory with the following variables

4. Create the uploads directory:

```bash
mkdir uploads
```

5. Start the development server:

```bash
npm run dev
```

## API Endpoints

### User Routes

- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile (requires authentication)

### Product Routes

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get a specific product
- POST `/api/products` - Create a new product (admin only)
- PUT `/api/products/:id` - Update a product (admin only)
- DELETE `/api/products/:id` - Delete a product (admin only)

## Development

The project uses nodemon for development, which automatically restarts the server when changes are detected.

```bash
npm run dev
```

## Building for Production

To build the TypeScript code for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Database Schema

### Users Table

- id (UUID, primary key)
- username (string, unique)
- email (string, unique)
- password (string, hashed)
- role (enum: 'admin' or 'user')
- createdAt (timestamp)
- updatedAt (timestamp)

### Products Table

- id (UUID, primary key)
- name (string)
- description (text)
- image (string)
- price (decimal)
- createdAt (timestamp)
- updatedAt (timestamp)
