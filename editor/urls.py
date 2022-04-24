from django.urls import path

from editor.views import editor

urlpatterns = [
    path('', editor, name="editor"),
]
