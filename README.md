# E-Commerce Product Catalog + Cart

A small e-commerce application allowing users to register, log in, browse products (with search, sorting, and pagination), and manage a cart scoped strictly to their account. The application features two roles (admin and user) and implements secure backend calculation for cart totals.

## Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS for styling
- React Router DOM for routing
- Axios for API requests
- Lucide React for icons

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- JSON Web Token (JWT) stored in httpOnly cookies for secure authentication
- cookie-parser for handling secure session cookies
- bcrypt for password hashing
- express-validator for robust input validation

## Setup Steps

### 1. Database & Environment Setup
Ensure you have MongoDB running locally (default: `mongodb://127.0.0.1:27017`) or modify the `MONGO_URI` in the `.env` file.

Navigate to the `backend` directory and set up the `.env` file based on the provided `.env.example`:
```bash
cd backend
cp .env.example .env
```

### 2. Install Dependencies
Install dependencies for both backend and frontend:
```bash
# In the backend directory
npm install

# In the frontend directory 
cd ../frontend
npm install
```

### 3. Seed the Database
Seed the database with sample products and the initial Admin user.
```bash
cd ../backend
npm run seed
```
*Note: This script will clear existing `User` and `Product` collections before inserting.*

### 4. Run the Application
You will need two terminal windows to run both servers.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

## Admin Login Credentials
When you run the seed script, an admin account is automatically created. You can use these credentials to access the application as an admin:
- **Email:** `admin@example.com`
- **Password:** `admin123`

*(Note: The frontend does not currently have a dedicated Admin UI for product management as it was listed as an optional bonus, but the backend API strictly enforces admin-only access on product creation/modification routes).*

## Key Assumptions & Design Decisions
- **Cart Architecture:** The cart total is strictly calculated on the backend (`GET /cart`). The frontend merely displays this calculated total and does not perform its own pricing math to prevent client-side manipulation.
- **Data Privacy:** Users can only view and modify their own carts. The cart operations (`POST /cart`, `PATCH /cart/:id`, `DELETE /cart/:id`) inherently use the logged-in user's decoded JWT ID, removing the risk of ID-guessing attacks (Insecure Direct Object Reference).
- **Out of Stock:** Items with `0` stock are seeded (like the "1080p HD Webcam"). The frontend explicitly disables the "Add to Cart" button for these items, and the backend also strictly rejects any attempt to add or increment items beyond their available stock limits.
- **Error Handling:** All unhandled errors and thrown exceptions in the backend are routed through a centralized `errorHandler` middleware. This ensures the frontend consistently receives standard JSON error responses without leaking server stack traces in production.
