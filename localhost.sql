-- Radiant Hospital Ambulance Management Database Schema
-- Version 1.0

-- This file contains the complete SQL schema for the application,
-- including table structures and initial mock data.
--
-- To set up your local database:
-- 1. Ensure your Docker container for MySQL is running.
-- 2. Connect to your MySQL instance (e.g., via phpMyAdmin at http://localhost:8080).
-- 3. Create a database named `radiant_health_db`.
-- 4. Select the `radiant_health_db` database.
-- 5. Import this SQL file.

--
-- Drop existing tables if they exist to start fresh
--
DROP TABLE IF EXISTS `transaction_technicians`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `ambulances`;
DROP TABLE IF EXISTS `drivers`;
DROP TABLE IF EXISTS `emergency_technicians`;


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


--
-- Mock Data Insertion
--

-- Default Users (password for both is "password")
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin User', 'admin@superadmin.com', '$2a$10$f.4.B5/1F2b.b5f5E5g5Cu0y5G5E5g5Cu0y5G5E5g5Cu0y5G5E5g', 'admin'),
('Staff User', 'staff@example.com', '$2a$10$f.4.B5/1F2b.b5f5E5g5Cu0y5G5E5g5Cu0y5G5E5g5Cu0y5G5E5g', 'staff');

-- Mock Drivers
INSERT INTO `drivers` (`name`) VALUES
('John Mwangi'),
('Peter Ochieng'),
('Mary Wanjiru');

-- Mock Emergency Technicians
INSERT INTO `emergency_technicians` (`name`) VALUES
('Jane Doe'),
('James Smith'),
('Fatima Al-Fassi');

-- Mock Ambulances
INSERT INTO `ambulances` (`reg_no`, `fuel_cost`, `operation_cost`, `target`, `status`) VALUES
('KDA 123A', 3000.00, 1500.00, 10000.00, 'active'),
('KDB 456B', 3500.00, 2000.00, 12000.00, 'active'),
('KDC 789C', 2800.00, 1200.00, 9000.00, 'inactive');

-- Mock Transactions
-- Transaction 1
INSERT INTO `transactions` (`date`, `ambulance_id`, `driver_id`, `total_till`, `target`, `fuel`, `operation`, `cash_deposited_by_staff`, `amount_paid_to_the_till`, `offload`, `salary`, `operations_cost`, `net_banked`, `deficit`, `performance`, `fuel_revenue_ratio`) VALUES
('2024-05-20', 1, 1, 15000.00, 10000.00, 3000.00, 1500.00, 5000.00, 10000.00, 10500.00, 500.00, 2000.00, 10000.00, 0.00, 1.0000, 0.2000);
-- Transaction 2
INSERT INTO `transactions` (`date`, `ambulance_id`, `driver_id`, `total_till`, `target`, `fuel`, `operation`, `cash_deposited_by_staff`, `amount_paid_to_the_till`, `offload`, `salary`, `operations_cost`, `net_banked`, `deficit`, `performance`, `fuel_revenue_ratio`) VALUES
('2024-05-21', 2, 2, 18000.00, 12000.00, 3500.00, 2000.00, 7000.00, 11000.00, 12500.00, 500.00, 2500.00, 12000.00, 0.00, 1.0000, 0.1944);
-- Transaction 3 (Underperformance)
INSERT INTO `transactions` (`date`, `ambulance_id`, `driver_id`, `total_till`, `target`, `fuel`, `operation`, `cash_deposited_by_staff`, `amount_paid_to_the_till`, `offload`, `salary`, `operations_cost`, `net_banked`, `deficit`, `performance`, `fuel_revenue_ratio`) VALUES
('2024-05-22', 1, 3, 8000.00, 10000.00, 2500.00, 1000.00, 4000.00, 4000.00, 4500.00, 0.00, 1000.00, 4500.00, 5500.00, 0.4500, 0.3125);

-- Link Technicians to Transactions
INSERT INTO `transaction_technicians` (`transaction_id`, `technician_id`) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 1),
(3, 3);
