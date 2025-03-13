-- Employees Table
CREATE TABLE IF NOT EXISTS Employees (
    employee_id INTEGER PRIMARY KEY,
    employee_email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    second_name TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    user_type_id INTEGER NOT NULL,
    current_employee BOOLEAN NOT NULL,
    FOREIGN KEY (user_type_id) REFERENCES UserTypes(type_id)
);

-- UserTypes Table
CREATE TABLE IF NOT EXISTS UserTypes (
    type_id INTEGER PRIMARY KEY,
    type_name TEXT NOT NULL UNIQUE
);


-- Insert default user types
INSERT OR IGNORE INTO UserTypes (type_id, type_name) VALUES
    (0, 'Manager'),
    (1, 'ProjectLead'),
    (2, 'Employee');


-- Projects Table
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
);


-- Tasks Table
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
);


-- EmployeeTasks Table
CREATE TABLE IF NOT EXISTS EmployeeTasks (
    task_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    PRIMARY KEY (task_id, employee_id),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);


-- EmployeeProjects Table
CREATE TABLE IF NOT EXISTS EmployeeProjects (
    project_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, employee_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);


CREATE TABLE IF NOT EXISTS Chats(
    chatID INTEGER NOT NULL,
    -- ToDo - come up with other necessary field for chat table
    PRIMARY KEY(chat_id),
)


CREATE TABLE IF NOT EXISTS ChatMessages(
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    date_time TIMESTAMP NOT NULL,
    message_contents TEXT, 
    read_receipt BOOLEAN DEFAULT FALSE,
)


CREATE TABLE IF NOT EXISTS ChatMembers(
    chat_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (chat_id, employee_id),
    FOREIGN KEY (chat_id) REFERENCES Chat(chat_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
)


CREATE TABLE IF NOT EXISTS 