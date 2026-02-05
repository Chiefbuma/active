# Radiant Hospital Ambulance Management

This is a comprehensive, full-stack web application designed for managing an ambulance fleet and their daily revenue. It provides a robust platform for staff to manage ambulances, drivers, emergency technicians, and log daily financial transactions. The application is built with a modern tech stack and follows best practices for scalability, maintainability, and security.

## Features

-   **Secure User Authentication**: A complete mock login system for staff members with roles (Admin, Staff).
-   **Ambulance Fleet Management**: A centralized dashboard to view all ambulances.
-   **Dedicated Ambulance Dashboards**: Detailed view for each ambulance showing its information and a log of all its financial transactions.
-   **Transaction Management**: A complete workflow for adding new financial transactions for each ambulance, with automated business logic calculations for key metrics like `net_banked`, `performance`, and `deficit`.
-   **Staff Management**: Under a unified "Settings" page, administrators can manage App Users, Drivers, and Emergency Technicians.

## Tech Stack

This project is built with a modern and robust technology stack:

-   **Framework**: **Next.js** (v14+ with App Router) for a full-stack React experience with Server Components.
-   **Language**: **TypeScript** for type safety and improved developer experience.
-   **UI Library**: **ShadCN UI** built on top of **Tailwind CSS** for a professional, component-based design system.
-   **Mock Data**: The application currently runs on mock data, allowing for rapid UI/UX development and testing without a database.

## Getting Started

To get started with local development:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
3.  **Access the Application**:
    -   Next.js App: **http://localhost:3000**
    -   Default Login: `admin@example.com` / `password`
