from django.urls import path

from editor.views import editor, save

urlpatterns = [
    path('', editor, name="editor"),
    path('save/', save, name="editor-save"),
]
