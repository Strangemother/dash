from django.contrib import admin
from models import Widget

class WidgetAdmin(admin.ModelAdmin):
    list_display = ('widget_file', 'active', 'unpack', 'name', 'version', )
    list_filter = ('widget_file', 'active', 'unpack', 'name', 'version', )
    search_fields = ('widget_file', 'active', 'unpack', 'name', 'version', )
    #fields = ('widget_file', 'active', 'unpack', 'name', 'version', )
    filter_horizontal = ()
    #exclude = (,)



admin.site.register(Widget, WidgetAdmin)

