document.getElementById("uploadForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const message = document.getElementById("message");

    fetch("upload.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(text => {
        if (text.trim() === "success") {
            message.textContent = "Upload successful!";
            setTimeout(() => location.reload(), 1000);
        } else {
            message.textContent = text;
        }
    })
    .catch(err => {
        message.textContent = "Error uploading image.";
    });
});
