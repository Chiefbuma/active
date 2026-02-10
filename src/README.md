# Radiant Hospital Ambulance Management

This is a full-stack web application for managing an ambulance fleet's financial performance and personnel. It provides a robust platform for staff to manage ambulances, track daily financial transactions, and manage drivers and emergency technicians.

## Key Features

-   **Secure User Authentication**: Complete login system for staff with password hashing and a "Forgot Password" flow.
-   **Role-Based Access Control (RBAC)**: Distinct roles for `Admin` and `Staff`, where Admins have full access to settings and personnel management.
-   **Centralized Admin Dashboard**: An overview of fleet performance with date-range filtering, overall performance metrics (Net Banked vs. Target), and period-over-period comparisons.
-   **Ambulance Fleet Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing the ambulance fleet, including setting financial targets and default costs.
-   **Detailed Ambulance View**: A dedicated dashboard for each ambulance, showing its details and a complete, filterable, and paginated history of its financial transactions.
-   **Transaction Logging & Management**: A comprehensive form to log daily transactions for each ambulance, which automatically calculates performance metrics like `net banked`, `deficit`, and `salary`. Includes full CRUD capabilities for transactions.
-   **Personnel Management**: Admin-only interfaces to manage drivers, emergency technicians, and application users (staff/admins) with full CRUD capabilities.
-   **Bulk Operations**: Ability to delete multiple records (ambulances, users, etc.) at once from data tables.
-   **Data Export**: Export fleet performance summaries and detailed transaction reports to Excel (`.xlsx`).
-   **Responsive UI**: A modern, responsive user interface built with ShadCN UI and Tailwind CSS, providing a seamless experience on both desktop and mobile devices.

## Tech Stack

-   **Framework**: **Next.js 14+** (using the App Router)
-   **Language**: **TypeScript**
-   **UI Components**:
    -   **ShadCN UI**: A collection of beautifully designed, accessible, and reusable components.
    -   **Tailwind CSS**: For all styling and layout.
    -   **Recharts**: For data visualization and charts on the admin dashboard.
    -   **Lucide React**: For icons.
-   **Forms**: **React Hook Form** for robust and performant form handling.
-   **Data Tables**: **TanStack Table v8** for powerful, fast, and extensible data grids.
-   **Backend**: **Next.js API Routes** serving as the RESTful backend.
-   **Database**: **MySQL 8.0**
-   **Authentication**: **bcryptjs** for secure password hashing.
-   **Utilities**:
    -   **date-fns**: For reliable date manipulation.
    -   **xlsx**: For generating Excel file exports.
-   **Local Development**: **Docker** & **Docker Compose** for a consistent and reproducible development environment.

## Application Architecture & Design Patterns

The application follows a modern, server-centric web architecture leveraging the full capabilities of the Next.js App Router.

-   **Overall Architecture**:
    -   **Monolithic Repository**: The frontend and backend code coexist within a single Next.js project, simplifying development and deployment.
    -   **Three-Tier Architecture**:
        1.  **Presentation Layer (Frontend)**: Built with React Server Components (RSCs) and Client Components. RSCs are used for initial data fetching and static rendering to improve load times, while Client Components (`'use client'`) handle all user interactivity, state management, and browser-side APIs.
        2.  **Application Logic Layer (Backend)**: Implemented using Next.js API Routes (`src/app/api`). These routes contain the business logic, handle data validation, perform calculations for financial metrics, and interact with the database.
        3.  **Data Access Layer (DAL)**: A dedicated module (`src/lib/db.ts`) manages the MySQL database connection pool. Data fetching and mutation logic are abstracted into functions within `src/lib/data.ts` (client-side fetching) and `src/lib/server-data.ts` (server-side fetching), acting as a simplified repository pattern.

-   **Design Patterns & Concepts**:
    -   **Component-Based Architecture**: The UI is composed of small, reusable React components, leveraging the power of ShadCN UI for core elements like forms, tables, dialogs, and cards.
    -   **Server-Side Rendering (SSR) & Static Site Generation (SSG)**: The App Router's use of Server Components allows data to be fetched and rendered on the server, sending fully-formed HTML to the client for faster initial page loads.
    -   **RESTful API Design**: The API routes are structured around resources (e.g., `/api/ambulances`, `/api/users/:id`) and use standard HTTP methods (GET, POST, PUT, DELETE) for operations.
    -   **Client-Side State Management**: Primarily uses React's built-in hooks (`useState`, `useEffect`, `useMemo`). User session information is stored in `localStorage`.
    -   **Defensive Programming**: The backend API is designed to be resilient, handling cases where related data might be missing (e.g., a transaction linked to a deleted driver) to prevent crashes.
    -   **Database Connection Pooling**: The `mysql2` library is configured to use a connection pool, which efficiently manages database connections for better performance and scalability.

## Folder Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   ├── dashboard/        # Main application pages and layouts
│   │   ├── (auth)/           # Login, Forgot Password pages
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/               # ShadCN UI components
│   │   ├── Header.tsx        # Main application header
│   │   └── ...               # Other reusable components
│   ├── hooks/
│   │   └── use-toast.ts      # Custom hook for showing notifications
│   ├── lib/
│   │   ├── data.ts           # Client-side data fetching functions
│   │   ├── db.ts             # Database connection setup
│   │   ├── excel-export.ts   # Logic for exporting data to Excel
│   │   ├── server-data.ts    # Server-side data fetching functions
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── utils.ts          # Utility functions (e.g., cn for Tailwind)
│   └── ...
├── docker-compose.yml        # Defines all services for local development
├── localhost.sql             # Initial database schema and default admin user
└── ...
```

## Getting Started

This project is fully containerized with Docker, making local setup straightforward.

### Prerequisites

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Running the Application

1.  **Clone the Repository**

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Environment Configuration**: The project includes a `.env` file which is pre-configured for the Docker environment. No changes are needed to get started.

4.  **Set up the Database**: A `localhost.sql` file is included in the project root. This file will be automatically imported by the MySQL service when it starts for the first time, creating all necessary tables and a default admin user.

5.  **Build and Run Services**: Open your terminal in the project root and run the following command. This will build the Next.js app image and start all the necessary services (app, database, phpMyAdmin).

    ```bash
    docker-compose up --build
    ```

6.  **Access the Services**:
    -   **Web Application**: [http://localhost:3000](http://localhost:3000)
    -   **Database Admin (phpMyAdmin)**: [http://localhost:8080](http://localhost:8080) (User: `root`, Password: `secret`)
    -   **Default Login**: After the services are running, you can log in with:
        -   **Email**: `admin@superadmin.com`
        -   **Password**: `password`
