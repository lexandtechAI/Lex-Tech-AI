from dotenv import load_dotenv
import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from supabase import create_client, Client
from gotrue.errors import AuthApiError
from typing import Literal
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from mail_logic import send_verification_email  # Import the new function

# --- Security Configuration ---
# IMPORTANT: Change this to a strong, random secret in production!
# Load from environment variable in production
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key")  # Use a strong secret!
s = URLSafeTimedSerializer(SECRET_KEY)

# ------------------ Environment ------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
router = APIRouter()

# ------------------ Request Models ------------------
class AuthRequest(BaseModel):
    email: str
    password: str
    subscriptions: Literal["Free", "Premium"]

class LoginRequest(BaseModel):
    email: str
    password: str

# ------------------ Register ------------------
@router.post("/register")
def register(data: AuthRequest):
    try:
        print(f"📨 Registering: {data.email}")
        # Logic for subscription-based request limits

        result = supabase.auth.sign_up(
            {
                "email": data.email,
                "password": data.password,
            }
        )

        whitelist_response = (
            supabase.table("whitelisted_emails")
            .select("*")
            .eq("email_id", data.email)
            .execute()
        )

        if data.subscriptions.lower() == "free":
            subscriptions = "free"
            number_of_requests = 0

        # Default values
        whitelist_data = None
        organisation_name = None

        if whitelist_response.data:
            whitelist_data = whitelist_response.data[0]  # assuming one match
            subscriptions = "premium"
            number_of_requests = float("inf")  # or use -1 if you prefer
            organisation_name = whitelist_data.get("organisation_name")

        # Store metadata separately if needed
        user_id = result.user.id if hasattr(result, "user") else None
        if user_id:
            # Set email_verified to False by default for new registrations
            supabase.table("profiles").insert(
                {
                    "user_id": user_id,
                    "subscriptions": subscriptions,
                    "is_admin": False,
                    "email": data.email,
                    "phone": 0,
                    "organization": organisation_name,
                    "number_of_requests": number_of_requests,
                    "email_verified": False,  # New column
                }
            ).execute()

            # Generate verification token and send email
            token = s.dumps(data.email, salt='email-verification')
            # IMPORTANT: Replace with your actual frontend verification URL
            # This URL should point to a frontend route that calls your /verify-email endpoint
            verification_link = f"https://lexandtech.pro/verify-email?token={token}"  # Replace with your actual frontend URL
            send_verification_email(data.email, verification_link)

        return {
            "message": "User registered successfully. Please check your email for verification link.",
            "user": result.user,
        }
    except AuthApiError as e:
        print("❌ Registration failed:", str(e))
        raise HTTPException(status_code=400, detail=str(e))

# ------------------ Login ------------------
@router.post("/login")
def login(data: LoginRequest):
    try:
        print(f"🔐 Login attempt: {data.email}")
        result = supabase.auth.sign_in_with_password(
            {"email": data.email, "password": data.password}
        )

        user_id = result.user.id
        access_token = result.session.access_token

        print(f"✅ Login success: {user_id}")

        return {
            "message": "Login successful",
            "user_id": user_id,
            "access_token": access_token,
            "supbasetoken": SUPABASE_KEY,
        }
    except AuthApiError as e:
        print("❌ Login failed:", str(e))
        raise HTTPException(status_code=401, detail=str(e))

# ------------------ Email Verification ------------------
@router.get("/verify-email")
async def verify_email(token: str):
    try:
        email = s.loads(token, salt='email-verification', max_age=3600)  # Token valid for 1 hour
        # Update user's email_verified status in Supabase
        response = supabase.table("profiles").update({"email_verified": True}).eq("email", email).execute()
        if response.data:
            return {"message": "Email verified successfully!"}
        else:
            raise HTTPException(status_code=400, detail="Verification failed or email not found.")
    except SignatureExpired:
        raise HTTPException(status_code=400, detail="Verification link expired.")
    except BadTimeSignature:
        raise HTTPException(status_code=400, detail="Invalid verification link.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
