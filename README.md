# FirstLend Frontend Documentation

This is the official frontend for the FirstLend loan management system, built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It provides a complete, role-based user interface for both customers and administrators to interact with the [FirstLend .NET API](https://www.google.com/search?q=https://github.com/example/firstlend-api).

This application features two main portals:

1.  **Customer Portal**: Allows users to register, apply for loans, manage their profile, view loan status, make payments, and interact with an AI-powered financial assistant.
2.  **Admin Portal**: A secure backend for staff to manage users, review and approve loan applications, process disbursements, and oversee the platform's financial products.

-----

## ✨ Core Features

### Customer Portal

  * **Authentication**: Secure user registration and login (`Login.tsx`, `Register.tsx`).
  * **Loan Application**: A multi-step form for customers to apply for new loans (`ApplyLoan.tsx`).
  * **Loan Management**: Customers can view their active loans, loan details, and application status (`MyLoans.tsx`, `MyLoansDetail.tsx`).
  * **Payment Integration**: Seamlessly integrates with Paystack for making loan repayments. Includes a dedicated payment modal (`MakePaymentModal.tsx`) and callback pages (`PaymentSuccess.tsx`, `PaymentFailed.tsx`).
  * **Payment History**: A dedicated page to view all past transactions (`PaymentHistory.tsx`).
  * **AI Financial Chat**: A chat interface (`FirstLendChat.tsx`) that connects to the backend's Gemini service for financial advice.
  * **Profile & KYC**: Users can manage their profile (`Profile.tsx`) and upload KYC documents (`KYCDocumentsUpload.tsx`).

### Admin Portal

  * **Separate Authentication**: A dedicated login page for administrators (`AdminLogin.tsx`).
  * **Admin Dashboard**: A central dashboard (`Dashboard.tsx`) displaying key metrics, recent applications, and system statistics.
  * **Application Management**: A complete interface for admins to view, filter, approve, or reject new loan applications (`Applications.tsx`).
  * **Customer Management**: A full list of all registered customers (`Customers.tsx`), including search and filtering.
  * **Loan Disbursement**: A dedicated module for managing and initiating loan payouts to customers (`Disbursement.tsx`), including its own payment callback (`DisbursementCallback.tsx`).
  * **User Management (Admins)**: Ability to manage other admin-level users (`AdminUsers.tsx`).
  * **Product Management**: An interface for creating and managing the different loan types offered by FirstLend (`Products.tsx`).
  * **Payment Overview**: A view of all payments processed by the system (`Payments.tsx`).

-----

## 🛠️ Technology Stack

  * **Framework**: [**React**](https://reactjs.org/) (via [**Vite**](https://vitejs.dev/))
  * **Language**: [**TypeScript**](https://www.typescriptlang.org/)
  * **Routing**: [**React Router**](https://reactrouter.com/) (inferred from `src/App.tsx` and `src/pages/` structure)
  * **Styling**: [**Tailwind CSS**](https://tailwindcss.com/)
  * **Component Library**: [**shadcn/ui**](https://ui.shadcn.com/) (inferred from the extensive `src/components/ui/` directory and `components.json`)
  * **State Management**: **React Context** (as seen in `src/contexts/AuthContext.tsx`)
  * **API Client**: `fetch` or `axios` (defined in `src/services/api.ts`)
  * **Linting**: [**ESLint**](https://eslint.org/)

-----

## 📂 Project Structure

The project follows a standard, feature-driven structure:

```
firstlend/
├── public/                 # Static assets (images, fonts, robots.txt)
├── src/
│   ├── components/
│   │   ├── admin/          # Components specific to the Admin Portal (e.g., AdminLayout)
│   │   ├── customer/       # Components specific to the Customer Portal (e.g., CustomerLayout)
│   │   └── ui/             # Reusable UI components (from shadcn/ui)
│   ├── contexts/           # React Context providers (e.g., AuthContext)
│   ├── hooks/              # Custom React hooks (e.g., use-mobile)
│   ├── lib/                # Utility functions (e.g., utils.ts)
│   ├── pages/
│   │   ├── admin/          # All Admin Portal pages/routes
│   │   └── customer/       # All Customer Portal pages/routes
│   │   ├── AdminLogin.tsx  # Public auth pages
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/
│   │   └── api.ts          # Central API service configuration
│   ├── App.tsx             # Main application component (handles routing)
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global CSS and Tailwind directives
├── .env.example            # Environment variable template
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

-----

## 🚀 Setup & Installation

To run this project locally:

1.  **Clone the Repository**

    ```sh
    git clone https://github.com/GideonBature/firstlend
    cd firstlend
    ```

2.  **Install Dependencies**
    Using npm:

    ```sh
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in the root of the `firstlend` directory. You will need to add the base URL for your .NET backend API.

    ```.env
    VITE_API_BASE_URL=http://localhost:5128
    ```

    *(This URL must match the one your `FirstLend.Api` backend is running on.)*

4.  **Run the Development Server**

    ```sh
    npm run dev
    ```

    This will start the Vite development server, typically at `http://localhost:5173`.

5.  **Build for Production**
    To create an optimized production build:

    ```sh
    npm run build
    ```

    The static files will be generated in the `dist/` folder.