
-- Employee Tables

-- UserTypes Table (Referenced by Employees)
CREATE TABLE IF NOT EXISTS UserTypes (
    type_id INTEGER PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Insert default user types
INSERT IGNORE INTO UserTypes (type_id, type_name) VALUES
    (0, 'Manager'),
    (1, 'ProjectLead'),
    (2, 'Employee');

-- Employees Table (References UserTypes)
CREATE TABLE IF NOT EXISTS Employees (
    employee_id INTEGER PRIMARY KEY,
    employee_email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    second_name VARCHAR(255) NOT NULL,
    user_type_id INTEGER NOT NULL,
    current_employee BOOLEAN NOT NULL,
    profile_picture_path VARCHAR(255) DEFAULT 'server/pictures/default-profile.jpg',
    FOREIGN KEY (user_type_id) REFERENCES UserTypes(type_id)
) ENGINE=InnoDB;

-- Employee dummy data (AI generated)
INSERT IGNORE INTO Employees VALUES 
    (1, "jakebrooks@makeitall.com", "Jake", "Brooks", 0, 1, 'server/pictures/default-profile.jpg'),
    (2, "andreifilipasblai@makeitall.com", "Andrei", "Filipas Blai", 0, 1, 'server/pictures/default-profile.jpg'),
    (3, "faizananwar@makeitall.com", "Faizan", "Anwar", 0, 1, 'server/pictures/default-profile.jpg'),
    (4, "jevanbucknor@makeitall.com", "Jevan", "Bucknor", 0, 1, 'server/pictures/default-profile.jpg'),
    (5, "liamparker@makeitall.com", "Liam", "Parker", 0, 1, 'server/pictures/default-profile.jpg'),
    (6, "employee1@makeitall.com", "Employee1", "Smith", 2, 1, 'server/pictures/default-profile.jpg'),
    (7, "employee2@makeitall.com", "Employee2", "Johnson", 2, 1, 'server/pictures/default-profile.jpg'),
    (8, "employee3@makeitall.com", "Employee3", "Davis", 2, 1, 'server/pictures/default-profile.jpg'),
    (9, "employee4@makeitall.com", "Employee4", "Miller", 2, 1, 'server/pictures/default-profile.jpg'),
    (10, "employee5@makeitall.com", "Employee5", "Wilson", 2, 1, 'server/pictures/default-profile.jpg'),
    (11, "employee6@makeitall.com", "Employee6", "Moore", 2, 1, 'server/pictures/default-profile.jpg'),
    (12, "teamlead1@makeitall.com", "TeamLead1", "Taylor", 1, 1, 'server/pictures/default-profile.jpg'),
    (13, "teamlead2@makeitall.com", "TeamLead2", "Anderson", 1, 1, 'server/pictures/default-profile.jpg'),
    (14, "teamlead3@makeitall.com", "TeamLead3", "Thomas", 1, 1, 'server/pictures/default-profile.jpg'),
    (16, 'nataliafv@makeitall.com', 'Natalia', 'Figueroa-Vallejo', 0, 1, 'server/pictures/default-profile.jpg'),
    (17, 'daniyadesai@makeitall.com', 'Daniya', 'Desai', 0, 1, 'server/pictures/default-profile.jpg');


-- Data Analytics Tables

-- Projects Table (References Employees)
CREATE TABLE IF NOT EXISTS Projects (
    project_id INTEGER PRIMARY KEY,
    project_name TEXT NOT NULL,
    team_leader_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    finish_date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    completed_date DATETIME,
    FOREIGN KEY (team_leader_id) REFERENCES Employees(employee_id)
) ENGINE=InnoDB;

-- Tasks Table (References Projects and Employees)
CREATE TABLE IF NOT EXISTS Tasks (
    task_id INTEGER PRIMARY KEY,
    task_name TEXT NOT NULL,
    assigned_employee INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    finish_date DATE NOT NULL,
    time_allocated INT,
    time_taken INT,
    priority INT NOT NULL CHECK (priority BETWEEN 1 AND 5),
    difficulty INT NOT NULL CHECK (priority BETWEEN 1 AND 5),
    completed BOOLEAN NOT NULL DEFAULT 0,
    completed_date DATETIME,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (assigned_employee) REFERENCES Employees(employee_id)
) ENGINE=InnoDB;

-- Tags Table (Referenced by TaskTags)
CREATE TABLE IF NOT EXISTS Tags (
    tag VARCHAR(15) PRIMARY KEY
) ENGINE=InnoDB;

-- TaskTags Table (References Tasks and Tags)
CREATE TABLE IF NOT EXISTS TaskTags (
    task_id INTEGER NOT NULL,
    tag VARCHAR(15),
    PRIMARY KEY (task_id, tag),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id),
    FOREIGN KEY (tag) REFERENCES Tags(tag)
) ENGINE=InnoDB;

-- EmployeeTasks Table (References Tasks and Employees)
CREATE TABLE IF NOT EXISTS EmployeeTasks (
    task_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    PRIMARY KEY (task_id, employee_id),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
) ENGINE=InnoDB;

-- EmployeeProjects Table (References Projects and Employees)
CREATE TABLE IF NOT EXISTS EmployeeProjects (
    project_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, employee_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
) ENGINE=InnoDB;


-- Chat Subsystem Tables

-- Chats Table (Tracks all conversations)
CREATE TABLE IF NOT EXISTS Chats (
    chatID INTEGER NOT NULL AUTO_INCREMENT,
    chat_name VARCHAR(255),  -- For group chats
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(chatID)
) ENGINE=InnoDB;

-- ChatMembers Table (Tracks members in each chat)
CREATE TABLE IF NOT EXISTS ChatMembers (
    chat_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (chat_id, employee_id),
    FOREIGN KEY (chat_id) REFERENCES Chats(chatID) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ChatMessages Table (Stores chat messages with soft-delete support)
CREATE TABLE IF NOT EXISTS ChatMessages (
    message_id INTEGER NOT NULL AUTO_INCREMENT,
    chat_id INTEGER NOT NULL,
    sender_id INTEGER,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_contents TEXT DEFAULT NULL, 
    read_receipt BOOLEAN DEFAULT FALSE,
    status ENUM('sent', 'deleted') DEFAULT 'sent',
    is_edited TINYINT(1) DEFAULT 0, 
    PRIMARY KEY (message_id),
    FOREIGN KEY (chat_id) REFERENCES Chats(chatID) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Employees(employee_id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- Dummy data for data analytics page use

-- Insert Projects (created by TeamLeads)
INSERT IGNORE INTO Projects (project_id, project_name, team_leader_id, description, start_date, finish_date, completed) VALUES
    (1, 'Project Alpha', 12, 'Develop new API features.', '2024-03-01', '2024-06-30', 0),
    (2, 'Project Beta', 13, 'Migrate legacy systems to cloud.', '2024-04-01', '2024-07-15', 0),
    (3, 'Project Gamma', 14, 'Enhance internal security.', '2024-03-15', '2024-08-01', 0);

-- Insert Tasks (assigned to Employees under respective projects)
INSERT IGNORE INTO Tasks (
    task_id, task_name, assigned_employee, project_id, description, 
    start_date, finish_date, time_allocated, time_taken, 
    priority, difficulty, completed, completed_date
) VALUES
    (1, 'API Endpoint Creation', 6, 1, 'Build new API endpoints for user data.', '2024-03-05', '2024-04-10', 40, NULL, 3, 3, 0, NULL),
    (2, 'Unit Testing', 7, 1, 'Write unit tests for the new endpoints.', '2024-03-10', '2024-04-20', 35, NULL, 2, 2, 0, NULL),
    (3, 'Cloud Migration Analysis', 8, 2, 'Analyze legacy system readiness.', '2024-04-05', '2024-05-15', 50, NULL, 4, 4, 0, NULL),
    (4, 'Data Migration Script', 9, 2, 'Create scripts for migrating data.', '2024-04-10', '2024-06-01', 45, NULL, 3, 4, 0, NULL),
    (5, 'Security Audit', 10, 3, 'Perform a security audit.', '2024-03-20', '2024-05-10', 55, NULL, 4, 5, 0, NULL),
    (6, 'Implement Encryption', 11, 3, 'Add end-to-end encryption.', '2024-04-01', '2024-06-15', 60, NULL, 5, 5, 0, NULL),
    (7, 'Refactor Codebase', 6, 1, 'Improve code readability and structure.', '2024-04-12', '2024-05-01', 30, 32, 2, 3, 1, '2024-05-03'),
    (8, 'Performance Benchmarking', 7, 1, 'Measure and log API response times.', '2024-04-15', '2024-05-05', 25, 20, 3, 2, 1, '2024-05-04'),
    (9, 'Legacy System Cleanup', 8, 2, 'Remove deprecated components.', '2024-04-20', '2024-05-20', 20, NULL, 2, 3, 0, NULL),
    (10, 'Database Optimization', 9, 2, 'Optimize SQL queries and indexes.', '2024-04-25', '2024-06-10', 40, NULL, 4, 4, 0, NULL),
    (11, 'Penetration Testing', 10, 3, 'Simulate attacks to identify vulnerabilities.', '2024-05-01', '2024-06-15', 50, 60, 5, 5, 1, '2024-06-20'), 
    (12, 'Encryption Key Rotation', 11, 3, 'Implement regular key rotation policy.', '2024-05-05', '2024-06-20', 35, 33, 4, 4, 1, '2024-06-18'),
    (13, 'Bug Fixing Sprint', 6, 1, 'Address reported issues from QA.', '2024-05-10', '2024-05-25', 28, NULL, 3, 3, 0, NULL),
    (14, 'API Documentation', 7, 1, 'Write and publish API usage guide.', '2024-05-12', '2024-06-01', 22, 24, 2, 2, 1, '2024-06-03'), 
    (15, 'Access Control Review', 10, 3, 'Audit user role permissions.', '2024-05-15', '2024-06-05', 30, NULL, 3, 4, 0, NULL),
    (16, 'Failover Testing', 9, 2, 'Test backup and disaster recovery.', '2024-05-18', '2024-06-10', 38, 40, 4, 4, 1, '2024-06-12');


-- Link Employees to Projects (EmployeeProjects)
INSERT IGNORE INTO EmployeeProjects (project_id, employee_id) VALUES
    (1, 12), (1, 6), (1, 7),
    (2, 13), (2, 8), (2, 9),
    (3, 14), (3, 10), (3, 11);

-- Link Employees to Tasks (EmployeeTasks)
INSERT IGNORE INTO EmployeeTasks (task_id, employee_id) VALUES
    (1, 6), (2, 7),
    (3, 8), (4, 9),
    (5, 10), (6, 11);