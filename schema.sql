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
    FOREIGN KEY (user_type_id) REFERENCES UserTypes(type_id)
) ENGINE=InnoDB;

-- Employee dummy data (AI generated)
INSERT IGNORE INTO Employees VALUES 
    (1, "jakebrooks@makeitall.com", "Jake", "Brooks", 0, True),
    (2, "andreifilipasblai@makeitall.com", "Andrei", "Filipas Blai", 0, True),
    (3, "faizananwar@makeitall.com", "Faizan", "Anwar", 0, True),
    (4, "jevanbucknor@makeitall.com", "Jevan", "Bucknor", 0, True),
    (5, "liamparker@makeitall.com", "Liam", "Parker", 0, True),
    (6, "employee1@makeitall.com", "Employee1", "Smith", 2, True),
    (7, "employee2@makeitall.com", "Employee2", "Johnson", 2, True),
    (8, "employee3@makeitall.com", "Employee3", "Davis", 2, True),
    (9, "employee4@makeitall.com", "Employee4", "Miller", 2, True),
    (10, "employee5@makeitall.com", "Employee5", "Wilson", 2, True),
    (11, "employee6@makeitall.com", "Employee6", "Moore", 2, True),
    (12, "teamlead1@makeitall.com", "TeamLead1", "Taylor", 1, True),
    (13, "teamlead2@makeitall.com", "TeamLead2", "Anderson", 1, True),
    (14, "teamlead3@makeitall.com", "TeamLead3", "Thomas", 1, True);

-- Chats Table (Referenced by ChatMessages and ChatMembers)
CREATE TABLE IF NOT EXISTS Chats (
    chatID INTEGER NOT NULL,
    PRIMARY KEY(chatID)
) ENGINE=InnoDB;

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

-- ChatMessages Table (References Chats and Employees)
CREATE TABLE IF NOT EXISTS ChatMessages (
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    date_time TIMESTAMP NOT NULL,
    message_contents TEXT, 
    read_receipt BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (chat_id) REFERENCES Chats(chatID),
    FOREIGN KEY (sender_id) REFERENCES Employees(employee_id)
) ENGINE=InnoDB;

-- ChatMembers Table (References Chats and Employees)
CREATE TABLE IF NOT EXISTS ChatMembers (
    chat_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (chat_id, employee_id),
    FOREIGN KEY (chat_id) REFERENCES Chats(chatID),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
) ENGINE=InnoDB;

-- Dummy data for data analytics page use

-- Insert Projects (created by TeamLeads)
INSERT IGNORE INTO Projects (project_id, project_name, team_leader_id, description, start_date, finish_date, completed) VALUES
    (1, 'Project Alpha', 12, 'Develop new API features.', '2024-03-01', '2024-06-30', 0),
    (2, 'Project Beta', 13, 'Migrate legacy systems to cloud.', '2024-04-01', '2024-07-15', 0),
    (3, 'Project Gamma', 14, 'Enhance internal security.', '2024-03-15', '2024-08-01', 0);

-- Insert Tasks (assigned to Employees under respective projects)
INSERT IGNORE INTO Tasks (task_id, task_name, assigned_employee, project_id, description, start_date, finish_date, time_allocated, time_taken, completed) VALUES
    (1, 'API Endpoint Creation', 6, 1, 'Build new API endpoints for user data.', '2024-03-05', '2024-04-10', 40, NULL, 0),
    (2, 'Unit Testing', 7, 1, 'Write unit tests for the new endpoints.', '2024-03-10', '2024-04-20', 35, NULL, 0),
    (3, 'Cloud Migration Analysis', 8, 2, 'Analyze legacy system readiness.', '2024-04-05', '2024-05-15', 50, NULL, 0),
    (4, 'Data Migration Script', 9, 2, 'Create scripts for migrating data.', '2024-04-10', '2024-06-01', 45, NULL, 0),
    (5, 'Security Audit', 10, 3, 'Perform a security audit.', '2024-03-20', '2024-05-10', 55, NULL, 0),
    (6, 'Implement Encryption', 11, 3, 'Add end-to-end encryption.', '2024-04-01', '2024-06-15', 60, NULL, 0);

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