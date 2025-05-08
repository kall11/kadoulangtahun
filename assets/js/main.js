(() => {
  const line1El = document.getElementById("line1");
  const line2El = document.getElementById("line2");
  const progressFillEl = document.getElementById("progress-fill");
  const progressBarEl = document.getElementById("progress-bar");
  const smileTextEl = document.getElementById("smile-text");

  const textStages = [
    ["PREPARING BIRTHDAY","SURPRISE..."],
    ["LOADING","GIFTS..."],
    ["WRAPPING","PRESENTS..."],
    ["GETTING READY","TO CELEBRATE..."],
    ["ALMOST","DONE..."]
  ];

  let progress = 0;
  const maxProgress = 100;
  const intervalTime = 50;
  const increment = 1;

  function updateText(progress) {
    let index = 0;
    if (progress >= 100) index = 4;
    else if (progress >= 90) index = 3;
    else if (progress >= 60) index = 2;
    else if (progress >= 30) index = 1;
    line1El.textContent = textStages[index][0];
    line2El.textContent = textStages[index][1];
  }

  function updateProgress(progress) {
    progressFillEl.style.width = progress + "%";
    progressFillEl.textContent = progress + "%";
    progressBarEl.setAttribute("aria-valuenow", progress);
    if (progress === 100) {
      progressFillEl.classList.add("full");
      smileTextEl.classList.add("visible");
      smileTextEl.setAttribute("tabindex", "0");
    } else {
      progressFillEl.classList.remove("full");
      smileTextEl.classList.remove("visible");
      smileTextEl.removeAttribute("tabindex");
    }
  }

  function animate() {
    if (progress <= maxProgress) {
      updateText(progress);
      updateProgress(progress);
      progress += increment;
      setTimeout(animate, intervalTime);
    }
  }

  smileTextEl.addEventListener("click", () => {
    if (progress === 101) return;
    if (progress >= 100) {
      window.location.href = "./pages/consol/index.html"; // Changed to consol.html
    }
  });

  smileTextEl.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && progress >= 100) {
      e.preventDefault();
      window.location.href = "./pages/consol/index.html";// Changed to consol.html
    }
  });

  animate();
})();