from dotenv import load_dotenv

load_dotenv()

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from gotrue.errors import AuthApiError
from typing import Literal


# ------------------ Environment ------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
router = APIRouter()

# # ✅ In-memory token store (for development/testing only)
# token_store = {}


# ------------------ Request Model ------------------
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
            supabase.table("profiles").insert(
                {
                    "user_id": user_id,
                    "subscriptions": subscriptions,
                    "is_admin": False,
                    "email": data.email,
                    "phone": 0,
                    "organization": organisation_name,
                    "number_of_requests": number_of_requests,
                }
            ).execute()
        return {"message": "User registered successfully", "user": result.user}
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

        # # ✅ Store token in memory (development use only)
        # token_store["user_id"] = access_token

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
