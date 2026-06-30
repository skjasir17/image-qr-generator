const text = "Shaikh Jasir";
const typing = document.getElementById("typing");

let i = 0;

function typeWriter() {
    if (i < text.length) {
        typing.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(typeWriter, 200);
});
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loader");
const result = document.getElementById("result");
const qrCanvas = document.getElementById("qrCanvas");
const downloadBtn = document.getElementById("downloadBtn");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");

// Browse Button
browseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    imageInput.click();
});

// Drag Over
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
});

// Drag Leave
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

// Drop Image
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if (!file) return;

    imageInput.files = e.dataTransfer.files;

    imageInput.dispatchEvent(new Event("change"));
});

let imageFile = null;
const cameraBtn = document.getElementById("cameraBtn");
const cameraInput = document.getElementById("cameraInput");

cameraBtn.addEventListener("click", () => {
    cameraInput.click();
});

cameraInput.addEventListener("change", (e) => {
    imageInput.files = e.target.files;
    imageInput.dispatchEvent(new Event("change"));
});


// Preview Image
imageInput.addEventListener("change", () => {

    imageFile = imageInput.files[0];

    if (!imageFile) return;

    // Max 20MB
    if (imageFile.size > 20 * 1024 * 1024) {
        alert("Maximum file size is 20 MB.");
        imageInput.value = "";
        return;
    }

    // File type validation
    const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    ];

    if (!allowed.includes(imageFile.type)) {
        alert("Only JPG, PNG and WEBP images are allowed.");
        imageInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        previewImage.src = e.target.result;
    };

    reader.readAsDataURL(imageFile);

});

// Generate QR
generateBtn.addEventListener("click", async () => {

    if (!imageFile) {
        alert("Please upload an image first.");
        return;
    }

    loading.classList.remove("hidden");
    result.classList.add("hidden");

    const formData = new FormData();

    formData.append("file", imageFile);
    formData.append("upload_preset", "imageqr_upload");

    try {

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/wjshpidh/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        loading.classList.add("hidden");

        if (!data.secure_url) {
            alert("Upload failed.");
            console.log(data);
            return;
        }

        result.classList.remove("hidden");

        QRCode.toCanvas(qrCanvas, data.secure_url, {
            width: 250,
            margin: 2
        });

    } catch (error) {

        loading.classList.add("hidden");

        console.error(error);

        alert("Something went wrong.");

    }

});

// Download QR
downloadBtn.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "image-qr.png";

    link.href = qrCanvas.toDataURL("image/png");

    link.click();

});