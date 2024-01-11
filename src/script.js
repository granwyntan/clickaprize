document.addEventListener("DOMContentLoaded", function () {
  ("use strict");

  const audio = new Audio("./audio/slot-machine-sound.wav");
  const audio2 = new Audio("./audio/win.wav");

  var last = [];

  const items = [
    "📚", // Books
    "🎒", // Backpack
    "📝", // Post-it
    "🖍️", // Crayon
    "📏", // Straight Ruler
    "📐", // Triangular Ruler
    "✏️", // Pencil
    "📓", // Notebook
    "📘", // Blue Book
    "📖", // Open Book
    "📎", // Paperclip
    "📁", // File Folder
    "📅", // Calendar
    "🎓", // Graduation Cap
  ];

  // document.querySelector(".info").textContent = items.join(" ");

  const reels = document.querySelectorAll(".reel");
  document.querySelector("#spinner").addEventListener("click", spin);
  document.querySelector("#machine").addEventListener("click", spincheck);
  document.querySelector("#editor").addEventListener("click", edit);
  document.querySelector("#close").addEventListener("click", close);
  document.querySelector("#cancel").addEventListener("click", close);
  document.querySelector("#reseter").addEventListener("click", init);

  var modal = document.getElementById("modal");

  function edit() {
    modal.classList.remove("hidden");
  }

  function close() {
    modal.classList.add("hidden");
  }

  function save() {}

  let spun = false;

  function resetButton() {
    let x = document.querySelector("#reseter");
    if (spun) {
      x.addEventListener("click", init);
      x.disabled = false;
      x.classList.add("hover:bg-blue-700");
      x.classList.remove("cursor-not-allowed");
      x.classList.remove("opacity-50");
    } else {
      x.removeEventListener("click", init);
      x.disabled = true;
      x.classList.remove("hover:bg-blue-700");
      x.classList.add("cursor-not-allowed");
      x.classList.add("opacity-50");
    }
  }

  function spincheck() {
    if (spun) {
      init();
      spun = false;
    } else {
      spin();
    }
    resetButton();
  }
  async function spin() {
    spun = true;
    resetButton();
    init(false, 1, 2);
    for (const reel of reels) {
      const boxes = reel.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => {
        setTimeout(resolve, duration * 100);
      });
    }
  }

  function init(firstInit = true, groups = 1, duration = 1) {
    audio.pause();
    audio.currentTime = 0;
    var current = -1;
    last = [];
    for (const reel of reels) {
      current += 1;
      var pool = [];

      const boxes = reel.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);
      if (firstInit) {
        reel.dataset.spinned = "0";
        pool = ["❓"];
        spun = false;
        resetButton();
      } else {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));
        pool.splice(0, 0, [last[current]]);
        last.push(pool.slice(-1));

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            audio.play();
            reel.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              audio.pause();
              audio.currentTime = 0;
              if (index > 0) {
                this.removeChild(box);
              }
              if (current == 2) {
                check(last);
                current = -1;
              }
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = reel.clientWidth + "px";
        box.style.height = reel.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        reel.clientHeight * (pool.length - 1)
      }px)`;
      reel.replaceChild(boxesClone, boxes);
    }
  }

  function check(elements) {
    if (elements[0][0] == elements[1][0] && elements[0][0] == elements[2][0]) {
      audio2.play();
      alert(`Congrats!!! You won a ${elements[0][0]}`);
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init();

  resetButton();
});
