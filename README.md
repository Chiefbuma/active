# Radiant Hospital Ambulance Management

This is a comprehensive, full-stack web application designed for managing health activation campaigns. It provides a robust platform for healthcare staff to register patients, track health assessments, manage corporate partnerships, and generate detailed wellness reports. The application is built with a modern tech stack and leverages server-side rendering for optimal performance.

## Key Features

-   **Secure User Authentication**: Complete login system for staff with password hashing and a "Forgot Password" flow.
-   **Centralized Dashboard**: An overview of recently registered patients.
-   **Patient Management**: A complete workflow for registering new patients and viewing their detailed profiles with all related health records.
-   **Comprehensive Assessments**: Functionality to add and view records for Vitals, Nutrition, Health Goals, and Clinical Notes for each patient.
-   **Corporate Partner Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing corporate partners.
-   **User Management**: An admin-only interface to manage staff user accounts.
-   **Dynamic PDF Reporting**: On-the-fly generation of a printable wellness report for each patient, summarizing all their assessment data.
-   **Ambulance Fleet Management**: Features for tracking ambulances, managing drivers and emergency technicians, and recording financial transactions.

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
    ```sh
    git clone https://github.com/your_username_/Project-Name.git
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Environment Configuration**: The project includes a `.env` file which is pre-configured for the Docker environment. No changes are needed to get started.

4.  **Build and Run Services**: Open your terminal in the project root and run the following command. This will build the Next.js app image and start all the necessary services (app, database, phpMyAdmin).

    ```bash
    docker-compose up --build
    ```
    The database will be created, but it will be empty. To use the application, you will need to manually create the tables and insert the initial seed data using a tool like phpMyAdmin. The full database schema is provided below for reference.

5.  **Access the Services**:
    -   **Web Application**: [http://localhost:3000](http://localhost:3000)
    -   **Database Admin (phpMyAdmin)**: [http://localhost:8080](http://localhost:8080)

### Default Login Credentials

After seeding the database, you can log in with:
-   **Email**: `admin@superadmin.com`
-   **Password**: `password`

## Database Schema

Below is the SQL schema for the application.

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `sex` enum('Male','Female','Other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `corporate_id` int DEFAULT NULL,
  `wellness_date` date DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `corporate_id` (`corporate_id`),
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`corporate_id`) REFERENCES `corporates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table `vitals`
--

CREATE TABLE `vitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int NOT NULL,
  `bp_systolic` int DEFAULT NULL,
  `bp_diastolic` int DEFAULT NULL,
  `pulse` int DEFAULT NULL,
  `temp` float DEFAULT NULL,
  `rbs` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `measured_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  CONSTRAINT `vitals_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `nutritions`
--

CREATE TABLE `nutritions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int NOT NULL,
  `height` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `bmi` float DEFAULT NULL,
  `visceral_fat` float DEFAULT NULL,
  `body_fat_percent` float DEFAULT NULL,
  `notes_nutritionist` text,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  CONSTRAINT `nutritions_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `discussion` text,
  `goal` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `clinicals`
--

CREATE TABLE `clinicals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int NOT NULL,
  `notes_psychologist` text,
  `notes_doctor` text,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  CONSTRAINT `clinicals_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
