# Create your views here.
from forms import WidgetForm
from models import Widget
import string
import random
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
def context(request):
    c = {}
    return c

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))

def list(request):
    if request.method == 'POST':
        form = WidgetForm(request.POST, request.FILES)
        if form.is_valid():
            widget_file = request.FILES['widget_file']
            wid = Widget(widget_file=widget_file)
            wid.save()

            root = settings.PROJECT_ROOT
            nid = '%s/media/unpacked/%s' % (root, id_generator())
            wid.unpack = nid
            wid.save()
            wid.unpack_file(nid)
    else:
        form = WidgetForm()

    widgets = Widget.objects.all()

    return render_to_response(
        'widget/list.html',
        {'form': form, 'widgets': widgets},
        context_instance=RequestContext(request)
    )

def page(request, name):
    c= {}

    c['widgets'] = Widget.objects.filter(active=True)
    
    template = '%s/templates/main.html' % (name)
    return render_to_response(template, c, 
                              context_instance=RequestContext(request, 
                                                        processors=[context]))


def install_widget(widget):
    pass
    # perform installation, 
    # get JS,
    # get py requirements
    # IMG LOC
    # perm data endpoint for saving information
    # get css
    # add static points
    # provide HTML pages for templated endpoint with forced widget base.
    # link icons
    # get html endpoints