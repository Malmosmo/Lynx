import json
import os

import lynx.settings as settings

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


FILE_TYPES = {
    ".md": "text/x-markdown"
}


@csrf_exempt
def save_file(request):
    if request.method == "POST":
        post_data = json.loads(request.body)

        path = post_data["path"]
        content = post_data["code"]

        with open(settings.MEDIA_FILES / path, "w") as file:
            file.write(content)

        return JsonResponse({"status": "ok"})

    return JsonResponse({"status": "whoops"})


def get_file(request):
    status = ""
    if request.method == "GET":
        path = request.GET.get("path", "")

        if path:
            abs_path = settings.MEDIA_FILES / path

            if os.path.isfile(abs_path):
                with open(abs_path, "r") as file:
                    fileContent = file.read()

                _, extension = os.path.splitext(path)

                return JsonResponse({
                    "status": "ok",
                    "file": fileContent,
                    "type": FILE_TYPES.get(extension, ""),
                    "path": str(path)
                })

            else:
                status = "file does not exist"

        else:
            status = "file does not exist"

    else:
        status = "file does not exist"

    return JsonResponse({
        "status": status,
        "file": "",
        "type": "",
        "path": ""
    })
