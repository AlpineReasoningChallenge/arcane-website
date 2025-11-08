import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Literal


def send_submission_notification(
    recipient_email: str,
    puzzle_id: int,
    state: Literal["correct", "incorrect"]
) -> bool:
    """
    Send a notification email to a user about their ARCANE puzzle submission.
    
    Args:
        recipient_email: Email address of the recipient
        puzzle_id: ID of the puzzle that was graded
        state: Whether the submission was "correct" or "incorrect"
    
    Returns:
        True if email was sent successfully, False otherwise
    """
    # Email configuration
    sender_email = "alpinereasoningcontest@gmail.com"
    sender_password = "qvge xgzj cztd nboq"
    
    # Create message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"ARCANE - Puzzle {puzzle_id} Submission Graded"
    msg["From"] = sender_email
    msg["To"] = recipient_email
    
    # Determine status text and color
    status_text = "Correct" if state == "correct" else "Incorrect"
    status_color = "#95bb72" if state == "correct" else "#ff4444"
    status_bg = "rgba(149, 187, 114, 0.1)" if state == "correct" else "rgba(255, 68, 68, 0.1)"
    
    # HTML email template
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ARCANE Submission Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%); color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 36px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: 2px;">
                    ARCANE
                </h1>
                <div style="height: 2px; background: linear-gradient(90deg, transparent, #00d9ff, transparent); margin: 20px 0;"></div>
            </div>
            
            <!-- Main Content -->
            <div style="background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);">
                <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 20px 0; text-align: center;">
                    Your Submission Has Been Graded
                </h2>
                
                <p style="font-size: 16px; font-weight: 300; color: #cccccc; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                    Your submission for <strong style="color: #00d9ff;">Puzzle {puzzle_id}</strong> has been reviewed.
                </p>
                
                <!-- Status Badge -->
                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; padding: 12px 32px; border-radius: 8px; background: {status_bg}; border: 2px solid {status_color};">
                        <span style="font-size: 18px; font-weight: 700; color: {status_color}; text-transform: uppercase; letter-spacing: 1px;">
                            {status_text}
                        </span>
                    </div>
                </div>
                
                <p style="font-size: 14px; font-weight: 300; color: #999999; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    {"Congratulations! Your answer was correct. Let's try to solve the next puzzle!" if state == "correct" else "Your answer was incorrect. Let's go back to the notebook to keep trying!"}
                </p>
            </div>
            
            <!-- Button -->
            <div style="text-align: center; margin-top: 40px;">
                <a href="https://arcane.archallenge.org/dashboard" 
                   style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 20px rgba(0, 217, 255, 0.3); transition: all 0.3s ease;">
                    Visit the Dashboard
                </a>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="font-size: 12px; font-weight: 300; color: #666666; margin: 0;">
                    This is an automated notification from ARCANE, an <a href="https://archallenge.org">Alpine Reasoning Challenge</a> event.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text fallback
    text = f"""
    ARCANE - Puzzle {puzzle_id} Submission Graded
    
    Your submission for Puzzle {puzzle_id} has been reviewed.
    
    Status: {status_text}
    {"Congratulations! Your answer was correct. Let's try to solve the next puzzle!" if state == "correct" else "Your answer was incorrect. Let's go back to the notebook to keep trying!"}
    
    Visit your notebook: https://arcane.archallenge.org/dashboard
    
    ---
    This is an automated notification from ARCANE, an Alpine Reasoning Challenge event.
    """
    
    # Attach both plain text and HTML versions
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    
    msg.attach(part1)
    msg.attach(part2)
    
    try:
        # Create SMTP session
        s = smtplib.SMTP('smtp.gmail.com', 587)
        s.starttls()
        s.login(sender_email, sender_password)
        
        # Send email
        s.sendmail(sender_email, recipient_email, msg.as_string())
        s.quit()
        
        print(f"[SUCCESS] Notification email sent to {recipient_email} for Puzzle {puzzle_id} ({state})")
        return True
        
    except Exception as e:
        print(f"[ERROR] Failed to send email to {recipient_email}: {str(e)}")
        return False


# Example usage (for testing)
if __name__ == "__main__":
    # Test sending an email
    send_submission_notification(
        recipient_email="zhengm58@gmail.com",
        puzzle_id=1,
        state="correct"
    )
