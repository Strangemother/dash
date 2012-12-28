from django.contrib import admin
from models import Widget

class WidgetAdmin(admin.ModelAdmin):
    list_display = ('name', 'widget_file', 'active', 'unpack', 'version', 'path', 'locked', )
    list_filter = ('widget_file', 'active', 'unpack', 'name', 'version', 'path', 'locked', )
    search_fields = ('widget_file', 'active', 'unpack', 'name', 'version', 'path', 'locked', )
    #fields = ('widget_file', 'active', 'unpack', 'name', 'version', 'path', 'locked', )
    filter_horizontal = ()
    #exclude = (,)



admin.site.register(Widget, WidgetAdmin)

