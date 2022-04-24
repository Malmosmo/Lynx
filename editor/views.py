import json
import os

import lynx.settings as settings
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.


def editor(request):
    # with open(settings.MEDIA_FILES / "code.txt", "r") as file:
    #     code = file.read()

    files = os.listdir(settings.MEDIA_FILES)

    return render(request, template_name="editor/layout.html", context={"files": files})


# @csrf_exempt
# def save(request):
#     if request.method == "POST":
#         post_data = json.loads(request.body)
#         code = post_data["code"]

#         if code is not None:
#             with open(settings.MEDIA_FILES / "code.txt", "w") as file:
#                 file.write(code)

#     return HttpResponse("based")
