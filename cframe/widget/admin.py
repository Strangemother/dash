from django.contrib import admin
from models import Widget

class WidgetAdmin(admin.ModelAdmin):
    list_display = ('name', 'widget_file', 'active', 'unpack', 'version', 'path', 'icon', 'locked', )
    list_filter = ('name', 'widget_file', 'active', 'unpack', 'version', 'path', 'icon', 'locked', )
    search_fields = ('name', 'widget_file', 'active', 'unpack', 'version', 'path', 'icon', 'locked', )
    #fields = ('name', 'widget_file', 'active', 'unpack', 'version', 'path', 'icon', 'locked', )
    filter_horizontal = ()
    #exclude = (,)



admin.site.register(Widget, WidgetAdmin)

