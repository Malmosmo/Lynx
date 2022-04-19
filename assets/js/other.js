let RES;
let saveBtn = document.querySelector("#save");
saveBtn.addEventListener("click", () => {
    let data = { code: editor.getValue() };
    let url = saveBtn.getAttribute("url");

    fetch(url, {
        method: "POST",
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)

    }).then(res => {
        console.log("Request complete! response:", res);
        RES = res;
    });
})