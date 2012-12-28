from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('widget.views',
    url(r'^list/$', 'list', name='list'),
    url(r'^page/(?P<name>.*)/$', 'page', name='page'),
)