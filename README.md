# Taria Health Activation

This is a comprehensive, full-stack web application designed for managing health activation campaigns. It provides a robust platform for healthcare staff to register patients, track a wide range of health assessments, manage corporate partnerships, and generate detailed wellness reports. The application is built with a modern tech stack and follows best practices for scalability, maintainability, and security.

## Features

-   **Secure User Authentication**: A complete login system for staff members with secure password hashing (`bcryptjs`) and a "Forgot Password" flow.
-   **Centralized Dashboard**: An overview of recently registered patients for the current campaign.
-   **Patient Management**: A complete workflow for registering new patients and viewing their detailed profiles.
-   **Comprehensive Assessments**: Functionality to add and view records for Vitals, Nutrition, Health Goals, and Clinical Notes.
-   **Corporate Partner Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing corporate partners.
-   **Dynamic PDF Reporting**: On-the-fly generation of a printable wellness report for each patient, summarizing all their assessment data.
-   **Local Development Environment**: A fully containerized setup using Docker Compose for easy local development.

## Tech Stack

This project is built with a modern and robust technology stack:

-   **Framework**: **Next.js** (v14+ with App Router) for a full-stack React experience with Server Components and API Routes.
-   **Language**: **TypeScript** for type safety and improved developer experience.
-   **UI Library**: **ShadCN UI** built on top of **Tailwind CSS** for a professional, component-based design system.
-   **Database**: **MySQL** for robust, relational data storage.
-   **Containerization**: **Docker** and **Docker Compose** for a consistent and reproducible development environment.
-   **Authentication**: **bcryptjs** for secure password hashing and validation.


## Software Design Principles

-   **Full-Stack Architecture**: A modern architecture with a Next.js frontend and a backend API built with Next.js API Routes.
-   **RESTful API**: The backend exposes a clear, RESTful API for all CRUD operations, ensuring a clean separation of concerns between the client and server.
-   **Component-Based UI**: The frontend is built using reusable React components, promoting maintainability and code reuse.
-   **Database-Driven**: All application data is stored in a relational MySQL database, ensuring data integrity and persistence.
-   **Secure by Design**: Implements a secure authentication flow with industry-standard password hashing to protect user credentials.
-   **Environment Configuration**: Utilizes `.env` files to manage environment-specific variables, keeping sensitive credentials out of the codebase.

## Getting Started

To get started with local development, ensure you have Docker and Docker Compose installed.

1.  **Environment Setup**: The project includes a `.env` file with the necessary environment variables for the Docker setup.
2.  **Build and Run**: From the root of the project, run the following command:
    ```bash
    docker-compose up --build
    ```
3.  **Access the Application**:
    -   Next.js App: **http://localhost:3000**
    -   phpMyAdmin: **http://localhost:8080**
    -   Default Login: `admin@superadmin.com` / `password`

## Database Schema

Below is the SQL schema for the application. You can use this to set up your local MySQL database.

```sql
--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','staff','navigator','payer','physician') NOT NULL DEFAULT 'staff',
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `corporates`
--

CREATE TABLE `corporates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `wellness_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
```

## Seed Data

```sql
--
-- Dumping data for table `users`
--
-- Note: The password for 'admin@superadmin.com' is 'password'.
-- It is stored as a bcrypt hash for security. The login API handles this automatically.
--
INSERT INTO `users` (`id`, `name`, `email`, `role`, `password`) VALUES
(1, 'Taria Admin', 'admin@superadmin.com', 'admin', '$2a$10$e.ExV22GgR5n2DR1aT58IeB2P5sJvKYp./35E49b2oeCqL44g1yH6');

--
-- Dumping data for table `corporates`
--

INSERT INTO `corporates` (`id`, `name`, `wellness_date`) VALUES
(1, 'Bio Food Products', '2025-09-29'),
(2, 'Ikomoko', '2025-10-01'),
(3, 'Taria', '2025-10-01');

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `first_name`, `middle_name`, `surname`, `sex`, `dob`, `age`, `phone`, `email`, `corporate_id`) VALUES
(1, 'Sylvester', NULL, 'Musa', 'Male', '1997-01-01', 28, '743955149', 'musasylvester1065@gmail.com', 1),
(2, 'Tom', 'Mbalala', 'Wawire', 'Male', '1970-01-01', 55, '729089363', 'tommbalala@20.com', 1),
(3, 'Euticus', 'Matumbi', 'Muthuri', 'Male', '1991-01-01', 34, '742025594', 'matumbieutychus@gmail.com', NULL),
(4, 'Paul', NULL, 'Ratemo', 'Male', '1985-01-01', 40, '743760460', 'paulratemo84@gmail.com', NULL),
(5, 'Kingsley', NULL, 'Otieno', 'Male', '1976-01-01', 49, '724785997', 'nyakrojala@gmail.com', NULL);

--
-- Dumping data for table `vitals`
--

INSERT INTO `vitals` (`registration_id`, `bp_systolic`, `bp_diastolic`, `pulse`, `temp`, `rbs`) VALUES
(1, 114, 73, 58, 36.4, '5.1'),
(2, 150, 99, 62, 36.4, '6.2'),
(3, 133, 81, 70, 36.1, 'NOT SUPPORTED'),
(4, 135, 89, 74, 37, '5.5'),
(5, 171, 118, 76, 37, '5.8');

--
-- Dumping data for table `nutritions`
--

INSERT INTO `nutritions` (`registration_id`, `height`, `weight`, `bmi`, `visceral_fat`, `body_fat_percent`, `notes_nutritionist`) VALUES
(1, 169, 64.8, 23, 2, 10.3, 'normal nutritional status'),
(2, 175, 84, 27, NULL, NULL, NULL),
(3, 169, 81, 28, NULL, NULL, 'ecouraged on excercise'),
(4, 181, 74.8, 23, 6, 18.5, 'encouraged on exercise');

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`registration_id`, `user_id`, `discussion`, `goal`) VALUES
(1, 1, 'Patient wants to improve cardiovascular health and reduce stress.', 'Incorporate 30 minutes of moderate cardio exercise 3 times a week. Practice mindfulness meditation for 10 minutes daily.'),
(2, 1, 'Patient is concerned about his high blood pressure reading and wants to manage it better.', 'Reduce daily sodium intake to under 2,300mg. Monitor blood pressure at home weekly and keep a log.');

--
-- Dumping data for table `clinicals`
--

INSERT INTO `clinicals` (`registration_id`, `user_id`, `notes_doctor`, `notes_psychologist`) VALUES
(1, 1, 'Patient is in good health. Advised on consistent exercise and a balanced diet. Follow up in 6 months.', 'No immediate concerns. Patient seems well-adjusted and motivated.'),
(2, 1, 'Diagnosed with Stage 1 Hypertension. Prescribed Lisinopril 10mg. Advised on lifestyle modifications, particularly diet and exercise. Follow up in 1 month to check BP.', 'Patient is showing signs of anxiety related to his new diagnosis. Provided resources for stress management.');
```