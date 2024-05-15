from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class SpamEmail(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="spam_emails")
    email_address = models.EmailField(unique=True)

    def __str__(self):
        return self.email_address

class Email(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="emails")
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="emails_sent")
    recipients = models.ManyToManyField("User", related_name="emails_received")
    subject = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)
    is_spam = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.email,
            "recipients": [user.email for user in self.recipients.all()],
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "read": self.read,
            "archived": self.archived
        }

    def check_spam(self):
        """Checks if the sender is in the recipient's spam_emails list."""
        spam_list = [email.email_address.lower() for email in self.user.spam_emails.all()]  # Get the user's spam list

        # Check if sender's email is in the spam list (case-insensitive)
        if self.sender.email.lower() in spam_list:
            self.is_spam = True
        else:
            self.is_spam = False

    def save(self, *args, **kwargs):
        self.check_spam()  # Call check_spam before saving
        super().save(*args, **kwargs)  # Call the original save method