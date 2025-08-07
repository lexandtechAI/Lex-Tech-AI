import smtplib
from email.message import EmailMessage

# Gmail SMTP config
GMAIL_USER = "your-email@gmail.com"
GMAIL_PASS = "your-app-password"  # NOT your real password!


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
