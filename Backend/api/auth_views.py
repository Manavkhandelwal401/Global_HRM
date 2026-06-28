import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from api.auth_services import AuthServices

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        
        employee, error = AuthServices.authenticate_employee(email, password)
        if error:
            return JsonResponse({"message": error}, status=400)
        
        token = AuthServices.generate_jwt_token(employee)
        response_data = {
            "accessToken": token,
            "refreshToken": token, # Preserving the refresh token structure
            "user": {
                "id": employee.id,
                "email": employee.email,
                "name": employee.name,
                "role": employee.role,
                "isDemo": employee.is_demo
            }
        }
        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)
    try:
        data = json.loads(request.body)
        employee_id = data.get("employeeId")
        email = data.get("email")
        code = data.get("registrationCode")
        password = data.get("password")
        
        success, message = AuthServices.signup_employee(employee_id, email, code, password)
        if not success:
            return JsonResponse({"message": message}, status=400)
        
        return JsonResponse({"message": message})
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def refresh_view(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)
    # C# simply returned demo-refresh-token or the verified token
    return JsonResponse({
        "accessToken": "demo-refresh-token",
        "refreshToken": "demo-refresh-token"
    })
