const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frame = new Image();
frame.src = "frame.png"; // অবশ্যই local folder এ frame.png থাকবে

let img = new Image();
let scale = 1;
let x = 0;
let y = 0;
let dragging = false;
let startX, startY;

// ==================== Upload image ====================
upload.addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;

        img.onload = function() {
            // Scale and center image
            scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            x = (canvas.width - img.width * scale) / 2;
            y = (canvas.height - img.height * scale) / 2;
            draw();
        };
    };
    reader.readAsDataURL(file);
});

// ==================== Draw function ====================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(img.src) {
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

// ==================== Drag functionality ====================
canvas.addEventListener("mousedown", e => {
    dragging = true;
    startX = e.offsetX - x;
    startY = e.offsetY - y;
});

canvas.addEventListener("mousemove", e => {
    if (dragging) {
        x = e.offsetX - startX;
        y = e.offsetY - startY;
        draw();
    }
});

canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseleave", () => dragging = false);

// ==================== Zoom ====================
canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const zoom = e.deltaY < 0 ? 1.05 : 0.95;
    scale *= zoom;
    draw();
});

// ==================== Download ====================
function downloadImage() {
    if (!img.src) {
        alert("দয়া করে আগে ছবি আপলোড করুন।");
        return;
    }

    // Step 1: Create new temporary link
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "campaign-profile.png";

    // Step 2: Click link programmatically
    document.body.appendChild(link);
    link.click();

    // Step 3: Remove link immediately
    document.body.removeChild(link);
}
