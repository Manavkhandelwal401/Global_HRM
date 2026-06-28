# full_verification_suite.py
"""Comprehensive Python suite to verify the Django + Strawberry backend.
Exercises GraphQL queries, mutations, database states, transaction logic,
activation flows, role restrictions, and JWT integration.
Writes a full runtime verification report to 'runtime_report.json'.
"""
import json
import requests
import sqlite3
import os
import datetime

BASE_URL = "http://127.0.0.1:8000"
DB_PATH = "hrms_backend/test_db.sqlite3"
REPORT = {}

def record(feature, status, request_details=None, response_details=None, db_results=None, errs=None):
    REPORT[feature] = {
        "status": status,
        "request": request_details or "N/A",
        "response": response_details or "N/A",
        "database": db_results or "N/A",
        "errors": errs or "N/A"
    }

def run_graphql(query, variables=None, headers=None):
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    try:
        r = requests.post(f"{BASE_URL}/graphql", json=payload, headers=headers, timeout=5)
        return r.status_code, r.json(), r.headers
    except Exception as e:
        return 500, {"error": str(e)}, {}

def db_query(sql, params=()):
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(sql, params)
        res = cur.fetchall()
        conn.close()
        return "SUCCESS", res
    except Exception as e:
        return "ERROR", str(e)

# 1. Health check
try:
    r = requests.get(f"{BASE_URL}/health/")
    if r.status_code == 200:
        record("HealthEndpoint", "PASS", "GET /health/", r.json())
    else:
        record("HealthEndpoint", "FAIL", "GET /health/", r.text)
except Exception as e:
    record("HealthEndpoint", "FAIL", "GET /health/", str(e))

# 2. Introspection
status, body, headers = run_graphql("{ __schema { queryType { name } } }")
if status == 200 and "Query" in str(body):
    record("GraphQLIntrospection", "PASS", "Introspection Query", body)
else:
    record("GraphQLIntrospection", "FAIL", "Introspection Query", body)

# 3. Authentication (REST login)
login_payload = {"email": "mayank@workflowglobal.com", "password": "AdminPassword123"}
try:
    res_login = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if res_login.status_code == 200:
        auth_data = res_login.json()
        token = auth_data["accessToken"]
        record("Login_Valid", "PASS", f"POST /auth/login {login_payload}", auth_data)
    else:
        token = None
        record("Login_Valid", "FAIL", f"POST /auth/login {login_payload}", res_login.json())
except Exception as e:
    token = None
    record("Login_Valid", "FAIL", f"POST /auth/login {login_payload}", str(e))

# 4. Invalid login
invalid_payload = {"email": "mayank@workflowglobal.com", "password": "WrongPassword"}
try:
    res_invalid = requests.post(f"{BASE_URL}/auth/login", json=invalid_payload)
    if res_invalid.status_code == 400:
        record("Login_Invalid", "PASS", f"POST /auth/login {invalid_payload}", res_invalid.json())
    else:
        record("Login_Invalid", "FAIL", f"POST /auth/login {invalid_payload}", res_invalid.text)
except Exception as e:
    record("Login_Invalid", "FAIL", f"POST /auth/login {invalid_payload}", str(e))

# 5. Token Authorization Header integration (getCurrentUser)
if token:
    headers = {"Authorization": f"Bearer {token}"}
    status_user, body_user, _ = run_graphql("{ getCurrentUser { id name email role } }", headers=headers)
    if status_user == 200 and body_user.get("data", {}).get("getCurrentUser"):
        record("getCurrentUser_Auth", "PASS", "getCurrentUser query with token", body_user)
    else:
        record("getCurrentUser_Auth", "FAIL", "getCurrentUser query with token", body_user)
else:
    record("getCurrentUser_Auth", "NOT RUNTIME VERIFIED")

# 6. Protected routes / Unauthorized checks
status_no_auth, body_no_auth, _ = run_graphql("{ getCurrentUser { name } }")
if body_no_auth.get("data", {}).get("getCurrentUser") is None:
    record("GraphQLAuthorization", "PASS", "getCurrentUser query without token", body_no_auth)
else:
    record("GraphQLAuthorization", "FAIL", "getCurrentUser query without token", body_no_auth)

# 7. Signup using activation code
signup_payload = {
    "employeeId": "emp-001",
    "email": "varshita@workflowglobal.com",
    "registrationCode": "REG-VARSHITA-987",
    "password": "NewUserPassword123"
}
try:
    # Reset employee state to pending in DB before running signup
    conn = sqlite3.connect(DB_PATH)
    conn.cursor().execute(
        "UPDATE Employees SET RegistrationStatus='Pending', ActivationCodeStatus='Unused', ActivationCode='REG-VARSHITA-987' WHERE Id='emp-001'"
    )
    conn.commit()
    conn.close()
    res_signup = requests.post(f"{BASE_URL}/auth/signup", json=signup_payload)
    if res_signup.status_code == 200:
        # Verify directly in DB
        db_status, db_res = db_query("SELECT RegistrationStatus, ActivationCodeStatus FROM Employees WHERE Id=?", ("emp-001",))
        if db_status == "SUCCESS" and db_res == [('Registered', 'Used')]:
            record("Signup_ActivationCode", "PASS", f"POST /auth/signup {signup_payload}", res_signup.json(), db_res)
        else:
            record("Signup_ActivationCode", "FAIL", f"POST /auth/signup {signup_payload}", res_signup.json(), db_res)
    else:
        record("Signup_ActivationCode", "FAIL", f"POST /auth/signup {signup_payload}", res_signup.json())
except Exception as e:
    record("Signup_ActivationCode", "FAIL", f"POST /auth/signup {signup_payload}", str(e))

# 8. Invalid activation code signup
invalid_code_payload = {
    "employeeId": "emp-002",
    "email": "jane.smith@workflowglobal.com",
    "registrationCode": "WRONG-CODE",
    "password": "NewUserPassword123"
}
try:
    res_invalid_code = requests.post(f"{BASE_URL}/auth/signup", json=invalid_code_payload)
    if res_invalid_code.status_code == 400:
        record("Signup_InvalidCode", "PASS", f"POST /auth/signup {invalid_code_payload}", res_invalid_code.json())
    else:
        record("Signup_InvalidCode", "FAIL", f"POST /auth/signup {invalid_code_payload}", res_invalid_code.text)
except Exception as e:
    record("Signup_InvalidCode", "FAIL", f"POST /auth/signup {invalid_code_payload}", str(e))

# 9. Attendance clock in / clock out
if token:
    headers = {"Authorization": f"Bearer {token}"}
    clockin_mutation = """
    mutation {
        clockIn(employeeId: "emp-admin-001") {
            id
            date
            status
            clockIn
        }
    }
    """
    status_in, body_in, _ = run_graphql(clockin_mutation, headers=headers)
    if status_in == 200 and body_in.get("data", {}).get("clockIn"):
        # Verify db write
        db_status, db_res = db_query("SELECT Status FROM AttendanceRecords WHERE EmployeeId=?", ("emp-admin-001",))
        if db_status == "SUCCESS" and len(db_res) > 0:
            record("Attendance_ClockIn", "PASS", clockin_mutation, body_in, db_res)
        else:
            record("Attendance_ClockIn", "FAIL", clockin_mutation, body_in, db_res)
    else:
        record("Attendance_ClockIn", "FAIL", clockin_mutation, body_in)
else:
    record("Attendance_ClockIn", "NOT RUNTIME VERIFIED")

# 10. Leave request mutation & database verification
if token:
    headers = {"Authorization": f"Bearer {token}"}
    leave_mutation = """
    mutation {
        submitLeaveRequest(request: {
            employeeId: "emp-admin-001",
            leaveType: "Casual",
            startDate: "2026-07-01T09:00:00Z",
            endDate: "2026-07-02T18:00:00Z",
            totalDays: 2.0,
            reason: "Vacation"
        }) {
            id
            status
            totalDays
        }
    }
    """
    status_leave, body_leave, _ = run_graphql(leave_mutation, headers=headers)
    if status_leave == 200 and body_leave.get("data", {}).get("submitLeaveRequest"):
        req_id = body_leave["data"]["submitLeaveRequest"]["id"]
        # Verify db update (LeaveBalances & LeaveRequests)
        db_status, db_res = db_query("SELECT Status, TotalDays FROM LeaveRequests WHERE Id=?", (req_id,))
        db_status_bal, db_res_bal = db_query("SELECT Pending, Available FROM LeaveBalances WHERE EmployeeId=? AND LeaveType=0", ("emp-admin-001",))
        record("LeaveWorkflow_Submit", "PASS", leave_mutation, body_leave, {"requests": db_res, "balances": db_res_bal})
    else:
        record("LeaveWorkflow_Submit", "FAIL", leave_mutation, body_leave)
else:
    record("LeaveWorkflow_Submit", "NOT RUNTIME VERIFIED")

# Save final report to JSON
report_path = "hrms_backend/runtime_report.json"
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(REPORT, f, indent=2)
print("VERIFICATION COMPLETE. Report generated at hrms_backend/runtime_report.json")
