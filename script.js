const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const princess = document.getElementById("princess");
const afterMessage = document.getElementById("afterMessage");
const baroLayer = document.getElementById("baroLayer");

// 랜덤 위치 "바로" 생성
for (let i = 0; i < 40; i++) {
  const span = document.createElement("span");
  span.textContent = "바로";
  span.style.left = Math.random() * window.innerWidth + "px";
  span.style.top = Math.random() * window.innerHeight + "px";
  span.style.fontSize = Math.random() * 20 + 10 + "px";
  span.style.transform = `rotate(${Math.random() * 360}deg)`;
  baroLayer.appendChild(span);
}

// 긁기 구현
let isDrawing = false;
canvas.addEventListener("mousedown", () => (isDrawing = true));
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mousemove", scratch);

canvas.addEventListener("touchstart", () => (isDrawing = true));
canvas.addEventListener("touchend", () => (isDrawing = false));
canvas.addEventListener("touchmove", scratch);

ctx.fillStyle = "#999";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 긁기
function scratch(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches[0].clientX) - rect.left;
  const y = (e.clientY || e.touches[0].clientY) - rect.top;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.fill();

  // 긁은 비율 체크
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let clearCount = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) clearCount++;
  }
  const percent = clearCount / (canvas.width * canvas.height) * 100;
  if (percent > 40) revealPrincess();
}

function revealPrincess() {
  canvas.style.display = "none";
  princess.style.display = "block";

  const positions = [
    { top: 10, left: 10 },
    { top: 10, right: 10 },
    { bottom: 10, left: 10 },
    { bottom: 10, right: 10 },
  ];
  const pos = positions[Math.floor(Math.random() * 4)];
  Object.assign(princess.style, pos);

  // "바로" 제거
  baroLayer.innerHTML = "";

  // 폭죽
  launchConfetti();

  // 메시지
  afterMessage.style.display = "block";
}

// 폭죽 (간단한 예시)
function launchConfetti() {
  const confetti = document.getElementById("confetti");
  for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "5px";
    div.style.height = "5px";
    div.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    div.style.left = Math.random() * window.innerWidth + "px";
    div.style.top = Math.random() * window.innerHeight + "px";
    div.style.animation = `explode 1s ease-out forwards`;
    confetti.appendChild(div);
  }
  setTimeout(() => (confetti.innerHTML = ""), 2000);
}