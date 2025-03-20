import sqlite3  # Use SQLite for local database
from flask import Flask, g, request, jsonify
from flask_cors import CORS  # Enables cross-origin requests
from datetime import datetime

# SQLite database file path
DATABASE_PATH = 'database.db'

PORT = 3300  # Flask app will run on this port

app = Flask(__name__)
CORS(app)  # Allow requests from different origins (useful for front-end integration)

# Function to get a database connection
def get_db():
    if 'db' not in g:
        # Open a new database connection if none exists for this context
        g.db = sqlite3.connect(DATABASE_PATH)
        g.db.row_factory = sqlite3.Row  # Access rows by column name
    return g.db

# Commit and close database connection
def commit_changes():
    db = get_db()
    db.commit()
    db.close()

# Initialize the database by executing the schema file
def init_db():
    try:
        with app.app_context():
            db = get_db()
            cursor = db.cursor()

            # Read and execute SQL schema from file
            with open('schema.sql', 'r') as f:
                schema_sql = f.read()
            cursor.executescript(schema_sql)

            commit_changes()
            print("Database initialized successfully.")
    except sqlite3.Error as e:
        print(f"Database error during initialization: {str(e)}")

# Close the database connection when the app context ends
@app.teardown_appcontext
def close_connection(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Simple route to check if the server is running
@app.route('/')
def index():
    return "SQLite instance is running!"

# Execute arbitrary SQL queries (for debugging)
@app.route('/query', methods=['GET'])
def execute_query():
    sql_query = request.args.get('sql')
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(sql_query)
        results = cursor.fetchall()
        return jsonify([dict(row) for row in results])
    except sqlite3.Error as e:
        return jsonify({'error': str(e)}), 400

# Automatically delete expired projects
def autodelete_projects():
    try:
        db = get_db()
        cursor = db.cursor()

        current_date = datetime.now().strftime('%Y-%m-%d')

        # Find expired projects
        cursor.execute("SELECT project_id FROM ArchivedProjects WHERE future_autodelete_date < ?", (current_date,))
        expired_projects = cursor.fetchall()

        for project in expired_projects:
            project_id = project['project_id']

            # Delete from related tables
            cursor.execute("DELETE FROM Projects WHERE project_id = ?", (project_id,))
            cursor.execute("DELETE FROM ArchivedProjects WHERE project_id = ?", (project_id,))
            cursor.execute("DELETE FROM EmployeeProjects WHERE project_id = ?", (project_id,))

        commit_changes()
        print(f"Deleted {len(expired_projects)} expired projects.")
    except sqlite3.Error as e:
        print(f"Database error: {str(e)}")



# Fetch user types from UserTypes table
@app.route("/get_user_types", methods=["GET"])
def get_user_types():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM UserTypes')
        user_types = cursor.fetchall()
        return jsonify([dict(row) for row in user_types])
    except sqlite3.Error:
        return jsonify({"error": "Database error occurred."}), 500

# Fetch all users (with their employee_id and name)
@app.route("/get_users", methods=["GET"])
def get_users():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT employee_id, first_name, second_name FROM Employees')
        users = cursor.fetchall()

        # Format users for better readability
        users_list = [
            {"id": user["employee_id"], "name": f"{user['first_name']} {user['second_name']}"} for user in users
        ]

        return jsonify(users_list)
    except sqlite3.Error:
        return jsonify({"error": "Database error occurred."}), 500

# Get the status of a specific project
@app.route("/project_status/<int:project_id>", methods=["GET"])
def project_status(project_id):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT completed, authorised FROM Projects WHERE project_id = ?", (project_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Project not found."}), 404

        # Determine project status
        if row["completed"] and row["authorised"]:
            status = "Completed"
        elif row["completed"]:
            status = "Under Review"
        else:
            status = "In Progress"

        return jsonify({"project_id": project_id, "status": status})
    except sqlite3.Error:
        return jsonify({"error": "Database error occurred."}), 500



if __name__ == '__main__':
    init_db()
    # Start the Flask server
    app.run(host="0.0.0.0", port=PORT)
