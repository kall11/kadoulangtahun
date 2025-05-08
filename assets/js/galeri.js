const photos = [
  {
    id: "#1",
    type: "img",
    src: "../../../assets/images/consol/gallery/photo1.jpg",
    alt: "Foto kenangan 1",
    width: 160,
    height: 270
  },
  {
    id: "#2",
    type: "img",
    src: "../../../assets/images/consol/gallery/photo2.jpg",
    alt: "Foto kenangan 2", 
    width: 160,
    height: 270
  },
  {
    id: "#3",
    type: "img",
    src: "../../../assets/images/consol/gallery/photo3.jpg",
    alt: "Foto kenangan 3",
    width: 160,
    height: 270
  },
  {
    id: "#4", 
    type: "img",
    src: "../../../assets/images/consol/gallery/photo4.jpg",
    alt: "Foto kenangan 4",
    width: 160,
    height: 270
  },
  {
    id: "#Video",
    type: "video",
    src: "../../../assets/images/consol/gallery/video-dump.mp4",
    alt: "Video kenangan",
    width: 160,
    height: 270
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById("start-print-btn");
  const readyText = document.getElementById("ready-text");
  const galleryContent = document.getElementById("gallery-content");
  const photobox = document.getElementById("photobox");
  const container = document.getElementById("container");

  startBtn.addEventListener("click", () => {
    readyText.classList.add("hidden");
    startBtn.classList.add("hidden");
    galleryContent.innerHTML = "";
    galleryContent.classList.remove("hidden");

    // Hitung tinggi container
    const photoHeight = 270 + 14;
    const otherElementsHeight = 4*14 + 3*40 + 40 + 80;
    const totalHeight = photoHeight * photos.length + otherElementsHeight;

    // Animasi perubahan tinggi
    container.style.height = `${totalHeight}px`;
    photobox.style.maxHeight = "none";
    photobox.style.overflowY = "visible";

    // Buat elemen untuk setiap foto/video
    photos.forEach((photo, index) => {
      const frame = document.createElement("div");
      frame.className = "photobox-frame";
      frame.style.width = `${photo.width}px`;
      frame.style.height = `${photo.height}px`;
      frame.style.animation = `printIn 0.5s ease forwards ${index * 0.3}s`;

      const number = document.createElement("span");
      number.className = "photobox-number";
      number.textContent = photo.id;
      frame.appendChild(number);

      if (photo.type === "img") {
        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt;
        img.width = photo.width - 20;
        img.height = photo.height - 40;
        img.loading = "lazy";
        frame.appendChild(img);
      } else if (photo.type === "video") {
        const video = document.createElement("video");
        video.controls = true;
        video.width = photo.width - 20;
        video.height = photo.height - 40;
        const source = document.createElement("source");
        source.src = photo.src;
        source.type = "video/mp4";
        video.appendChild(source);
        frame.appendChild(video);
      }

      galleryContent.appendChild(frame);
    });
  });
});