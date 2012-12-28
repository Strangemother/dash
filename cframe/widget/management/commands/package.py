
'''
Package an unpacked widget into an installable file - ready for transport 
or installation.
this is effectively a tar file.
'''

# package_widget

from django.core.management.base import BaseCommand, CommandError
from optparse import make_option
from django.core import management

try:
    from termcolor import colored
except: pass

import threading, sys, time
from django.db import models
import os
import os.path
from django.db.models import loading
from optparse import OptionParser
from django.conf import settings
import tarfile

class Command(BaseCommand):
    args = 'widget'
    help = "package a widget into a tar file"

    option_list = BaseCommand.option_list + (
        make_option("-o", "--overwrite",
            action='store_true', dest='overwrite', default=False,
            help="Overwrite the admin.py file if it already exists."),
        make_option("-f", "--filename",
            action='store', dest='filename', default=None,
            metavar='FILE',
            help="Name of the file to write to. Default is 'admin.py'"),
        )


    def handle(self, *args, **options):
        self.overwrite = options.get('overwrite')
        self.verbose = options.get('verbose')
        self.filename = options.get('filename')
                             

        if self.filename is None:
            try:
                p = args[1]
            except IndexError:
                p = None

            if p is not None:
                self.filename = p
            else:
                self.filename = '%s.tar.gz' % args[0]

        if os.path.exists(self.filename):
            if self.overwrite == True:
                print 'overwriting file'
            else:
                print 'file exists', self.filename
                return False

        print 'packaging file', args[0], 'to', self.filename

        tar = tarfile.open(self.filename, 'w:gz')
        # get unpack file info

        path = '%s/media/unpacked/%s' % (settings.PROJECT_ROOT, args[0])
        tar.add(path, arcname=args[0])
        tar.close()


    def is_admin(self):
        '''Check if the user is an administrator'''
        if hasattr(os, 'getuid'):
            if os.getuid() == 0:
                self.say(os.getuid(), "r00tness!")
                return True
            else:
                self.say(os.getuid(), "I cannot run as a mortal. Sorry.")
                return False
        return None

    def make_admin(self, app_label):
        ''' Make an admin file targeting app_label'''
        module, app = self.app_label_to_app_module(app_label)

        path = os.path.abspath(app.__file__)
        loc = path.split(os.path.sep)[:-1]
        loc = os.path.sep.join(loc)

        p = "%s%s%s" % (loc, os.path.sep, self.filename)

        if os.path.isfile(p) is not True:
            # If this file is missing, we create a new one
            file = open(p, 'w')
        else:
            # It does exist.
            if self.overwrite: # overwrite allowed? Bool
                self.say('Overwrite %s' % p)
                file = open(p, 'w')
            else:
                self.say('%s file already exists' % p)
                exit(0)

        return app, file

    def ask(self, q):
        inp = raw_input(q)

        if inp in ['yes', 'ye', 'y' ]:
            return True
        elif inp in ['no', 'n']:
            return False
        else:
            print "Input not correct, answer Y/N"
            self.ask(q)
