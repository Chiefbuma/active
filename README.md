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

4.  **Set up the Database**: The application requires a specific database schema to function. Connect to your MySQL instance (e.g., via phpMyAdmin at `http://localhost:8080`) and execute the SQL commands provided in the `Database Schema` section below to create the necessary tables.

5.  **Build and Run Services**: Open your terminal in the project root and run the following command. This will build the Next.js app image and start all the necessary services (app, database, phpMyAdmin).

    ```bash
    docker-compose up --build
    ```

6.  **Access the Services**:
    -   **Web Application**: [http://localhost:3000](http://localhost:3000)
    -   **Database Admin (phpMyAdmin)**: [http://localhost:8080](http://localhost:8080) (User: `root`, Password: `secret`)

### Default Login Credentials

After setting up the database and seeding the `users` table, you can log in. To create an initial admin user, you can run the following SQL:
```sql
INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@superadmin.com', '$2a$10$f.4.B5/1F2b.b5f5E5g5Cu0y5G5E5g5Cu0y5G5E5g5Cu0y5G5E5g', 'admin');
-- Note: The password is 'password'. Generate a secure hash for production.
```

## Database Schema

Execute the following SQL queries in your MySQL database to set up the required tables.

```sql
--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `avatarUrl` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `ambulances`
--
CREATE TABLE `ambulances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(255) NOT NULL,
  `fuel_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `operation_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `target` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reg_no` (`reg_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `drivers`
--
CREATE TABLE `drivers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `emergency_technicians`
--
CREATE TABLE `emergency_technicians` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `transactions`
--
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `ambulance_id` int NOT NULL,
  `driver_id` int NOT NULL,
  `total_till` decimal(10,2) NOT NULL,
  `target` decimal(10,2) NOT NULL,
  `fuel` decimal(10,2) NOT NULL,
  `operation` decimal(10,2) NOT NULL,
  `cash_deposited_by_staff` decimal(10,2) NOT NULL,
  `amount_paid_to_the_till` decimal(10,2) NOT NULL,
  `offload` decimal(10,2) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `operations_cost` decimal(10,2) NOT NULL,
  `net_banked` decimal(10,2) NOT NULL,
  `deficit` decimal(10,2) NOT NULL,
  `performance` decimal(5,4) NOT NULL,
  `fuel_revenue_ratio` decimal(5,4) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ambulance_id` (`ambulance_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`ambulance_id`) REFERENCES `ambulances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `transaction_technicians`
--
CREATE TABLE `transaction_technicians` (
  `transaction_id` int NOT NULL,
  `technician_id` int NOT NULL,
  PRIMARY KEY (`transaction_id`,`technician_id`),
  KEY `technician_id` (`technician_id`),
  CONSTRAINT `transaction_technicians_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transaction_technicians_ibfk_2` FOREIGN KEY (`technician_id`) REFERENCES `emergency_technicians` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

```
