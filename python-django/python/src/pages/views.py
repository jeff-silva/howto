from django.http import HttpResponse
from django.shortcuts import render

def aaa(*args, **kwargs):
  return HttpResponse('Hello World')