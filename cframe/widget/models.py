import os, sys, imp
from django.db import models
import tarfile

# Create your models here.
class Widget(models.Model):
    widget_file = models.FileField(upload_to='widgets')
    active = models.BooleanField(blank=True, default=True)
    unpack = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    version = models.CharField(max_length=20, null=True, blank=True)

    def __unicode__(self):
        return '%s, active: %s - version: %s' % (self.name, self.active, self.version)
    def manifest(self):
        ''' 
        Retuns a module of the manifest file, ready as an import of 'manifest'
        '''
        # load a minifest file within the unpack/name location. if these fields
        # do not exist, do a search for the manifest file and return it. This is 
        # the same method used for implemented a newly uploaded widget

        # create and check url
        p = os.path.join(self.unpack, self.name, 'manifest.py')
        return imp.load_source('manifest', p)


    def find_manifests(self, path=None):
        path = self.widget_file.path if path is None else path
        manifests = []
        for top, dirs, files in os.walk(path):
            # folder packed name (root folder)
            bm = os.path.basename(top)
            # loop for a manifest file in the top directory
            
            if 'manifest.py' in files:
                # manifest exists in the top dir, use it! =D
                # import pdb;pdb.set_trace()
                manifest = os.path.join(top, 'manifest.py')
                manifests.append(manifest)
        return manifests

    def unpack_file(self, to_folder):
        ''' Unpack the widget_file to the location passed'''
        tar = tarfile.open(self.widget_file.path)
       
        if not os.path.isdir(to_folder):
            os.makedirs(to_folder)
        # Extract the tar data into the new folder
        tar.extractall(to_folder)
        # Read manifest file of each folder in tar
        manifests = self.find_manifests(to_folder)
        if len(manifests) >= 1:
            imp.load_source('manifest', manifests[0])
            import manifest
            fn = os.path.basename(os.path.dirname(manifests[0]))
            self.name = manifest.__dict__.get('NAME', fn)
            self.version = manifest.__dict__.get('VERSION', None)


        # Save the unpack location to the model
        self.unpack = to_folder
        self.save()


    def manifest_file():
        os.path.dirname(f.file.name)