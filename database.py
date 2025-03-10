import json
import sqlite3
import bcrypt
import schedule
import time
from flask import Flask, g
from flask import request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import threading

DATABASE = 'database.db'
PORT = 3300

app = Flask(__name__)
CORS(app)


""""" DB Initialisation Functionality """

def get_db():
    try:
        db = getattr(g, '_database', None)
        if db is None:
            db = g._database = sqlite3.connect(DATABASE)
            db.row_factory = sqlite3.Row  # Returns rows as dictionaries
        return db
    except sqlite3.DatabaseError as e:
        print(f"Database connection error: {str(e)}")
        return None
    
def commit_changes(db):
    db.commit()
    db.close()
    
def init_db():  
    try:
        with app.app_context():
            db = get_db()
            if db is None:
                return
            cursor = db.cursor()
            with open('schema.sql', 'r') as f:
                schema_sql = f.read()
            cursor.executescript(schema_sql)
            commit_changes(db)
    except sqlite3.DatabaseError as e:
        print(f"Database error during initialization: {str(e)}")

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return "SQLite instance is running!"

#Function for executing SQL queries
@app.route('/query', methods=['GET'])
def execute_query():
    if app.debug:
        print('Running in debug mode')
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



"""autodelete function"""
def autodelete_projects():
    try:
        db = get_db()
        cursor = db.cursor()
        
        # archive, projects, employee projects,
        current_date = datetime.now().strftime('%Y-%m-%d')
        cursor.execute("SELECT project_id FROM ArchivedProjects WHERE future_autodelete_date < ?", (current_date,))
        expired_projects = cursor.fetchall()
        
        for project in expired_projects:
            project_id = project['project_id']
            cursor.execute("DELETE FROM Projects WHERE project_id = ?", (project_id,))
            cursor.execute("DELETE FROM ArchivedProjects WHERE project_id = ?", (project_id,))
            cursor.execute("DELETE FROM EmployeeProjects WHERE project_id = ?", (project_id,))
        
        commit_changes(db)
        print(f"Deleted {len(expired_projects)} expired projects.")
    except sqlite3.DatabaseError as e:
        print(f"Database error: {str(e)}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")


# scheduling
schedule.every().day.at("00:00").do(autodelete_projects)




""" User functions """

# Fetch User Types
@app.route("/get_user_types", methods=["GET"])
def get_user_types():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM UserTypes')
        user_types = cursor.fetchall()
        return jsonify([dict(user) for user in user_types])  # Convert to list of dictionaries
    except sqlite3.DatabaseError:
        return jsonify({"error": "Database error occurred. Please try again later."}), 500
    except Exception:
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500
    
# Fetch list of users
@app.route("/get_users", methods=["GET"])
def get_users():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT employee_id, first_name, second_name FROM Employees')
        
        users = cursor.fetchall()
        
        users_list = [
            {"id": user[0], "name": user[1] + " " + user[2]} for user in users
        ]
        
        return jsonify(users_list)  # Return the list of users as JSON
    except sqlite3.DatabaseError:
        return jsonify({"error": "Database error occurred. Please try again later."}), 500
    except Exception:
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500


    
#Function for checking project status
@app.route("/project_status/<int:project_id>", methods=["GET"])
def project_status(project_id):
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT completed, authorised FROM Projects WHERE project_id = ?", (project_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Project not found."}), 404

        if row["completed"] and row["authorised"]:
            status = "Completed"
        elif row["completed"]:
            status = "Under Review"
        else:
            status = "In Progress"

        return jsonify({"project_id": project_id, "status": status}), 200
    except sqlite3.DatabaseError:
        return jsonify({"error": "Database error occurred. Please try again later."}), 500
    except Exception:
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500



    
#Get all projects
@app.route('/projects', methods=['GET'])
def get_projects():
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM Projects")
        projects = cursor.fetchall()
        return jsonify([dict(project) for project in projects])
    except sqlite3.DatabaseError as e:
        return jsonify({"error": f"Database error: {str(e)}. Please try again later."}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}. Please try again later."}), 500



#Search function for User Type and Employee data by Employee ID
@app.route('/employees/<int:employee_id>/details', methods=['GET'])
def get_employee_details(employee_id):
    query = """
    SELECT e.employee_id, e.employee_email, e.first_name, e.second_name, e.user_type_id, ut.type_name
    FROM Employees e
    JOIN UserTypes ut ON e.user_type_id = ut.type_id
    WHERE e.employee_id = ?
    """
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(query, (employee_id,))
        employee_details = cursor.fetchone()
        if employee_details is None:
            return jsonify({'error': 'Employee not found'}), 404
        return jsonify(dict(employee_details))
    except sqlite3.DatabaseError as e:
        return f"Database error: {str(e)}. Please try again later."
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}. Please try again later."
    
def run_scheduler():
    """ Function to run scheduled tasks """
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == '__main__':
    init_db()  # Initialize the database before starting the server

    # Start the scheduler in a separate thread
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()

    # Start Flask server
    app.run(host="0.0.0.0", port=3300)
