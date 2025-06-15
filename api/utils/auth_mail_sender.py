import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from string import Template
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# SMTP Email Sender
def send_html_email(recipient_email, name, code, organisation):
    # Load the HTML template
    with open('/Users/julianstosse/Developer/zuma/api/utils/html_email_template.html', 'r') as file:
        html_template = Template(file.read())

    # Substitute placeholders with actual data
    html_content = html_template.substitute(NAME=name, CODE=code, ORGANISATION=organisation)

    # Create the email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your Verification Code"
    msg["From"] = os.getenv("SMTP_USER")
    msg["To"] = recipient_email

    # Attach the HTML content
    msg.attach(MIMEText(html_content, "html"))

    # Send the email
    with smtplib.SMTP(os.getenv("SMTP_SERVER", "smtp.example.com"), int(os.getenv("SMTP_PORT", 587))) as server:
        server.starttls()
        server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASSWORD"))
        server.sendmail(os.getenv("SMTP_USER"), recipient_email, msg.as_string())

# Example usage
if __name__ == "__main__":
    send_html_email(
        recipient_email="julianfaitdugaming@gmail.com",
        name="John Doe",
        code="123456",
        organisation="Zuma Technologies"
    )
