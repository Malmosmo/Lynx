import json

import lynx.settings as settings
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.


def editor(request):
    with open(settings.BASE_DIR / "code.txt", "r") as file:
        code = file.read()

    return render(request, template_name="editor/editor.html", context={"code": code})


@csrf_exempt
def save(request):
    if request.method == "POST":
        post_data = json.loads(request.body)
        code = post_data["code"]

        if code is not None:
            with open(settings.BASE_DIR / "code.txt", "w") as file:
                file.write(code)

    return HttpResponse("based")
