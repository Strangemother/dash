
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.core import management
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth import logout

def context(request):
	c = {}
	return c
# Create your views here.
# 
def home(request):
    c = {}
    return render_to_response('grid/index.html', c, 
                              context_instance=RequestContext(request, 
                                                        processors=[context]))
