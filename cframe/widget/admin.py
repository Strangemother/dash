from django.contrib import admin
from models import Widget

class WidgetAdmin(admin.ModelAdmin):
    list_display = ('widget_file', 'active', 'unpack', )
    list_filter = ('widget_file', 'active', 'unpack', )
    search_fields = ('widget_file', 'active', 'unpack', )
    #fields = ('widget_file', 'active', 'unpack', )
    filter_horizontal = ()
    #exclude = (,)



admin.site.register(Widget, WidgetAdmin)

