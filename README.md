# FirstLend - Digital Loan Management System

A modern web application for loan management, built with React, TypeScript, and Node.js backend.

## Project Overview

**FirstLend** is a comprehensive loan management platform that enables customers to apply for loans, make payments, and track their loan status, while administrators can manage applications, approve/reject loans, and monitor system operations.

### Key Features

- **Authentication**: Secure login/registration for customers and admins
- **Customer Portal**: Apply for loans, view loan history, make payments
- **Admin Dashboard**: Manage applications, customers, payments, and reports
- **Real-time Updates**: Live dashboard analytics and metrics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js with JWT authentication
- **Database**: PostgreSQL
- **Build Tool**: Vite

## Quick Start

### Prerequisites
- Node.js & npm installed
- Backend running on `http://localhost:5128`

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd firstlend

# Install dependencies
npm i

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Frontend Integration

The frontend is fully integrated with the backend authentication system. Key endpoints:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

For detailed integration documentation, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## Project Structure

```
src/
├── pages/          # Route pages
├── components/     # Reusable UI components
├── contexts/       # Auth context for state management
├── services/       # API communication layer
├── hooks/          # Custom React hooks
└── lib/            # Utilities
```

## Development

- **Linting**: `npm run lint`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Documentation

- [Backend Documentation](./backend.md) - Backend API specifications
- [Integration Guide](./INTEGRATION_GUIDE.md) - Frontend-backend integration details

