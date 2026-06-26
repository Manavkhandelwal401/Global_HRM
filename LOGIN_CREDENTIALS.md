
# HRMS Login Credentials

## Production App
- **Frontend:** https://global-hrm-frontend-230429510558.us-central1.run.app
- **Backend API:** https://global-hrm-backend-230429510558.us-central1.run.app

---

## Registered Accounts (can log in directly)

### Admin Account
- **Email:** mayank@workflowglobal.com
- **Password:** AdminPassword123
- **Role:** Admin (System Administrator)
- **Department:** IT
- **Employee ID:** emp-admin-001

### HR Account
- **Email:** darsh@workflowglobal.com
- **Password:** HRPassword123
- **Role:** HR (HR Manager)
- **Department:** Human Resources
- **Employee ID:** emp-hr-001

### Manager Account
- **Email:** parul@workflowglobal.com
- **Password:** ManagerPassword123
- **Role:** Manager (Engineering Manager)
- **Department:** Engineering
- **Employee ID:** emp-mgr-001

---

## Pending Accounts (must sign up first using activation code)

### Employee 1 - Varshita Sharma
- **Employee ID:** emp-001
- **Email:** varshita@workflowglobal.com
- **Activation Code:** REG-VARSHITA-987
- **Status:** Pending Registration
- **Steps:** Go to Login → "Register profile" → Enter Employee ID, Email, Activation Code, choose a new Password

### Employee 2 - Bhavishya Gupta
- **Employee ID:** emp-002
- **Email:** bhavishya@workflowglobal.com
- **Activation Code:** REG-BHAVISHYA-654
- **Status:** Pending Registration

---

## Password Hashes (SHA-256 with salt "GlobalHRMSalt")
| Account | Password | Hash |
|---------|----------|------|
| Admin | AdminPassword123 | v9a3tFBDqT0rQA9JwmZChOrETMYnobmNRr4RuMDEpo0= |
| HR | HRPassword123 | nZm+XUELmxSPQW8EPkOlv0hYzpirvXcJUiZuOv5txRc= |
| Manager | ManagerPassword123 | YkeL0AEnYhr9Q0T6gPc29T2PClGjI10U3q9EHzkS5Ng= |

---

## Notes
- Passwords are hashed using SHA-256 with salt `GlobalHRMSalt`
- Activation codes expire on 2028-01-01
- After successful signup, activation codes are permanently invalidated
- Role enum: Admin=0, HR=1, Manager=2, Employee=3