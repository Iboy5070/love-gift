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
    sad: '<path d="M40 68c6 5 14 5 20 0" fill="none" stroke="#5a3040" stroke-width="2.4" stroke-linecap="round"/>',
    mid: '<path d="M42 68h16" fill="none" stroke="#5a3040" stroke-width="2.6" stroke-linecap="round"/>',
    high: '<path d="M38 64c7 12 17 12 24 0" fill="none" stroke="#5a3040" stroke-width="2.4" stroke-linecap="round"/>',
    win: '<ellipse cx="50" cy="70" rx="8" ry="6" fill="#ff8aa8"/><path d="M38 62c7 14 17 14 24 0" fill="none" stroke="#5a3040" stroke-width="2.4"/>',
  };
  const tears = mood === "sad"
    ? '<ellipse cx="30" cy="62" rx="3" ry="6" fill="#8ec8ff"/><ellipse cx="70" cy="62" rx="3" ry="6" fill="#8ec8ff"/>'
    : "";
  const spark = mood === "win" || mood === "high"
    ? '<path d="M16 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ffd36a"/><path d="M84 24l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#ffd36a"/>'
    : "";
  return `<svg class="face face-${mood}" viewBox="0 0 100 110" aria-hidden="true">
    <ellipse cx="28" cy="28" rx="12" ry="16" fill="#fff6f8" stroke="#5a3040" stroke-width="2.2"/>
    <ellipse cx="72" cy="28" rx="12" ry="16" fill="#fff6f8" stroke="#5a3040" stroke-width="2.2"/>
    <ellipse cx="28" cy="30" rx="7" ry="10" fill="#ffb7c8"/>
    <ellipse cx="72" cy="30" rx="7" ry="10" fill="#ffb7c8"/>
    <circle cx="50" cy="58" r="36" fill="#fff6f8" stroke="#5a3040" stroke-width="2.4"/>
    <ellipse cx="38" cy="56" rx="7" ry="9" fill="#fff"/>
    <ellipse cx="62" cy="56" rx="7" ry="9" fill="#fff"/>
    <circle cx="39" cy="57" r="4.2" fill="#3a2230"/>
    <circle cx="63" cy="57" r="4.2" fill="#3a2230"/>
    <circle cx="40.5" cy="55.2" r="1.4" fill="#fff"/>
    <circle cx="64.5" cy="55.2" r="1.4" fill="#fff"/>
    <ellipse cx="32" cy="66" rx="7" ry="4.5" fill="#ffc3d4"/>
    <ellipse cx="68" cy="66" rx="7" ry="4.5" fill="#ffc3d4"/>
    ${mouths[mood] || mouths.mid}
    ${tears}
    ${spark}
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
  return `<svg class="rose-bunch" viewBox="0 0 160 180">
    <path d="M80 78c-4 30-28 62-36 72M80 86c8 34 28 58 40 68" stroke="#4ea36a" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="52" cy="118" rx="10" ry="6" fill="#6dcb86" transform="rotate(-30 52 118)"/>
    <ellipse cx="112" cy="122" rx="10" ry="6" fill="#6dcb86" transform="rotate(28 112 122)"/>
    <circle cx="68" cy="58" r="20" fill="#ff4d73"/>
    <circle cx="92" cy="50" r="18" fill="#e23b5c"/>
    <circle cx="84" cy="70" r="17" fill="#ff7a96"/>
    <circle cx="78" cy="54" r="8" fill="#ffd0da"/>
    <path d="M44 154h24v10h-24z" fill="#fff"/><path d="M52 148h8v16h-8z" fill="#ff6b8a"/>
  </svg>`;
}

function boxSvg() {
  return `<svg class="box-svg" viewBox="0 0 90 100">
    <rect x="12" y="40" width="66" height="46" rx="8" fill="#c9ecff"/>
    <rect x="10" y="28" width="70" height="18" rx="7" fill="#ff9ec0"/>
    <rect x="40" y="28" width="10" height="58" fill="#ff7aa8"/>
    <ellipse cx="45" cy="26" rx="16" ry="11" fill="#ff7aa8"/>
    <ellipse cx="38" cy="22" rx="8" ry="6" fill="#ffd0e0"/>
    <circle cx="72" cy="22" r="5" fill="#ffd36a"/>
  </svg>`;
}

function decoStickers() {
  return `<div class="stickers" aria-hidden="true">
    <span class="st st-star">✦</span>
    <span class="st st-heart">♡</span>
    <span class="st st-plane">✈</span>
    <span class="st st-bow">🎀</span>
  </div>`;
}

function renderLock() {
  const root = document.getElementById("screen-lock");
  root.innerHTML = "";
  root.append(
    el(`<p class="kicker">a little gift</p>`),
    el(`<h1 class="en-title pretty">${C.lock.heading}</h1>`),
    el(`<p class="lo">${C.lock.body}</p>`),
    el(`<div class="card cute" style="text-align:center">${decoStickers()}${faceSvg("high")}<p class="for-name">For ${C.herName}</p><p class="hint">tap when you are ready ♡</p></div>`),
    el(`<button class="btn" type="button" id="lockBtn">♡  ${C.lock.button}</button>`)
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
    el(`<h1 class="en-title pretty">${C.meter.heading}</h1>`),
    el(`<p class="lo">${C.meter.question}</p>`),
    el(`<div id="faceSlot">${faceSvg("sad")}</div>`),
    el(`<p class="en" id="meterEn">${C.meter.low.en}</p>`),
    el(`<p class="lo" id="meterLo">${C.meter.low.lo}</p>`),
    el(`<p class="pct" id="meterPct">0%</p>`),
    el(meterSvg()),
    el(`<input id="loveRange" type="range" min="0" max="100" value="0" />`),
    el(`<button class="btn" type="button" id="meterNext" disabled>♡  ${C.meter.next}</button>`)
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
    el(`<h1 class="en-title pretty">${C.bouquet.heading}</h1>`),
    wrap,
    el(`<button class="btn" type="button" id="bqNext">♡  ${C.bouquet.next}</button>`)
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
    el(`<h1 class="en-title pretty">${C.photos.heading}</h1>`),
    el(`<div class="polaroid"><img src="photos/us.jpg" alt="us" /></div>`),
    el(`<p class="lo">${C.photos.caption}</p>`),
    el(`<div class="player"><strong>${C.songTitle}</strong><span>${C.songArtist}</span>${media}</div>`),
    el(`<button class="btn" type="button" id="phNext">♡  ${C.photos.next}</button>`)
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
    el(`<h1 class="en-title pretty">${C.gifts.heading}</h1>`),
    el(`<p class="lo">${C.gifts.sub}</p>`),
    row,
    el(`<button class="btn" type="button" id="gfNext" disabled>♡  ${C.gifts.next}</button>`)
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
    el(`<h1 class="en-title pretty">${C.timeline.heading}</h1>`),
    el(`<p class="lo">${C.timeline.sub}</p>`),
    list,
    el(`<button class="btn" type="button" id="tlNext">♡  ${C.timeline.next}</button>`)
  );
  root.querySelector("#tlNext").onclick = () => nextOf("timeline");
}

function renderLetter() {
  const root = document.getElementById("screen-letter");
  const paras = C.letter.bodyLo.map((p) => `<p class="lo">${p}</p>`).join("");
  root.innerHTML = "";
  root.append(
    el(`<h1 class="en-title pretty">${C.letter.heading}</h1>`),
    el(`<div class="letter-paper">${faceSvg("win")}${paras}<p class="en">${C.letter.bodyEn}</p><p class="sign">${C.letter.signoff}</p><p class="lo">${C.myName} → ${C.herName} ♡</p></div>`)
  );
}

function spawnHearts() {
  const host = document.getElementById("floatHearts");
  for (let i = 0; i < 22; i++) {
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
