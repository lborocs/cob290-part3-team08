-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2025 at 09:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `team08`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatmembers`
--

CREATE TABLE `chatmembers` (
  `chat_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatmembers`
--

INSERT INTO `chatmembers` (`chat_id`, `employee_id`, `is_admin`) VALUES
(3, 3, 0),
(5, 4, 1),
(7, 2, 1),
(9, 4, 0),
(9, 5, 1),
(14, 5, 1),
(16, 3, 0),
(16, 5, 1),
(17, 5, 1),
(18, 5, 1),
(19, 5, 1),
(20, 5, 1),
(21, 5, 1),
(22, 5, 1),
(23, 1, 1),
(23, 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `chatmessages`
--

CREATE TABLE `chatmessages` (
  `message_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `message_contents` text DEFAULT NULL,
  `read_receipt` tinyint(1) DEFAULT 0,
  `status` enum('sent','deleted') DEFAULT 'sent',
  `is_edited` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatmessages`
--

INSERT INTO `chatmessages` (`message_id`, `chat_id`, `sender_id`, `date_time`, `message_contents`, `read_receipt`, `status`, `is_edited`) VALUES
(4, 3, 2, '2025-04-21 10:40:39', 'Hello', 1, 'sent', 0),
(5, 3, 2, '2025-04-21 11:54:58', 'Hello1', 1, 'sent', 0),
(6, 3, 3, '2025-04-21 11:55:15', 'Hello', 1, 'sent', 0),
(7, 5, 1, '2025-04-22 11:39:01', 'Hello', 1, 'sent', 0),
(8, 5, 4, '2025-04-22 11:51:49', 'hello', 1, 'sent', 0),
(9, 5, 4, '2025-04-22 12:06:44', 'helllo', 1, 'sent', 0),
(10, 5, 1, '2025-04-22 12:07:09', 'read test', 1, 'sent', 0),
(11, 5, 5, '2025-04-22 12:11:18', 'hello', 1, 'sent', 0),
(12, 5, 1, '2025-04-22 12:52:52', 'hello', 1, 'sent', 0),
(13, 5, 1, '2025-04-22 12:53:31', 'h', 1, 'sent', 0),
(14, 5, 1, '2025-04-22 12:53:31', 'h', 1, 'sent', 0),
(15, 5, 1, '2025-04-22 12:53:32', 'h', 1, 'sent', 0),
(16, 5, 1, '2025-04-22 12:53:32', 'h', 1, 'sent', 0),
(17, 5, 1, '2025-04-22 12:53:32', 'h', 1, 'sent', 0),
(18, 5, 1, '2025-04-22 12:53:32', 'h', 1, 'sent', 0),
(19, 5, 1, '2025-04-22 12:53:33', 'h', 1, 'sent', 0),
(20, 5, 1, '2025-04-22 12:53:33', 'h', 1, 'sent', 0),
(21, 5, 1, '2025-04-22 12:53:33', 'h', 1, 'sent', 0),
(22, 5, 1, '2025-04-22 12:53:33', 'h', 1, 'sent', 0),
(23, 5, 1, '2025-04-22 12:53:34', 'h', 1, 'sent', 0),
(24, 5, 1, '2025-04-22 12:53:34', 'h', 1, 'sent', 0),
(25, 5, 1, '2025-04-22 12:53:34', 'h', 1, 'sent', 0),
(26, 5, 1, '2025-04-22 12:53:34', 'h', 1, 'sent', 0),
(27, 5, 1, '2025-04-22 12:53:34', 'h', 1, 'sent', 0),
(28, 5, 1, '2025-04-22 12:53:35', 'h', 1, 'sent', 0),
(29, 5, 1, '2025-04-22 12:53:35', 'h', 1, 'sent', 0),
(30, 5, 1, '2025-04-22 12:53:35', 'h', 1, 'sent', 0),
(31, 5, 1, '2025-04-22 12:53:35', 'h', 1, 'sent', 0),
(32, 5, 1, '2025-04-22 12:53:35', 'h', 1, 'sent', 0),
(33, 5, 1, '2025-04-22 12:53:36', 'h', 1, 'sent', 0),
(34, 5, 5, '2025-04-22 13:18:28', 'hello', 1, 'sent', 0),
(35, 5, 6, '2025-04-22 14:08:15', 'Hello', 1, 'sent', 0),
(36, 5, 2, '2025-04-22 14:12:44', 'hsllo', 1, 'sent', 0),
(37, 5, 2, '2025-04-22 14:48:13', 'hello', 1, 'sent', 0),
(38, 5, 2, '2025-04-22 14:48:16', 'hey', 1, 'sent', 0),
(39, 5, 2, '2025-04-22 14:48:17', 'poooo', 1, 'sent', 0),
(40, 5, 2, '2025-04-22 14:48:20', 'gggggggggggggggggggggggggggggggggggggg', 1, 'sent', 0),
(41, 7, 1, '2025-05-01 13:21:26', 'Hello', 1, 'sent', 0),
(45, 5, 5, '2025-05-01 14:29:40', 'hello', 1, 'sent', 1),
(46, 5, 5, '2025-05-01 15:10:08', 'ello', 1, 'sent', 1),
(47, 5, 5, '2025-05-01 15:43:28', 'hello', 1, 'sent', 0),
(48, 16, 5, '2025-05-02 10:58:35', 'a', 0, 'sent', 0),
(49, 16, 5, '2025-05-02 10:58:35', 'b', 0, 'sent', 0),
(50, 16, 5, '2025-05-02 10:58:35', 'c', 0, 'sent', 0),
(51, 16, 5, '2025-05-02 10:58:36', 'd', 0, 'sent', 0),
(52, 16, 5, '2025-05-02 10:58:36', 'e', 0, 'sent', 0),
(53, 16, 5, '2025-05-02 10:58:37', 'f', 0, 'sent', 0),
(54, 16, 5, '2025-05-02 10:58:37', 'g', 0, 'sent', 0),
(55, 23, 1, '2025-05-08 14:12:40', 'hello', 1, 'sent', 0);

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `chatID` int(11) NOT NULL,
  `chat_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`chatID`, `chat_name`, `created_at`) VALUES
(3, 'chat1', '2025-04-09 14:14:09'),
(5, 'chat01', '2025-04-21 10:39:41'),
(6, 'chat1', '2025-04-21 12:29:51'),
(7, 'Chat01', '2025-05-01 13:21:09'),
(9, 'g', '2025-05-01 18:03:58'),
(14, 'g', '2025-05-01 18:03:59'),
(16, 'g', '2025-05-01 18:03:59'),
(17, 'g', '2025-05-01 18:04:00'),
(18, 'g', '2025-05-01 18:04:00'),
(19, 'g', '2025-05-01 18:04:00'),
(20, 'g', '2025-05-01 18:04:00'),
(21, 'g', '2025-05-01 18:04:01'),
(22, 'g', '2025-05-01 18:04:01'),
(23, 'test', '2025-05-07 19:24:17');

-- --------------------------------------------------------

--
-- Table structure for table `employeeprojects`
--

CREATE TABLE `employeeprojects` (
  `project_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeeprojects`
--

INSERT INTO `employeeprojects` (`project_id`, `employee_id`) VALUES
(1, 6),
(1, 7),
(1, 12),
(2, 8),
(2, 9),
(2, 13),
(3, 10),
(3, 11),
(3, 14),
(4, 6),
(4, 7),
(5, 8),
(5, 9),
(6, 10),
(6, 11),
(7, 18),
(7, 19),
(8, 18),
(8, 20);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `employee_email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `second_name` varchar(255) NOT NULL,
  `user_type_id` int(11) NOT NULL,
  `current_employee` tinyint(1) NOT NULL,
  `profile_picture_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `employee_email`, `first_name`, `second_name`, `user_type_id`, `current_employee`, `profile_picture_path`) VALUES
(1, 'jakebrooks@makeitall.com', 'Jake', 'Brooks', 0, 1, 'server/pictures/default-profile.jpg'),
(2, 'andreifilipasblai@makeitall.com', 'Andrei', 'Filipas Blai', 0, 1, 'server/pictures/default-profile.jpg'),
(3, 'faizananwar@makeitall.com', 'Faizan', 'Anwar', 0, 1, 'server/pictures/default-profile.jpg'),
(4, 'jevanbucknor@makeitall.com', 'Jevan', 'Bucknor', 0, 1, 'server/pictures/default-profile.jpg'),
(5, 'liamparker@makeitall.com', 'Liam', 'Parker', 0, 1, 'server/pictures/default-profile.jpg'),
(6, 'employee1@makeitall.com', 'Employee1', 'Smith', 2, 1, 'server/pictures/default-profile.jpg'),
(7, 'employee2@makeitall.com', 'Employee2', 'Johnson', 2, 1, 'server/pictures/default-profile.jpg'),
(8, 'employee3@makeitall.com', 'Employee3', 'Davis', 2, 1, 'server/pictures/default-profile.jpg'),
(9, 'employee4@makeitall.com', 'Employee4', 'Miller', 2, 1, 'server/pictures/default-profile.jpg'),
(10, 'employee5@makeitall.com', 'Employee5', 'Wilson', 2, 1, 'server/pictures/default-profile.jpg'),
(11, 'employee6@makeitall.com', 'Employee6', 'Moore', 2, 1, 'server/pictures/default-profile.jpg'),
(12, 'teamlead1@makeitall.com', 'TeamLead1', 'Taylor', 1, 1, 'server/pictures/default-profile.jpg'),
(13, 'teamlead2@makeitall.com', 'TeamLead2', 'Anderson', 1, 1, 'server/pictures/default-profile.jpg'),
(14, 'teamlead3@makeitall.com', 'TeamLead3', 'Thomas', 1, 1, 'server/pictures/default-profile.jpg'),
(16, 'nataliafv@makeitall.com', 'Natalia', 'Figueroa-Vallejo', 0, 1, 'server/pictures/default-profile.jpg'),
(17, 'daniyadesai@makeitall.com', 'Daniya', 'Desai', 0, 1, 'server/pictures/default-profile.jpg'),
(18, 'alice.morgan@makeitall.com', 'Alice', 'Morgan', 2, 1, 'server/pictures/default-profile.jpg'),
(19, 'benjamin.lee@makeitall.com', 'Benjamin', 'Lee', 2, 1, 'server/pictures/default-profile.jpg'),
(20, 'carla.jones@makeitall.com', 'Carla', 'Jones', 2, 1, 'server/pictures/default-profile.jpg'),
(21, 'daniel.kim@makeitall.com', 'Daniel', 'Kim', 1, 1, 'server/pictures/default-profile.jpg'),
(22, 'elena.morris@makeitall.com', 'Elena', 'Morris', 1, 1, 'server/pictures/default-profile.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `employeetasks`
--

CREATE TABLE `employeetasks` (
  `task_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeetasks`
--

INSERT INTO `employeetasks` (`task_id`, `employee_id`) VALUES
(1, 6),
(2, 7),
(3, 8),
(4, 9),
(5, 10),
(6, 11),
(100, 6),
(101, 7),
(102, 8),
(103, 9),
(104, 10),
(105, 11);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `project_name` text NOT NULL,
  `team_leader_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `finish_date` date NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `team_leader_id`, `description`, `start_date`, `finish_date`, `completed`, `completed_date`) VALUES
(1, 'Project Alpha', 12, 'Develop new API features.', '2024-03-01', '2024-06-30', 0, NULL),
(2, 'Project Beta', 13, 'Migrate legacy systems to cloud.', '2024-04-01', '2024-07-15', 0, NULL),
(3, 'Project Gamma', 14, 'Enhance internal security.', '2024-03-15', '2024-08-01', 0, NULL),
(4, 'Project Delta', 12, 'Redesign user onboarding flow.', '2024-05-01', '2024-07-30', 0, NULL),
(5, 'Project Epsilon', 13, 'Integrate third-party payment gateway.', '2024-05-10', '2024-08-15', 0, NULL),
(6, 'Project Zeta', 14, 'Develop internal training portal.', '2024-05-15', '2024-09-01', 0, NULL),
(7, 'Project Theta', 21, 'Automate deployment pipeline.', '2024-05-01', '2024-08-01', 0, NULL),
(8, 'Project Sigma', 22, 'Develop customer feedback system.', '2024-05-10', '2024-09-01', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `task_name` text NOT NULL,
  `assigned_employee` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `finish_date` date NOT NULL,
  `time_allocated` int(11) DEFAULT NULL,
  `time_taken` int(11) DEFAULT NULL,
  `priority` int(11) NOT NULL CHECK (`priority` between 1 and 5),
  `difficulty` int(11) NOT NULL CHECK (`priority` between 1 and 5),
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `task_name`, `assigned_employee`, `project_id`, `description`, `start_date`, `finish_date`, `time_allocated`, `time_taken`, `priority`, `difficulty`, `completed`, `completed_date`) VALUES
(1, 'API Endpoint Creation', 6, 1, 'Build new API endpoints for user data.', '2024-03-05', '2024-04-10', 40, NULL, 3, 3, 0, NULL),
(2, 'Unit Testing', 7, 1, 'Write unit tests for the new endpoints.', '2024-03-10', '2024-04-20', 35, NULL, 2, 2, 0, NULL),
(3, 'Cloud Migration Analysis', 8, 2, 'Analyze legacy system readiness.', '2024-04-05', '2024-05-15', 50, NULL, 4, 4, 0, NULL),
(4, 'Data Migration Script', 9, 2, 'Create scripts for migrating data.', '2024-04-10', '2024-06-01', 45, NULL, 3, 4, 0, NULL),
(5, 'Security Audit', 10, 3, 'Perform a security audit.', '2024-03-20', '2024-05-10', 55, NULL, 4, 5, 0, NULL),
(6, 'Implement Encryption', 11, 3, 'Add end-to-end encryption.', '2024-04-01', '2024-06-15', 60, NULL, 5, 5, 0, NULL),
(7, 'Refactor Codebase', 6, 1, 'Improve code readability and structure.', '2024-04-12', '2024-05-01', 30, 32, 2, 3, 1, '2024-05-03 00:00:00'),
(8, 'Performance Benchmarking', 7, 1, 'Measure and log API response times.', '2024-04-15', '2024-05-05', 25, 20, 3, 2, 1, '2024-05-04 00:00:00'),
(9, 'Legacy System Cleanup', 8, 2, 'Remove deprecated components.', '2024-04-20', '2024-05-20', 20, NULL, 2, 3, 0, NULL),
(10, 'Database Optimization', 9, 2, 'Optimize SQL queries and indexes.', '2024-04-25', '2024-06-10', 40, NULL, 4, 4, 0, NULL),
(11, 'Penetration Testing', 10, 3, 'Simulate attacks to identify vulnerabilities.', '2024-05-01', '2024-06-15', 50, 60, 5, 5, 1, '2024-06-20 00:00:00'),
(12, 'Encryption Key Rotation', 11, 3, 'Implement regular key rotation policy.', '2024-05-05', '2024-06-20', 35, 33, 4, 4, 1, '2024-06-18 00:00:00'),
(13, 'Bug Fixing Sprint', 6, 1, 'Address reported issues from QA.', '2024-05-10', '2024-05-25', 28, NULL, 3, 3, 0, NULL),
(14, 'API Documentation', 7, 1, 'Write and publish API usage guide.', '2024-05-12', '2024-06-01', 22, 24, 2, 2, 1, '2024-06-03 00:00:00'),
(15, 'Access Control Review', 10, 3, 'Audit user role permissions.', '2024-05-15', '2024-06-05', 30, NULL, 3, 4, 0, NULL),
(16, 'Failover Testing', 9, 2, 'Test backup and disaster recovery.', '2024-05-18', '2024-06-10', 38, 40, 4, 4, 1, '2024-06-12 00:00:00'),
(17, 'Task 17', 6, 1, 'Description for Task 17', '2024-04-20', '2024-05-14', 20, NULL, 3, 3, 0, NULL),
(18, 'Task 18', 6, 1, 'Description for Task 18', '2024-04-27', '2024-05-21', 48, NULL, 5, 4, 0, NULL),
(19, 'Task 19', 6, 1, 'Description for Task 19', '2024-04-03', '2024-04-23', 47, NULL, 4, 3, 0, NULL),
(20, 'Task 20', 7, 1, 'Description for Task 20', '2024-04-17', '2024-05-10', 51, NULL, 4, 4, 0, NULL),
(21, 'Task 21', 7, 1, 'Description for Task 21', '2024-04-05', '2024-04-28', 37, NULL, 4, 3, 0, NULL),
(22, 'Task 22', 7, 1, 'Description for Task 22', '2024-04-02', '2024-04-30', 60, 57, 4, 4, 1, '2024-04-30 00:00:00'),
(23, 'Task 23', 8, 2, 'Description for Task 23', '2024-04-24', '2024-05-12', 43, NULL, 3, 3, 0, NULL),
(24, 'Task 24', 8, 2, 'Description for Task 24', '2024-04-18', '2024-05-05', 50, 50, 5, 4, 1, '2024-05-05 00:00:00'),
(25, 'Task 25', 8, 2, 'Description for Task 25', '2024-04-13', '2024-04-25', 39, 33, 3, 3, 1, '2024-04-28 00:00:00'),
(26, 'Task 26', 9, 2, 'Description for Task 26', '2024-05-01', '2024-05-11', 33, NULL, 3, 4, 0, NULL),
(27, 'Task 27', 9, 2, 'Description for Task 27', '2024-04-03', '2024-04-20', 57, NULL, 2, 5, 0, NULL),
(28, 'Task 28', 9, 2, 'Description for Task 28', '2024-04-29', '2024-05-27', 22, NULL, 2, 2, 0, NULL),
(29, 'Task 29', 10, 3, 'Description for Task 29', '2024-04-05', '2024-04-28', 34, 46, 2, 4, 1, '2024-04-28 00:00:00'),
(30, 'Task 30', 10, 3, 'Description for Task 30', '2024-04-10', '2024-05-05', 60, 73, 3, 2, 1, '2024-05-08 00:00:00'),
(31, 'Task 31', 10, 3, 'Description for Task 31', '2024-04-09', '2024-05-07', 60, 52, 4, 2, 1, '2024-05-09 00:00:00'),
(32, 'Task 32', 11, 3, 'Description for Task 32', '2024-04-17', '2024-05-07', 41, 35, 2, 2, 1, '2024-05-08 00:00:00'),
(33, 'Task 33', 11, 3, 'Description for Task 33', '2024-04-21', '2024-05-21', 28, NULL, 2, 5, 0, NULL),
(34, 'Task 34', 11, 3, 'Description for Task 34', '2024-04-05', '2024-04-17', 33, NULL, 2, 5, 0, NULL),
(100, 'Wireframe Redesign', 6, 4, 'Create wireframes for new onboarding UI.', '2024-05-02', '2024-05-20', 20, NULL, 3, 2, 0, NULL),
(101, 'User Journey Mapping', 7, 4, 'Map out key user touchpoints.', '2024-05-03', '2024-05-18', 18, NULL, 2, 2, 0, NULL),
(102, 'API Integration', 8, 5, 'Integrate payment gateway APIs.', '2024-05-12', '2024-06-10', 25, NULL, 4, 4, 0, NULL),
(103, 'Security Review', 9, 5, 'Perform security audit on payment flow.', '2024-05-14', '2024-06-15', 30, NULL, 4, 5, 0, NULL),
(104, 'Content Upload System', 10, 6, 'Build CMS for uploading training videos.', '2024-05-16', '2024-06-20', 35, NULL, 3, 3, 0, NULL),
(105, 'Quiz Module', 11, 6, 'Develop quiz/test component.', '2024-05-18', '2024-06-30', 28, NULL, 4, 4, 0, NULL),
(106, 'Containerize Microservices', 18, 7, 'Dockerize all backend services.', '2024-05-01', '2024-05-12', 30, 28, 4, 4, 1, '2024-05-10 00:00:00'),
(107, 'Pipeline Setup', 18, 7, 'CI/CD using GitHub Actions.', '2024-05-02', '2024-05-15', 35, NULL, 3, 3, 0, NULL),
(108, 'Code Coverage Report', 19, 7, 'Generate and analyze coverage reports.', '2024-05-03', '2024-05-17', 25, 24, 3, 2, 1, '2024-05-16 00:00:00'),
(109, 'Deploy to Staging', 19, 7, 'Push pipeline to staging environment.', '2024-05-05', '2024-05-20', 20, NULL, 2, 3, 0, NULL),
(110, 'Feedback Form UI', 20, 8, 'Create intuitive feedback form.', '2024-05-10', '2024-05-25', 40, 36, 4, 2, 1, '2024-05-23 00:00:00'),
(111, 'Backend Integration', 20, 8, 'Send feedback to backend service.', '2024-05-11', '2024-05-30', 45, NULL, 3, 4, 0, NULL),
(112, 'Data Visualization', 18, 8, 'Display feedback with charts.', '2024-05-12', '2024-06-01', 50, NULL, 5, 3, 0, NULL),
(113, 'Validation Logic', 18, 8, 'Ensure correct input formats.', '2024-05-13', '2024-05-28', 30, 31, 2, 2, 1, '2024-05-27 00:00:00'),
(114, 'Security Review', 19, 8, 'Review for XSS/CSRF vulnerabilities.', '2024-05-14', '2024-06-03', 28, NULL, 4, 5, 0, NULL),
(115, 'Accessibility Improvements', 20, 8, 'Comply with WCAG 2.1 standards.', '2024-05-15', '2024-06-05', 22, 20, 3, 2, 1, '2024-06-04 00:00:00'),
(116, 'User Onboarding Flow', 18, 7, 'Simplify first-time user flow.', '2024-05-16', '2024-05-29', 38, 40, 3, 4, 1, '2024-05-30 00:00:00'),
(117, 'Error Logging System', 19, 7, 'Implement centralized logging.', '2024-05-17', '2024-06-01', 32, NULL, 2, 3, 0, NULL),
(118, 'Front-end Bug Fixes', 20, 1, 'Resolve UI glitches reported by QA.', '2024-05-05', '2024-05-15', 10, NULL, 2, 2, 0, NULL),
(119, 'Login Feature Enhancement', 20, 1, 'Improve login validation and error messages.', '2024-04-10', '2024-04-25', 15, 14, 3, 3, 1, '2024-04-24 00:00:00'),
(120, 'Mobile Responsiveness Audit', 20, 1, 'Audit pages for responsiveness issues.', '2024-03-20', '2024-04-05', 20, 25, 4, 4, 1, '2024-04-10 00:00:00'),
(121, 'Database Indexing', 6, 1, 'Optimize database indexes for faster queries.', '2025-05-08', '2025-05-18', 40, 38, 3, 3, 1, '2025-05-10 00:00:00'),
(122, 'Refactor SQL Queries', 6, 1, 'Refactor inefficient SQL queries to improve performance.', '2025-05-09', '2025-05-19', 35, NULL, 2, 3, 0, NULL),
(123, 'API Rate Limiting', 7, 1, 'Implement rate limiting to prevent abuse of API endpoints.', '2025-05-08', '2025-05-18', 45, NULL, 4, 4, 0, NULL),
(124, 'API Documentation Update', 7, 1, 'Update API documentation with new endpoints.', '2025-05-08', '2025-05-18', 30, 25, 3, 2, 1, '2025-05-12 00:00:00'),
(125, 'Legacy System Testing', 8, 2, 'Test legacy system to check compatibility with cloud migration.', '2025-05-08', '2025-05-18', 50, 55, 5, 4, 0, NULL),
(126, 'Cloud Data Migration', 8, 2, 'Migrate data to cloud storage.', '2025-05-09', '2025-05-19', 40, NULL, 3, 4, 1, '2025-05-15 00:00:00'),
(127, 'Script Testing', 9, 2, 'Test data migration scripts for correctness.', '2025-05-09', '2025-05-19', 40, 42, 2, 3, 1, '2025-05-13 00:00:00'),
(128, 'Cloud Storage Configuration', 9, 2, 'Configure cloud storage for new data types.', '2025-05-08', '2025-05-18', 30, NULL, 3, 4, 0, NULL),
(129, 'Security Vulnerability Scanning', 10, 3, 'Perform vulnerability scans on cloud services.', '2025-05-08', '2025-05-18', 55, 58, 4, 5, 1, '2025-05-10 00:00:00'),
(130, 'Security Audit Documentation', 10, 3, 'Document the results of security audit.', '2025-05-09', '2025-05-19', 40, 35, 3, 4, 0, NULL),
(131, 'Risk Assessment for Cloud Migration', 11, 3, 'Evaluate potential risks involved in migrating to the cloud.', '2025-05-08', '2025-05-18', 45, NULL, 3, 4, 0, NULL),
(132, 'Data Encryption Testing', 11, 3, 'Test data encryption procedures.', '2025-05-08', '2025-05-18', 50, 52, 4, 5, 1, '2025-05-12 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tasktags`
--

CREATE TABLE `tasktags` (
  `task_id` int(11) NOT NULL,
  `tag` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usertypes`
--

CREATE TABLE `usertypes` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usertypes`
--

INSERT INTO `usertypes` (`type_id`, `type_name`) VALUES
(2, 'Employee'),
(0, 'Manager'),
(1, 'ProjectLead');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatmembers`
--
ALTER TABLE `chatmembers`
  ADD PRIMARY KEY (`chat_id`,`employee_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `chatmessages`
--
ALTER TABLE `chatmessages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`chatID`);

--
-- Indexes for table `employeeprojects`
--
ALTER TABLE `employeeprojects`
  ADD PRIMARY KEY (`project_id`,`employee_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `employee_email` (`employee_email`),
  ADD KEY `user_type_id` (`user_type_id`);

--
-- Indexes for table `employeetasks`
--
ALTER TABLE `employeetasks`
  ADD PRIMARY KEY (`task_id`,`employee_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `team_leader_id` (`team_leader_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_employee` (`assigned_employee`);

--
-- Indexes for table `tasktags`
--
ALTER TABLE `tasktags`
  ADD PRIMARY KEY (`task_id`,`tag`),
  ADD KEY `tag` (`tag`);

--
-- Indexes for table `usertypes`
--
ALTER TABLE `usertypes`
  ADD PRIMARY KEY (`type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatmessages`
--
ALTER TABLE `chatmessages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `chatID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatmembers`
--
ALTER TABLE `chatmembers`
  ADD CONSTRAINT `chatmembers_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chatID`) ON DELETE CASCADE,
  ADD CONSTRAINT `chatmembers_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `chatmessages`
--
ALTER TABLE `chatmessages`
  ADD CONSTRAINT `chatmessages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chatID`) ON DELETE CASCADE,
  ADD CONSTRAINT `chatmessages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `employeeprojects`
--
ALTER TABLE `employeeprojects`
  ADD CONSTRAINT `employeeprojects_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `employeeprojects_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_type_id`) REFERENCES `usertypes` (`type_id`);

--
-- Constraints for table `employeetasks`
--
ALTER TABLE `employeetasks`
  ADD CONSTRAINT `employeetasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`),
  ADD CONSTRAINT `employeetasks_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`team_leader_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_employee`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `tasktags`
--
ALTER TABLE `tasktags`
  ADD CONSTRAINT `tasktags_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`),
  ADD CONSTRAINT `tasktags_ibfk_2` FOREIGN KEY (`tag`) REFERENCES `tags` (`tag`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
