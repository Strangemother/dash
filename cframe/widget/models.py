from django.db import models

# Create your models here.
class Widget(models.Model):
    widget_file = models.FileField(upload_to='widgets')
    active = models.BooleanField(blank=True, default=True)
