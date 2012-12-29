import os, sys, imp
from django.db import models
import tarfile
import shutil
from django.core.exceptions import ValidationError

# Create your models here.
class Widget(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True, 
        help_text='Friendly name of the widget')
    widget_file = models.FileField(upload_to='widgets', null=True, blank=True,
        help_text='The file to unpack when creating this widget')
    active = models.BooleanField(blank=True, default=True,
        help_text='Select if this widget is active')
    unpack = models.CharField(max_length=255, null=True, blank=True,
        help_text='the root location of the wisget (to manifest.py)')
    version = models.CharField(max_length=20, null=True, blank=True,
        help_text='Author widget version for upgrade assistance')
    path = models.CharField(max_length=255, null=True, blank=True,
        help_text='pseudo path to extension for use with importing')
    icon = models.CharField(max_length=255, null=True, blank=True,
        help_text='relative public path of icon to use for image data')
    locked = models.BooleanField(blank=True, default=True,
        help_text='Lock to ensure a delete procedure does not destroy files (good for dev)')

    def delete(self, *args, **kwargs):

        if self.lock == True:
            # cannot delete
            raise ValidationError('''This widget is locked and cannot be deleted''')
            return False
        else:
            super(Widget, self).delete(*args, **kwargs)
            # Delete the file after the model
            if os.path.exists(self.widget_file.path):
                os.remove(self.widget_file.path)

            if os.path.exists(self.unpack):
                shutil.rmtree(self.unpack)

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
        p = os.path.join(self.unpack, 'manifest.py')
        if self.path != os.path.basename(self.unpack):
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
                manifests.append([bm, manifest])
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
            path = '%s/%s' % (os.path.basename(to_folder), manifests[0][0])
            imp.load_source('manifest', manifests[0][1])
            import manifest
            man = manifest.__dict__.get
            fn = os.path.basename(os.path.dirname(manifests[0][1]))
            self.name = man('NAME', fn)
            self.version = man('VERSION', None)
            icon = man('ICON', None)

            if icon is not None:
                self.icon = '/media/unpacked/%s/%s' % (path, icon) 

        # Save the unpack location to the model
        self.unpack = to_folder
        self.path = '%s/%s' % (os.path.basename(to_folder), manifests[0][0])
        
        # make pseudo path to extension for use with require importing

        #self.path = 
        self.save()


    def manifest_file():
        os.path.dirname(f.file.name)