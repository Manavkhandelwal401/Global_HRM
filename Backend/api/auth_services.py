import jwt
import datetime
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from api.models import Employee

class AuthServices:
    @staticmethod
    def generate_jwt_token(employee):
        # We generate a JWT token containing:
        # unique_name / name, email, role, isDemo, nameid / id / sub
        payload = {
            "nameid": employee.id,
            "unique_name": employee.name,
            "email": employee.email,
            "role": employee.role,
            "isDemo": employee.is_demo,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
            "iat": datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return token

    @staticmethod
    def authenticate_employee(email, password):
        try:
            employee = Employee.objects.get(email__iexact=email)
        except Employee.DoesNotExist:
            return None, "Invalid credentials"

        if employee.registration_status != "Registered":
            return None, "Employee profile is not registered yet. Please sign up first."

        # Support seamless migration:
        # If legacy SHA-256 is used, we verify it, then automatically rehash to Argon2.
        # Check if hash looks like it contains the Argon2 identifier, otherwise assume legacy SHA-256
        is_argon2 = employee.password_hash.startswith("argon2") or employee.password_hash.startswith("pbkdf2")
        
        if is_argon2:
            if check_password(password, employee.password_hash):
                return employee, None
        else:
            # Custom hasher validation
            from api.hashers import LegacySHA256Hasher
            hasher = LegacySHA256Hasher()
            if hasher.verify(password, employee.password_hash):
                # Rehash to Argon2 and save
                employee.password_hash = make_password(password)
                employee.save()
                return employee, None

        return None, "Invalid credentials"

    @staticmethod
    def signup_employee(employee_id, email, code, password):
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return False, "Employee verification failed."

        if not employee.email.lower() == email.lower():
            return False, "Employee verification failed."

        if employee.registration_status != "Pending":
            return False, "Employee verification failed."

        if not employee.activation_code or employee.activation_code != code:
            return False, "Employee verification failed."

        if employee.activation_code_status != "Unused":
            return False, "Employee verification failed."

        if employee.activation_code_expiry and employee.activation_code_expiry < datetime.datetime.now(datetime.timezone.utc):
            return False, "Employee verification failed."

        # Complete registration and store password hash using Django's default hasher (Argon2)
        employee.password_hash = make_password(password)
        employee.registration_status = "Registered"
        employee.activation_code_status = "Used"
        employee.registration_timestamp = datetime.datetime.now(datetime.timezone.utc)
        employee.save()

        return True, "Registration completed successfully. You can now log in."
