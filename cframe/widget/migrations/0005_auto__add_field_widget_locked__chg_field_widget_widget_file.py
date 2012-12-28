# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Widget.locked'
        db.add_column('widget_widget', 'locked',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)


        # Changing field 'Widget.widget_file'
        db.alter_column('widget_widget', 'widget_file', self.gf('django.db.models.fields.files.FileField')(max_length=100, null=True))

    def backwards(self, orm):
        # Deleting field 'Widget.locked'
        db.delete_column('widget_widget', 'locked')


        # User chose to not deal with backwards NULL issues for 'Widget.widget_file'
        raise RuntimeError("Cannot reverse this migration. 'Widget.widget_file' and its values cannot be restored.")

    models = {
        'widget.widget': {
            'Meta': {'object_name': 'Widget'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locked': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'path': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'unpack': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'version': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'widget_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['widget']