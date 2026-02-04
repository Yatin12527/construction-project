# Construction Procurement Engine

A web application that helps construction companies compare material quotes from multiple suppliers. Instead of juggling spreadsheets and manual calculations, this tool standardizes all quotes and shows you the real cost—including hidden factors like GST, transport charges, payment terms, and minimum order quantities.

## The Problem It Solves

When you're buying construction materials, every supplier quotes differently. Some sell by the bag, others by the kilogram. Some include GST, others don't. Some offer free delivery, others charge transport. Payment terms vary—advance, credit, COD—and that affects your cash flow. Plus, minimum order quantities can force you to buy more than you need.

Comparing quotes manually is a nightmare. This tool does the math for you, converting everything to a standard base unit and calculating the effective price you'll actually pay. Enter your quantity, and it shows you the best deal ranked by total project cost.

## What It Does

- **Quote Management**: Submit and manage material quotes from different suppliers
- **Smart Comparison**: Automatically converts units (bags → kg, pieces → meters) and standardizes pricing
- **Real Cost Calculation**: Factors in GST, transport costs, payment terms, and MOQ penalties
- **Dynamic Pricing**: Enter your required quantity and see how quotes compare in real-time
- **Admin Review**: New suppliers, materials, or units require admin approval before going live
- **User Authentication**: Secure login with role-based access (users and admins)

## Project Structure

```
construction project/
├── backend/                    # Express.js API server
│   ├── config/                # Database and Cloudinary configuration
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Image upload setup
│   ├── middlewares/           # Authentication middleware
│   │   └── authmiddleware.js  # JWT token validation
│   ├── models/                # MongoDB schemas
│   │   ├── Quote.js           # Quote model with pricing logic
│   │   └── User.js            # User model with roles
│   ├── routes/                # API endpoints
│   │   ├── authRoute.js       # Signup, login, logout
│   │   └── quotes.js          # CRUD operations for quotes
│   ├── utils/                 # Business logic
│   │   └── calculator.js      # Price standardization and bill calculation
│   ├── seed.js                # Database seeding script
│   └── server.js              # Express app entry point
│
└── frontend/                  # React application
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── AddQuoteModal.jsx
    │   │   ├── Navbar.jsx
    │   │   └── quotes/        # Quote form sections
    │   ├── pages/             # Main views
    │   │   ├── Dashboard.jsx  # Quote comparison table
    │   │   ├── AdminReview.jsx # Pending quote approval
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── context/           # React context
    │   │   └── AuthContext.jsx # User authentication state
    │   ├── hooks/             # Custom React hooks
    │   │   └── useQuoteForm.js
    │   ├── utils/             # API client and helpers
    │   │   └── api.js         # Axios configuration
    │   └── constants/         # Default values
    │       └── quoteConstants.js
    └── public/                # Static assets
```

## Key Features Explained

### Unit Standardization
Every material has a base unit (kg, meter, liter, or piece). Suppliers can quote in any compatible unit (bags, MT, pieces, etc.), and the system automatically converts to the base unit for fair comparison.

### Effective Price Calculation
The calculator considers:
- **GST**: Adds tax if not included, or uses inclusive pricing
- **Transport**: Adds delivery charges for EX-WORKS terms
- **Payment Terms**: Applies credit discount (1.5% per month of credit)
- **MOQ Penalties**: Flags when minimum order forces you to buy extra

### Dynamic Bill Calculation
Enter your required quantity, and the system:
1. Converts to the supplier's unit
2. Applies MOQ constraints
3. Calculates total bill including all costs
4. Shows effective rate per base unit
5. Ranks quotes by total project cost

### Admin Governance
When users submit quotes with new suppliers, materials, or units, they're marked as "pending" and require admin approval. This keeps the master data clean and standardized.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both backend and frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Environment Setup

Create a `backend/.env` file with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

**Start the backend server:**
```bash
cd backend
npm run dev
```

**Start the frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Seeding the Database

To populate the database with sample quotes:

```bash
cd backend
node seed.js
```

This creates quotes from various suppliers for common construction materials like TMT bars, cement, sand, PVC pipes, etc.

### Default Admin Account

After seeding, you can create an admin account or use:
- **Email**: testuser@gmail.com
- **Password**: 12345

(Note: You'll need to create this user manually or modify the seed script to include it.)

## Technologies Used

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for file uploads
- bcryptjs for password hashing

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Quotes
- `GET /api/quotes?qty=<quantity>` - Get approved quotes (calculates effective prices)
- `POST /api/quotes` - Submit new quote
- `GET /api/quotes/pending` - Get pending quotes (admin only)
- `PATCH /api/quotes/:id/status` - Approve/reject quote (admin only)

## How It Works

1. **Submit Quotes**: Users add quotes with supplier, material, unit, price, and commercial terms
2. **Standardization**: System converts price to base unit, accounting for GST, transport, and payment terms
3. **Comparison**: Dashboard shows all approved quotes sorted by effective price
4. **Dynamic Calculation**: Enter your quantity to see total project cost and effective rates
5. **Governance**: New suppliers/materials require admin approval to maintain data quality

## License

ISC
