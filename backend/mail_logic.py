import os
import smtplib
from email.message import EmailMessage

# Gmail SMTP config - Load from environment variables
GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_PASS = os.getenv("GMAIL_PASS")


def send_verification_email(to_email: str, verification_link: str):
    msg = EmailMessage()
    msg["Subject"] = "Verify Your Email Address for Lex & Tech AI"
    msg["From"] = GMAIL_USER
    msg["To"] = to_email
    msg.set_content(
        f"Hi there,\n\nThank you for registering with Lex & Tech AI!\n"
        f"Please click on the link below to verify your email address:\n\n"
        f"{verification_link}\n\n"
        f"If you did not register for this service, please ignore this email.\n\n"
        f"Best regards,\nLex & Tech AI Team"
    )

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(GMAIL_USER, GMAIL_PASS)
            smtp.send_message(msg)
        print(f"Verification email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending verification email to {to_email}: {e}")
        return False



def send_confirmation_email(to_email, name):
    msg = EmailMessage()
    msg["Subject"] = "Appointment Received"
    msg["From"] = GMAIL_USER
    msg["To"] = to_email
    msg.set_content(
        f"Hi {name},\n\nThank you for your interest in scheduling an appointment. We’ll contact you soon.\n\nBest,\nTeam"
    )

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(GMAIL_USER, GMAIL_PASS)
            smtp.send_message(msg)
        return True
    except Exception as e:
        print("Error sending email:", e)
        return False
