from django.conf.urls import patterns, include, url
from django.views.generic.simple import redirect_to
from django.conf import settings
import os
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'grid.views.home', name='home'),
    url(r'^widget/', include('widget.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)


urlpatterns += patterns('', 
    (r'^images/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.MEDIA_ROOT, 'images'), 'show_indexes': True}),
    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
)
urlpatterns += staticfiles_urlpatterns()
