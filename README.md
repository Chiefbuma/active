# Radiant Hospital Ambulance Management

This is a full-stack web application for managing an ambulance fleet's financial performance and personnel. It provides a robust platform for staff to manage ambulances, track daily financial transactions, and manage drivers and emergency technicians.

## Key Features

-   **Secure User Authentication**: Complete login system for staff with password hashing and a "Forgot Password" flow.
-   **Centralized Admin Dashboard**: An overview of fleet performance with date-range filtering, overall performance metrics, and period-over-period comparisons.
-   **Ambulance Fleet Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing the ambulance fleet, including setting financial targets and default costs.
-   **Detailed Ambulance View**: A dedicated dashboard for each ambulance, showing its details and a complete history of its financial transactions.
-   **Transaction Logging**: A comprehensive form to log daily transactions for each ambulance, automatically calculating performance metrics like `net banked`, `deficit`, and `salary`.
-   **Personnel Management**: Admin-only interfaces to manage drivers, emergency technicians, and application users (staff/admins) with full CRUD capabilities.
-   **Responsive UI**: A modern, responsive user interface built with ShadCN UI and Tailwind CSS.

## Tech Stack

-   **Framework**: **Next.js** (v14+ App Router)
-   **Language**: **TypeScript**
-   **UI**: **ShadCN UI** & **Tailwind CSS**
-   **Database**: **MySQL**
-   **Containerization**: **Docker** & **Docker Compose**
-   **Authentication**: **bcryptjs** for password hashing.

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

4.  **Set up the Database**: A `localhost.sql` file is included in the project root. Connect to your MySQL instance (e.g., via phpMyAdmin at `http://localhost:8080`) and import this file. It will create all necessary tables and a default admin user.

5.  **Build and Run Services**: Open your terminal in the project root and run the following command. This will build the Next.js app image and start all the necessary services (app, database, phpMyAdmin).

    ```bash
    docker-compose up --build
    ```

6.  **Access the Services**:
    -   **Web Application**: [http://localhost:3000](http://localhost:3000)
    -   **Database Admin (phpMyAdmin)**: [http://localhost:8080](http://localhost:8080) (User: `root`, Password: `secret`)
    -   **Default Login**: After importing the database, you can log in with:
        -   **Email**: `admin@superadmin.com`
        -   **Password**: `password`
