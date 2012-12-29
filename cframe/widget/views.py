# Create your views here.
from forms import WidgetForm
from models import Widget
import string
import random
from django.shortcuts import render_to_response, HttpResponse
from django.template import RequestContext
from django.conf import settings
from django.template.loader import get_template
from django.template import TemplateDoesNotExist
import os
from cframe.serializers import json_response

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
    ws = Widget.objects.filter(name=name)
    if len(ws) >= 1:
        w = ws[0]
        c['widget'] = w
        c['path'] = '/media/unpacked/%s' % w.name

    template = '%s/templates/main.html' % (name)
    
    try:
        get_template(template) 
    except TemplateDoesNotExist:
        return HttpResponse('')

    return render_to_response(template, c, 
                              context_instance=RequestContext(request, 
                                                        processors=[context]))

def manifest(request, name):

    ws = Widget.objects.filter(name=name)
    w = None
    c = {}
    if len(ws) >= 1:
        w = ws[0]
    
    if w is not None:
        manifest = w.manifest()
        
        for v in dir(manifest):
            if not v.startswith('__'):
                c[v] = manifest.__dict__.get(v)
    
    return json_response(c)

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