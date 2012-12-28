import os
from django.db import models
import tarfile

# Create your models here.
class Widget(models.Model):
    widget_file = models.FileField(upload_to='widgets')
    active = models.BooleanField(blank=True, default=True)
    unpack = models.CharField(max_length=255, null=True, blank=True)
    
    def unpack_file(self, to_folder):
        ''' Unpack the widget_file to the location passed'''
        tar = tarfile.open(self.widget_file.name)
        if not os.path.isdir(to_folder):
            os.makedirs(to_folder)
        tar.extract_all(to_folder)
        self.unpack = to_folder
        self.save()
        

    def manifest_file():
        os.path.dirname(f.file.name)

