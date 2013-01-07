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
from cframe.serializers import json_response, json_serialize
from django.contrib.auth.models import User
import json

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
    c['users'] = User.objects.filter(is_active=True)
    c['error'] = False

    tn = request.GET.get('assetPath', 'main.html')
    if tn == '':
        tn = 'main.html'
    data = request.GET.get('data', None)

    if data:
        jsondata = json.loads(data)
        c['data'] = jsondata
    # assert False

    _asjson = True if request.GET.get('json', request.is_ajax()) else False
    c['is_ajax'] = _asjson

    ws = Widget.objects.filter(name=name)

    if len(ws) >= 1:
        w = ws[0]
        c['widget'] = w
        c['path'] = '/media/unpacked/%s' % w.path

        template = '%s/media/unpacked/%s/templates/%s' % (settings.PROJECT_ROOT, w.path, tn)

        try:
            get_template(template) 
        except TemplateDoesNotExist:
            c['error'] = True
            c['code'] = 1
            c['reason'] = 'Template missing "%s"' % (template)
            c['attempt'] = '''Enure the Widget.name of the widget exists in the
                database. Ensure the template name is correct ("%s")''' % (tn)

            # Clear widgets before returning ajax
            c['widgets'] = None
            return json_response(c)

        return render_to_response(template, c, 
                              context_instance=RequestContext(request, 
                                                        processors=[context]))
    elif len(ws) <= 0:
        c['error'] = True
        c['code'] = 2
        c['reason'] = 'No widgets named "%s"' % name
        c['attempt'] = '''Enure the Widget.name of the widget exists in the
            database.'''
        
        c['widgets'] = None
        return json_response(c)
       
 
    return HttpResponse('No response for "%s". Found: %s' % (name, len(ws))) 

def data(request, name):
    ''' Return a data object ready for requirejs to implement for 
    widget assistance and knowledge/sigs etc...'''
    c = {}
    ws = Widget.objects.filter(name=name)
    if len(ws) >= 1:
        w = ws[0]
        c['widget'] = w
        c['path'] = '/media/unpacked/%s' % w.path   
    t = 'define(' + json_serialize(c) + ')'
    return HttpResponse(t)


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