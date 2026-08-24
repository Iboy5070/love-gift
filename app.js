const C = window.LOVE;
const screens = ["lock", "meter", "bouquet", "photos", "gifts", "timeline", "letter"];
let openedGifts = new Set();

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function show(name) {
  document.querySelectorAll(".screen").forEach((s) => {
    const on = s.dataset.screen === name;
    s.classList.toggle("active", on);
    s.hidden = !on;
  });
}

function nextOf(name) {
  const i = screens.indexOf(name);
  if (i >= 0 && i < screens.length - 1) show(screens[i + 1]);
}

function faceSvg(mood) {
  const mouths = {
    sad: '<path d="M36 62c8 6 20 6 28 0" fill="none" stroke="#4a2430" stroke-width="3" stroke-linecap="round"/>',
    mid: '<path d="M38 64h24" fill="none" stroke="#4a2430" stroke-width="3" stroke-linecap="round"/>',
    high: '<path d="M34 58c8 14 24 14 32 0" fill="none" stroke="#4a2430" stroke-width="3" stroke-linecap="round"/>',
    win: '<path d="M34 56c8 16 24 16 32 0" fill="none" stroke="#4a2430" stroke-width="3"/><circle cx="50" cy="62" r="5" fill="#ff8aa0"/>',
  };
  const tears = mood === "sad"
    ? '<path d="M28 48c0 8-6 12-3 18" fill="none" stroke="#7eb6ff" stroke-width="3"/><path d="M72 48c0 8 6 12 3 18" fill="none" stroke="#7eb6ff" stroke-width="3"/>'
    : "";
  return `<svg class="face" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="#fff"/>
    <circle cx="38" cy="44" r="4" fill="#4a2430"/>
    <circle cx="62" cy="44" r="4" fill="#4a2430"/>
    <circle cx="34" cy="52" r="5" fill="#ffc1cf"/>
    <circle cx="66" cy="52" r="5" fill="#ffc1cf"/>
    ${mouths[mood] || mouths.mid}
    ${tears}
  </svg>`;
}

function meterSvg() {
  return `<svg class="meter-svg" viewBox="0 0 280 170" aria-hidden="true">
    <path d="M30 140 A110 110 0 0 1 250 140" fill="none" stroke="#ffd0dc" stroke-width="22" stroke-linecap="round"/>
    <path d="M30 140 A110 110 0 0 1 74 58" fill="none" stroke="#ffd6e0" stroke-width="22" stroke-linecap="round"/>
    <path d="M74 58 A110 110 0 0 1 140 40" fill="none" stroke="#ff9eb3" stroke-width="22"/>
    <path d="M140 40 A110 110 0 0 1 206 58" fill="none" stroke="#f26b88" stroke-width="22"/>
    <path d="M206 58 A110 110 0 0 1 250 140" fill="none" stroke="#c43d5c" stroke-width="22" stroke-linecap="round"/>
    <text class="love-word" x="140" y="118" text-anchor="middle">love</text>
    <g id="needle">
      <line x1="140" y1="140" x2="140" y2="58" stroke="#c43d5c" stroke-width="3"/>
      <circle cx="140" cy="140" r="7" fill="#c43d5c"/>
    </g>
  </svg>`;
}

function rosesSvg() {
  return `<svg class="rose-bunch" viewBox="0 0 140 160">
    <path d="M70 70 C70 120 40 150 40 150 M70 80 C80 130 100 150 110 155" stroke="#3d8b5a" stroke-width="4" fill="none"/>
    <circle cx="58" cy="52" r="18" fill="#e23b55"/>
    <circle cx="80" cy="46" r="16" fill="#c43d5c"/>
    <circle cx="70" cy="62" r="15" fill="#ff5d78"/>
    <path d="M40 150 h20 v8 h-20z" fill="#fff"/><path d="M46 150 v-6 h8 v6" fill="#e85a7a"/>
  </svg>`;
}

function boxSvg() {
  return `<svg class="box-svg" viewBox="0 0 80 86">
    <rect x="10" y="34" width="60" height="42" rx="6" fill="#b9e0ff"/>
    <rect x="8" y="22" width="64" height="16" rx="5" fill="#ff9eb8"/>
    <rect x="36" y="22" width="8" height="54" fill="#ff7a9a"/>
    <ellipse cx="40" cy="22" rx="14" ry="10" fill="#ff7a9a"/>
  </svg>`;
}

function renderLock() {
  const root = document.getElementById("screen-lock");
  root.innerHTML = "";
  root.append(
    el(`<h1 class="en-title">${C.lock.heading}</h1>`),
    el(`<p class="lo">${C.lock.body}</p>`),
    el(`<div class="card" style="text-align:center">${faceSvg("mid")}<p class="hint">For ${C.herName}</p></div>`),
    el(`<button class="btn" type="button" id="lockBtn">${C.lock.button}</button>`)
  );
  root.querySelector("#lockBtn").onclick = () => nextOf("lock");
}

function moodFor(n) {
  if (n >= 100) return "win";
  if (n >= 72) return "high";
  if (n >= 30) return "mid";
  return "sad";
}

function renderMeter() {
  const root = document.getElementById("screen-meter");
  root.innerHTML = "";
  root.append(
    el(`<h1 class="en-title">${C.meter.heading}</h1>`),
    el(`<p class="lo">${C.meter.question}</p>`),
    el(`<div id="faceSlot">${faceSvg("sad")}</div>`),
    el(`<p class="en" id="meterEn">${C.meter.low.en}</p>`),
    el(`<p class="lo" id="meterLo">${C.meter.low.lo}</p>`),
    el(`<p class="pct" id="meterPct">0%</p>`),
    el(meterSvg()),
    el(`<input id="loveRange" type="range" min="0" max="100" value="0" />`),
    el(`<button class="btn" type="button" id="meterNext" disabled>${C.meter.next}</button>`)
  );

  const range = root.querySelector("#loveRange");
  const needle = root.querySelector("#needle");
  const next = root.querySelector("#meterNext");

  const update = () => {
    const n = Number(range.value);
    const mood = moodFor(n);
    const copy = mood === "win" ? C.meter.win : mood === "high" ? C.meter.high : mood === "mid" ? C.meter.mid : C.meter.low;
    root.querySelector("#faceSlot").innerHTML = faceSvg(mood);
    root.querySelector("#meterEn").textContent = copy.en;
    root.querySelector("#meterLo").textContent = copy.lo;
    root.querySelector("#meterPct").textContent = n + "%";
    const angle = -90 + (n / 100) * 180;
    needle.setAttribute("transform", `rotate(${angle} 140 140)`);
    next.disabled = n < 100;
  };
  range.addEventListener("input", update);
  next.onclick = () => nextOf("meter");
  update();
}

function renderBouquet() {
  const root = document.getElementById("screen-bouquet");
  root.innerHTML = "";
  const wrap = el(`<div class="bouquet-wrap">${rosesSvg()}</div>`);
  C.bouquet.lines.forEach((line, i) => {
    wrap.appendChild(el(
      `<div class="bubble b${i}"><p class="en">${line.en}</p><p class="lo">${line.lo}</p></div>`
    ));
  });
  root.append(
    el(`<h1 class="en-title">${C.bouquet.heading}</h1>`),
    wrap,
    el(`<button class="btn" type="button" id="bqNext">${C.bouquet.next}</button>`)
  );
  root.querySelector("#bqNext").onclick = () => nextOf("bouquet");
}

function renderPhotos() {
  const root = document.getElementById("screen-photos");
  const yt = C.youtubeUrl;
  const audio = C.audioSrc;
  let media = `<p class="hint">Add youtubeUrl or audioSrc in config.js</p>`;
  if (yt) {
    const id = (yt.match(/[?&]v=([^&]+)/) || yt.match(/youtu\.be\/([^?]+)/) || [])[1];
    if (id) media = `<iframe src="https://www.youtube.com/embed/${id}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  } else if (audio) {
    media = `<audio controls src="${audio}"></audio>`;
  }
  root.innerHTML = "";
  root.append(
    el(`<h1 class="en-title">${C.photos.heading}</h1>`),
    el(`<div class="polaroid"><img src="photos/us.jpg" alt="us" /></div>`),
    el(`<p class="lo">${C.photos.caption}</p>`),
    el(`<div class="player"><strong>${C.songTitle}</strong><span>${C.songArtist}</span>${media}</div>`),
    el(`<button class="btn" type="button" id="phNext">${C.photos.next}</button>`)
  );
  root.querySelector("#phNext").onclick = () => nextOf("photos");
}

function renderGifts() {
  const root = document.getElementById("screen-gifts");
  root.innerHTML = "";
  const row = el(`<div class="gifts"></div>`);
  C.gifts.boxes.forEach((box, i) => {
    const b = el(`<button class="gift" type="button" data-i="${i}">${boxSvg()}<span>${box.title}</span></button>`);
    b.onclick = () => openGift(i, b);
    row.appendChild(b);
  });
  root.append(
    el(`<h1 class="en-title">${C.gifts.heading}</h1>`),
    el(`<p class="lo">${C.gifts.sub}</p>`),
    row,
    el(`<button class="btn" type="button" id="gfNext" disabled>${C.gifts.next}</button>`)
  );
  root.querySelector("#gfNext").onclick = () => nextOf("gifts");
}

function openGift(i, btn) {
  openedGifts.add(i);
  btn.classList.add("opened");
  const box = C.gifts.boxes[i];
  document.getElementById("giftEn").textContent = box.en;
  document.getElementById("giftLo").textContent = box.lo;
  document.getElementById("giftModal").classList.remove("hidden");
  const next = document.getElementById("gfNext");
  if (next) next.disabled = openedGifts.size < C.gifts.boxes.length;
}

function renderTimeline() {
  const root = document.getElementById("screen-timeline");
  root.innerHTML = "";
  const list = el(`<div class="timeline"></div>`);
  C.timeline.items.forEach((item) => {
    list.appendChild(el(
      `<article class="mem"><img src="${item.photo}" alt="" /><div><p class="date en">${item.date}</p><p class="en">${item.en}</p><p class="lo">${item.lo}</p></div></article>`
    ));
  });
  root.append(
    el(`<h1 class="en-title">${C.timeline.heading}</h1>`),
    el(`<p class="lo">${C.timeline.sub}</p>`),
    list,
    el(`<button class="btn" type="button" id="tlNext">${C.timeline.next}</button>`)
  );
  root.querySelector("#tlNext").onclick = () => nextOf("timeline");
}

function renderLetter() {
  const root = document.getElementById("screen-letter");
  const paras = C.letter.bodyLo.map((p) => `<p class="lo">${p}</p>`).join("");
  root.innerHTML = "";
  root.append(
    el(`<h1 class="en-title">${C.letter.heading}</h1>`),
    el(`<div class="letter-paper">${paras}<p class="en">${C.letter.bodyEn}</p><p class="sign">${C.letter.signoff}</p><p class="lo">${C.myName} → ${C.herName}</p></div>`)
  );
}

function spawnHearts() {
  const host = document.getElementById("floatHearts");
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "fh";
    s.textContent = i % 2 ? "♥" : "♡";
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 12 + Math.random() * 18 + "px";
    s.style.animationDuration = 8 + Math.random() * 8 + "s";
    s.style.animationDelay = Math.random() * 6 + "s";
    host.appendChild(s);
  }
}

document.getElementById("giftClose").onclick = () => {
  document.getElementById("giftModal").classList.add("hidden");
};

renderLock();
renderMeter();
renderBouquet();
renderPhotos();
renderGifts();
renderTimeline();
renderLetter();
spawnHearts();
