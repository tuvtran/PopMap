from django.shortcuts import render
from django.contrib import admin
from django.http import HttpResponse, HttpResponseRedirect
from .models import *

# Create your views here.
def index(request):
    context = {
        'title': 'Index'
    }

    return render(request, 'map/index.html', context)

def search(request, param):
    context = {
        "param": param
    }

    return HttpResponse(param)
