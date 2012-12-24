# Create your views here.
from forms import WidgetForm
from models import Widget

from django.shortcuts import render_to_response
from django.template import RequestContext


def list(request):
    if request.method == 'POST':
        form = WidgetForm(request.POST, request.FILES)
        if form.is_valid():
            widget_file = request.FILES['widget_file']
            wid = Widget(widget_file=widget_file)
            wid.save()
    else:
        form = WidgetForm()

    widgets = Widget.objects.all()

    return render_to_response(
        'widget/list.html',
        {'form': form, 'widgets': widgets},
        context_instance=RequestContext(request)
    )

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