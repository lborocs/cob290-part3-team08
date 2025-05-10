-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2025 at 05:55 PM
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
(24, 1, 0),
(24, 17, 1);

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
(56, 24, 17, '2025-05-10 14:42:59', 'hello1', 0, 'sent', 1);

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
(24, 'test', '2025-05-10 14:42:44');

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
(6, 1),
(6, 6),
(6, 7),
(6, 12),
(6, 16),
(7, 2),
(7, 3),
(7, 8),
(7, 9),
(7, 14),
(8, 4),
(8, 5),
(8, 10),
(8, 11),
(8, 15);

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
(1, 'employee1@makeitall.com', 'Employee1', 'Smith', 2, 1, 'server/pictures/default-profile.jpg'),
(2, 'employee2@makeitall.com', 'Employee2', 'Johnson', 2, 1, 'server/pictures/default-profile.jpg'),
(3, 'employee3@makeitall.com', 'Employee3', 'Davis', 2, 1, 'server/pictures/default-profile.jpg'),
(4, 'employee4@makeitall.com', 'Employee4', 'Miller', 2, 1, 'server/pictures/default-profile.jpg'),
(5, 'employee5@makeitall.com', 'Employee5', 'Wilson', 2, 1, 'server/pictures/default-profile.jpg'),
(6, 'employee6@makeitall.com', 'Employee6', 'Moore', 2, 1, 'server/pictures/default-profile.jpg'),
(7, 'employee7@makeitall.com', 'Employee7', 'Taylor', 2, 1, 'server/pictures/default-profile.jpg'),
(8, 'employee8@makeitall.com', 'Employee8', 'Anderson', 2, 1, 'server/pictures/default-profile.jpg'),
(9, 'employee9@makeitall.com', 'Employee9', 'Thomas', 2, 1, 'server/pictures/default-profile.jpg'),
(10, 'employee10@makeitall.com', 'Employee10', 'Jackson', 2, 1, 'server/pictures/default-profile.jpg'),
(11, 'employee11@makeitall.com', 'Employee11', 'White', 2, 1, 'server/pictures/default-profile.jpg'),
(12, 'employee12@makeitall.com', 'Employee12', 'Lee', 2, 1, 'server/pictures/default-profile.jpg'),
(14, 'teamlead1@makeitall.com', 'TeamLead1', 'Taylor', 1, 1, 'server/pictures/default-profile.jpg'),
(15, 'teamlead2@makeitall.com', 'TeamLead2', 'Anderson', 1, 1, 'server/pictures/default-profile.jpg'),
(16, 'teamlead3@makeitall.com', 'TeamLead3', 'Thomas', 1, 1, 'server/pictures/default-profile.jpg'),
(17, 'jakebrooks@makeitall.com', 'Jake', 'Brooks', 0, 1, 'server/pictures/default-profile.jpg'),
(18, 'andreifilipasblai@makeitall.com', 'Andrei', 'Filipas Blai', 0, 1, 'server/pictures/default-profile.jpg'),
(19, 'faizananwar@makeitall.com', 'Faizan', 'Anwar', 0, 1, 'server/pictures/default-profile.jpg'),
(20, 'jevanbucknor@makeitall.com', 'Jevan', 'Bucknor', 0, 1, 'server/pictures/default-profile.jpg'),
(21, 'liamparker@makeitall.com', 'Liam', 'Parker', 0, 1, 'server/pictures/default-profile.jpg'),
(22, 'nataliafv@makeitall.com', 'Natalia', 'Figueroa-Vallejo', 0, 1, 'server/pictures/default-profile.jpg'),
(23, 'daniyadesai@makeitall.com', 'Daniya', 'Desai', 0, 1, 'server/pictures/default-profile.jpg');

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
(138, 12),
(139, 12),
(140, 12),
(141, 12),
(142, 12),
(143, 1),
(144, 1),
(145, 1),
(146, 1),
(147, 1),
(148, 2),
(149, 2),
(150, 2),
(151, 2),
(152, 2),
(153, 3),
(154, 3),
(155, 3),
(156, 3),
(157, 3),
(158, 4),
(159, 4),
(160, 4),
(161, 4),
(162, 4),
(163, 5),
(164, 5),
(165, 5),
(166, 5),
(167, 5),
(168, 6),
(169, 6),
(170, 6),
(171, 6),
(172, 6),
(173, 7),
(174, 7),
(175, 7),
(176, 7),
(177, 7),
(178, 8),
(179, 8),
(180, 8),
(181, 8),
(182, 8),
(183, 9),
(184, 9),
(185, 9),
(186, 9),
(187, 9),
(188, 10),
(189, 10),
(190, 10),
(191, 10),
(192, 10),
(193, 11),
(194, 11),
(195, 11),
(196, 11),
(197, 11);

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
(6, 'Project Alpha', 16, 'Develop new API features.', '2025-04-05', '2025-06-30', 0, NULL),
(7, 'Project Gamma', 14, 'Enhance internal security.', '2025-03-15', '2025-08-01', 0, NULL),
(8, 'Project Beta', 15, 'Migrate legacy systems to cloud.', '2025-04-01', '2025-07-15', 0, NULL);

--
-- Triggers `projects`
--
DELIMITER $$
CREATE TRIGGER `after_project_insert` AFTER INSERT ON `projects` FOR EACH ROW BEGIN
    -- Insert into EmployeeProjects when a new task is created
    INSERT INTO EmployeeProjects (project_id, employee_id)
    SELECT NEW.project_id, NEW.team_leader_id
    WHERE NOT EXISTS (
        SELECT 1 FROM EmployeeProjects
        WHERE project_id = NEW.project_id
        AND employee_id = NEW.team_leader_id
    );
END
$$
DELIMITER ;

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
(138, 'Task 1 for Employee 12', 12, 6, 'Task description 1', '2025-04-05', '2025-05-16', 40, 22, 3, 3, 0, NULL),
(139, 'Task 2 for Employee 12', 12, 6, 'Task description 2', '2025-04-16', '2025-04-25', 35, 34, 2, 2, 0, NULL),
(140, 'Task 3 for Employee 12', 12, 6, 'Task description 3', '2025-05-01', '2025-05-19', 40, 42, 4, 4, 0, NULL),
(141, 'Task 4 for Employee 12', 12, 6, 'Task description 4', '2025-05-20', '2025-06-01', 45, 45, 3, 3, 0, NULL),
(142, 'Task 5 for Employee 12', 12, 6, 'Task description 5', '2025-06-05', '2025-06-15', 50, 50, 2, 2, 1, '2025-06-10 00:00:00'),
(143, 'Task 1 for Employee 1', 1, 6, 'Task description 1', '2025-04-06', '2025-04-16', 40, 38, 3, 3, 1, '2025-04-12 00:00:00'),
(144, 'Task 2 for Employee 1', 1, 6, 'Task description 2', '2025-04-17', '2025-04-26', 35, 34, 2, 2, 0, NULL),
(145, 'Task 3 for Employee 1', 1, 6, 'Task description 3', '2025-05-02', '2025-05-16', 40, 42, 4, 4, 1, '2025-05-13 00:00:00'),
(146, 'Task 4 for Employee 1', 1, 6, 'Task description 4', '2025-05-22', '2025-06-03', 45, 45, 3, 3, 0, NULL),
(147, 'Task 5 for Employee 1', 1, 6, 'Task description 5', '2025-06-07', '2025-06-17', 50, 50, 2, 2, 1, '2025-06-13 00:00:00'),
(148, 'Task 1 for Employee 2', 2, 7, 'Task description 1', '2025-03-15', '2025-03-25', 40, 38, 3, 3, 1, '2025-03-20 00:00:00'),
(149, 'Task 2 for Employee 2', 2, 7, 'Task description 2', '2025-03-26', '2025-04-05', 35, 34, 2, 2, 0, NULL),
(150, 'Task 3 for Employee 2', 2, 7, 'Task description 3', '2025-04-10', '2025-04-29', 40, 60, 4, 4, 1, '2025-05-02 00:00:00'),
(151, 'Task 4 for Employee 2', 2, 7, 'Task description 4', '2025-04-22', '2025-05-02', 45, 45, 3, 3, 0, NULL),
(152, 'Task 5 for Employee 2', 2, 7, 'Task description 5', '2025-05-05', '2025-05-15', 50, 50, 2, 2, 1, '2025-05-12 00:00:00'),
(153, 'Task 1 for Employee 3', 3, 7, 'Task description 1', '2025-03-16', '2025-03-26', 40, 38, 3, 3, 1, '2025-03-22 00:00:00'),
(154, 'Task 2 for Employee 3', 3, 7, 'Task description 2', '2025-03-27', '2025-04-06', 35, 34, 2, 2, 0, NULL),
(155, 'Task 3 for Employee 3', 3, 7, 'Task description 3', '2025-04-11', '2025-04-21', 40, 42, 4, 4, 1, '2025-04-17 00:00:00'),
(156, 'Task 4 for Employee 3', 3, 7, 'Task description 4', '2025-04-23', '2025-05-03', 45, 45, 3, 3, 0, NULL),
(157, 'Task 5 for Employee 3', 3, 7, 'Task description 5', '2025-05-06', '2025-05-16', 50, 50, 2, 2, 1, '2025-05-12 00:00:00'),
(158, 'Task 1 for Employee 4', 4, 8, 'Task description 1', '2025-04-01', '2025-04-10', 40, 38, 3, 3, 1, '2025-04-05 00:00:00'),
(159, 'Task 2 for Employee 4', 4, 8, 'Task description 2', '2025-04-11', '2025-04-20', 35, 34, 2, 2, 0, NULL),
(160, 'Task 3 for Employee 4', 4, 8, 'Task description 3', '2025-04-22', '2025-05-02', 40, 42, 4, 4, 1, '2025-04-30 00:00:00'),
(161, 'Task 4 for Employee 4', 4, 8, 'Task description 4', '2025-05-03', '2025-05-13', 45, 45, 3, 3, 0, NULL),
(162, 'Task 5 for Employee 4', 4, 8, 'Task description 5', '2025-05-15', '2025-05-25', 50, 50, 2, 2, 1, '2025-05-20 00:00:00'),
(163, 'Task 1 for Employee 5', 5, 8, 'Task description 1', '2025-04-02', '2025-04-12', 40, 38, 3, 3, 1, '2025-04-07 00:00:00'),
(164, 'Task 2 for Employee 5', 5, 8, 'Task description 2', '2025-04-13', '2025-04-22', 35, 34, 2, 2, 0, NULL),
(165, 'Task 3 for Employee 5', 5, 8, 'Task description 3', '2025-04-25', '2025-05-05', 40, 42, 4, 4, 1, '2025-04-30 00:00:00'),
(166, 'Task 4 for Employee 5', 5, 8, 'Task description 4', '2025-05-06', '2025-05-16', 45, 45, 3, 3, 0, NULL),
(167, 'Task 5 for Employee 5', 5, 8, 'Task description 5', '2025-05-18', '2025-05-28', 50, 50, 2, 2, 1, '2025-05-23 00:00:00'),
(168, 'Task 1 for Employee 6', 6, 6, 'Task description 1', '2025-04-05', '2025-04-15', 40, 38, 3, 3, 1, '2025-04-10 00:00:00'),
(169, 'Task 2 for Employee 6', 6, 6, 'Task description 2', '2025-04-16', '2025-04-25', 35, 34, 2, 2, 0, NULL),
(170, 'Task 3 for Employee 6', 6, 6, 'Task description 3', '2025-05-01', '2025-05-15', 40, 42, 4, 4, 1, '2025-05-10 00:00:00'),
(171, 'Task 4 for Employee 6', 6, 6, 'Task description 4', '2025-05-20', '2025-06-01', 45, 45, 3, 3, 0, NULL),
(172, 'Task 5 for Employee 6', 6, 6, 'Task description 5', '2025-06-05', '2025-06-15', 50, 50, 2, 2, 1, '2025-06-10 00:00:00'),
(173, 'Task 1 for Employee 7', 7, 6, 'Task description 1', '2025-04-06', '2025-04-16', 40, 38, 3, 3, 1, '2025-04-12 00:00:00'),
(174, 'Task 2 for Employee 7', 7, 6, 'Task description 2', '2025-04-17', '2025-04-26', 35, 34, 2, 2, 0, NULL),
(175, 'Task 3 for Employee 7', 7, 6, 'Task description 3', '2025-05-02', '2025-05-16', 40, 42, 4, 4, 1, '2025-05-13 00:00:00'),
(176, 'Task 4 for Employee 7', 7, 6, 'Task description 4', '2025-05-22', '2025-06-03', 45, 45, 3, 3, 0, NULL),
(177, 'Task 5 for Employee 7', 7, 6, 'Task description 5', '2025-06-07', '2025-06-17', 50, 50, 2, 2, 1, '2025-06-13 00:00:00'),
(178, 'Task 1 for Employee 8', 8, 7, 'Task description 1', '2025-03-15', '2025-03-25', 40, 38, 3, 3, 1, '2025-03-20 00:00:00'),
(179, 'Task 2 for Employee 8', 8, 7, 'Task description 2', '2025-03-26', '2025-04-05', 35, 34, 2, 2, 0, NULL),
(180, 'Task 3 for Employee 8', 8, 7, 'Task description 3', '2025-04-10', '2025-04-20', 40, 50, 4, 4, 0, NULL),
(181, 'Task 4 for Employee 8', 8, 7, 'Task description 4', '2025-04-22', '2025-05-02', 45, 45, 3, 3, 0, NULL),
(182, 'Task 5 for Employee 8', 8, 7, 'Task description 5', '2025-05-05', '2025-05-15', 50, 32, 2, 2, 0, NULL),
(183, 'Task 1 for Employee 9', 9, 7, 'Task description 1', '2025-03-16', '2025-03-26', 40, 38, 3, 3, 1, '2025-03-22 00:00:00'),
(184, 'Task 2 for Employee 9', 9, 7, 'Task description 2', '2025-03-27', '2025-04-06', 35, 34, 2, 2, 0, NULL),
(185, 'Task 3 for Employee 9', 9, 7, 'Task description 3', '2025-04-11', '2025-04-21', 40, 42, 4, 4, 1, '2025-04-17 00:00:00'),
(186, 'Task 4 for Employee 9', 9, 7, 'Task description 4', '2025-04-23', '2025-05-03', 45, 45, 3, 3, 0, NULL),
(187, 'Task 5 for Employee 9', 9, 7, 'Task description 5', '2025-05-06', '2025-05-16', 50, 50, 2, 2, 1, '2025-05-12 00:00:00'),
(188, 'Task 1 for Employee 10', 10, 8, 'Task description 1', '2025-04-01', '2025-04-10', 40, 38, 3, 3, 1, '2025-04-05 00:00:00'),
(189, 'Task 2 for Employee 10', 10, 8, 'Task description 2', '2025-04-11', '2025-04-20', 35, 34, 2, 2, 0, NULL),
(190, 'Task 3 for Employee 10', 10, 8, 'Task description 3', '2025-04-22', '2025-05-15', 40, 0, 4, 4, 0, NULL),
(191, 'Task 4 for Employee 10', 10, 8, 'Task description 4', '2025-05-03', '2025-05-13', 45, 45, 3, 3, 0, NULL),
(192, 'Task 5 for Employee 10', 10, 8, 'Task description 5', '2025-05-15', '2025-05-25', 50, 50, 2, 2, 1, '2025-05-20 00:00:00'),
(193, 'Task 1 for Employee 11', 11, 8, 'Task description 1', '2025-04-02', '2025-04-12', 40, 38, 3, 3, 1, '2025-04-07 00:00:00'),
(194, 'Task 2 for Employee 11', 11, 8, 'Task description 2', '2025-04-13', '2025-04-22', 35, 34, 2, 2, 0, NULL),
(195, 'Task 3 for Employee 11', 11, 8, 'Task description 3', '2025-04-25', '2025-05-05', 40, 42, 4, 4, 1, '2025-04-30 00:00:00'),
(196, 'Task 4 for Employee 11', 11, 8, 'Task description 4', '2025-05-06', '2025-05-16', 45, 45, 3, 3, 0, NULL),
(197, 'Task 5 for Employee 11', 11, 8, 'Task description 5', '2025-05-18', '2025-05-28', 50, 50, 2, 2, 0, NULL);

--
-- Triggers `tasks`
--
DELIMITER $$
CREATE TRIGGER `after_task_insert` AFTER INSERT ON `tasks` FOR EACH ROW BEGIN
    -- Insert into EmployeeProjects if the employee-project relationship doesn't exist already
    INSERT INTO EmployeeProjects (project_id, employee_id)
    SELECT NEW.project_id, NEW.assigned_employee
    WHERE NOT EXISTS (
        SELECT 1 FROM EmployeeProjects
        WHERE project_id = NEW.project_id
        AND employee_id = NEW.assigned_employee
    );
    
    -- Insert into EmployeeTasks, without checking for duplicates (assuming unique task-employee relationships)
    INSERT INTO EmployeeTasks (task_id, employee_id)
    VALUES (NEW.task_id, NEW.assigned_employee);
END
$$
DELIMITER ;

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
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `chatID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

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
