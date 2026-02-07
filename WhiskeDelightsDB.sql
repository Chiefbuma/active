CREATE DATABASE IF NOT EXISTS WhiskeDelightsDB;

USE WhiskeDelightsDB;

CREATE TABLE `ambulances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(255) NOT NULL,
  `fuel_cost` int NOT NULL,
  `operation_cost` int NOT NULL,
  `target` int NOT NULL,
  `last_driven_by` varchar(255) DEFAULT NULL,
  `last_driven_on` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ambulances` (reg_no, fuel_cost, operation_cost, target, status) VALUES
('KDJ 456A', 5000, 2000, 15000, 'active'),
('KCM 789B', 5500, 2200, 18000, 'active'),
('KDN 123C', 4800, 1900, 14000, 'inactive');

CREATE TABLE `drivers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `drivers` (name, avatarUrl) VALUES
('John Doe', 'https://picsum.photos/seed/driver1/200/200'),
('Peter Jones', 'https://picsum.photos/seed/driver2/200/200'),
('Mary Jane', 'https://picsum.photos/seed/driver3/200/200');

CREATE TABLE `emergency_technicians` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `emergency_technicians` (name, avatarUrl) VALUES
('Susan Smith', 'https://picsum.photos/seed/staff1/200/200'),
('Anne Williams', 'https://picsum.photos/seed/staff2/200/200'),
('Mike Brown', 'https://picsum.photos/seed/staff3/200/200');

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','staff') NOT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (name, email, role, avatarUrl) VALUES
('Admin User', 'admin@example.com', 'admin', 'https://picsum.photos/seed/user1/200/200'),
('Staff User', 'staff@example.com', 'staff', 'https://picsum.photos/seed/user2/200/200');

CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `ambulance_id` int NOT NULL,
  `driver_id` int NOT NULL,
  `total_till` int NOT NULL,
  `target` int NOT NULL,
  `fuel` int NOT NULL,
  `operation` int NOT NULL,
  `cash_deposited_by_staff` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ambulance_id` (`ambulance_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`ambulance_id`) REFERENCES `ambulances` (`id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `transaction_emergency_technicians` (
  `transaction_id` int NOT NULL,
  `emergency_technician_id` int NOT NULL,
  PRIMARY KEY (`transaction_id`,`emergency_technician_id`),
  KEY `emergency_technician_id` (`emergency_technician_id`),
  CONSTRAINT `transaction_emergency_technicians_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transaction_emergency_technicians_ibfk_2` FOREIGN KEY (`emergency_technician_id`) REFERENCES `emergency_technicians` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `transactions` (date, ambulance_id, driver_id, total_till, target, fuel, operation, cash_deposited_by_staff) VALUES
('2024-07-28', 1, 1, 22000, 15000, 5000, 2000, 8500),
('2024-07-28', 2, 2, 17500, 18000, 5500, 2200, 9800),
('2024-07-27', 3, 3, 18000, 14000, 4800, 1900, 7600),
('2024-07-27', 1, 1, 13000, 15000, 5000, 2000, 6000);

INSERT INTO `transaction_emergency_technicians` (transaction_id, emergency_technician_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 2),
(4, 3);
