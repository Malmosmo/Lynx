from django.urls import path

from api.views import get_file, save_file

urlpatterns = [
    path('get/', get_file, name="api-get"),
    path('save/', save_file, name="api-save"),
]
