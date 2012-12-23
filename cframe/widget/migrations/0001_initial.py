# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Widget'
        db.create_table('widget_widget', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('widget_file', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('widget', ['Widget'])


    def backwards(self, orm):
        # Deleting model 'Widget'
        db.delete_table('widget_widget')


    models = {
        'widget.widget': {
            'Meta': {'object_name': 'Widget'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'widget_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['widget']