# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Database Schema

Below is the SQL schema for the application.

```sql
--
-- Table structure for table `corporates`
--

CREATE TABLE `corporates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `wellness_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `corporate_id` (`corporate_id`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`corporate_id`) REFERENCES `corporates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `vitals`
--

CREATE TABLE `vitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `bp_systolic` int DEFAULT NULL,
  `bp_diastolic` int DEFAULT NULL,
  `pulse` int DEFAULT NULL,
  `temp` float DEFAULT NULL,
  `rbs` varchar(255) DEFAULT NULL,
  `measured_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `vitals_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `nutrition`
--

CREATE TABLE `nutrition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `height` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `bmi` float DEFAULT NULL,
  `visceral_fat` float DEFAULT NULL,
  `body_fat_percent` float DEFAULT NULL,
  `notes_nutritionist` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `nutrition_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `discussion` text,
  `goal` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `clinical_reviews`
--

CREATE TABLE `clinical_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `notes_psychologist` text,
  `notes_doctor` text,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `clinical_reviews_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

```

## Seed Data

```sql
--
-- Dumping data for table `corporates`
--

INSERT INTO `corporates` (`id`, `name`, `wellness_date`) VALUES
(1, 'Bio Food Products', '2025-09-29'),
(2, 'Ikomoko', '2025-10-01'),
(3, 'Taria', '2025-10-01');

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `first_name`, `middle_name`, `surname`, `sex`, `dob`, `age`, `phone`, `email`, `corporate_id`, `created_at`) VALUES
(1, 'Sylvester', NULL, 'Musa', 'Male', '1997-01-01', 28, '743955149', 'musasylvester1065@gmail.com', 1, '2025-09-29 13:10:46'),
(2, 'Tom', 'Mbalala', 'Wawire', 'Male', '1970-01-01', 55, '729089363', 'tommbalala@20.com', 1, '2025-09-29 13:10:46'),
(3, 'Euticus', 'Matumbi', 'Muthuri', 'Male', '1991-01-01', 34, '742025594', 'matumbieutychus@gmail.com', NULL, '2025-09-29 13:10:46'),
(4, 'Paul', NULL, 'Ratemo', 'Male', '1985-01-01', 40, '743760460', 'paulratemo84@gmail.com', NULL, '2025-09-29 13:10:46'),
(5, 'Kingsley', NULL, 'Otieno', 'Male', '1976-01-01', 49, '724785997', 'nyakrojala@gmail.com', NULL, '2025-09-29 13:10:46');

--
-- Dumping data for table `vitals`
--

INSERT INTO `vitals` (`patient_id`, `bp_systolic`, `bp_diastolic`, `pulse`, `temp`, `rbs`) VALUES
(1, 114, 73, 58, 36.4, '5.1'),
(2, 150, 99, 62, 36.4, '6.2'),
(3, 133, 81, 70, 36.1, 'NOT SUPPORTED'),
(4, 135, 89, 74, 37, '5.5'),
(5, 171, 118, 76, 37, '5.8');

--
-- Dumping data for table `nutrition`
--

INSERT INTO `nutrition` (`patient_id`, `height`, `weight`, `bmi`, `visceral_fat`, `body_fat_percent`, `notes_nutritionist`) VALUES
(1, 169, 64.8, 23, 2, 10.3, 'normal nutritional status'),
(2, 175, 84, 27, NULL, NULL, NULL),
(3, 169, 81, 28, NULL, NULL, 'ecouraged on excercise'),
(4, 181, 74.8, 23, 6, 18.5, 'encouraged on exercise');

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`patient_id`, `user_id`, `discussion`, `goal`) VALUES
(1, 1, 'Patient wants to improve cardiovascular health and reduce stress.', 'Incorporate 30 minutes of moderate cardio exercise 3 times a week. Practice mindfulness meditation for 10 minutes daily.'),
(2, 1, 'Patient is concerned about his high blood pressure reading and wants to manage it better.', 'Reduce daily sodium intake to under 2,300mg. Monitor blood pressure at home weekly and keep a log.');

--
-- Dumping data for table `clinical_reviews`
--

INSERT INTO `clinical_reviews` (`patient_id`, `user_id`, `notes_doctor`, `notes_psychologist`) VALUES
(1, 1, 'Patient is in good health. Advised on consistent exercise and a balanced diet. Follow up in 6 months.', 'No immediate concerns. Patient seems well-adjusted and motivated.'),
(2, 1, 'Diagnosed with Stage 1 Hypertension. Prescribed Lisinopril 10mg. Advised on lifestyle modifications, particularly diet and exercise. Follow up in 1 month to check BP.', 'Patient is showing signs of anxiety related to his new diagnosis. Provided resources for stress management.');

```
