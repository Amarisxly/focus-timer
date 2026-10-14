(() => {
  "use strict";

  // ---------------------------------------------------------------
  // icons (small inline SVGs, stroke = currentColor)
  // ---------------------------------------------------------------
  const ICONS = {
    study:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v13"/><path d="M4 5c1.6-1 4-1 6 0 1.4.7 2 2 2 2v11s-.6-1.3-2-2c-2-1-4.4-1-6 0z"/><path d="M20 5c-1.6-1-4-1-6 0-1.4.7-2 2-2 2v11s.6-1.3 2-2c2-1 4.4-1 6 0z"/></svg>',
    reading:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4H18a2 2 0 0 1 2 2v13.5a1 1 0 0 1-1.5.87A4.4 4.4 0 0 0 16 20H6.5A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4z"/><path d="M8 8h9M8 12h9"/></svg>',
    meditation:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.1"/><path d="M12 4.2c1.4 1.6 1.4 4 0 5.4-1.4-1.6-1.4-4 0-5.4z"/><path d="M12 19.8c1.4-1.6 1.4-4 0-5.4-1.4 1.6-1.4 4 0 5.4z"/><path d="M4.2 12c1.6-1.4 4-1.4 5.4 0-1.6 1.4-4 1.4-5.4 0z"/><path d="M19.8 12c-1.6-1.4-4-1.4-5.4 0 1.6 1.4 4 1.4 5.4 0z"/></svg>',
    music:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    writing:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    break:
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v3M10 2v3M14 2v3"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="none"><path d="M8 5v14l12-7z"/></svg>',
    pause:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    xSmall:
      '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };

  const LABELS = [
    { id: "study", name: "Study" },
    { id: "reading", name: "Reading" },
    { id: "meditation", name: "Meditation" },
    { id: "music", name: "Music" },
    { id: "writing", name: "Writing" },
    { id: "break", name: "Break" },
  ];
  const labelById = (id) => LABELS.find((l) => l.id === id) || LABELS[0];
  const DURATIONS = [15, 25, 45, 60];

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };
  const fmtClock = (d) =>
    [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => n.toString().padStart(2, "0")).join(":");

  let idCounter = 1;
  const nextId = () => idCounter++;

  // ---------------------------------------------------------------
  // state
  // ---------------------------------------------------------------
  const state = {
    view: "home", // 'home' | 'focus'
    menuOpen: false,
    showQueue: false,
    activeLabel: "study",
    durationMin: 25,
    remaining: 25 * 60,
    running: false,
    done: false,
    queue: [
      { id: nextId(), label: "reading", minutes: 15 },
      { id: nextId(), label: "meditation", minutes: 10 },
      { id: nextId(), label: "music", minutes: 30 },
    ],
    adding: false,
    draftLabel: "study",
    draftMinutes: 25,
  };

  // ---------------------------------------------------------------
  // dom refs
  // ---------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  const homeInner = $("homeInner");
  const clockShift = $("clockShift");
  const clockWrap = $("clockWrap");
  const clockText = $("clockText");
  const menuEl = $("menu");

  const focusScreen = $("focus");
  const focusLabel = $("focusLabel");
  const activeIcon = $("activeIcon");
  const activeName = $("activeName");
  const ringProgress = $("ringProgress");
  const timeDisplay = $("timeDisplay");
  const statusText = $("statusText");
  const minusBtn = $("minusBtn");
  const plusBtn = $("plusBtn");
  const durationText = $("durationText");
  const resetBtn = $("resetBtn");
  const playBtn = $("playBtn");
  const backBtn = $("backBtn");
  const queueBtn = $("queueBtn");
  const queuePanel = $("queuePanel");
  const addBtn = $("addBtn");
  const addForm = $("addForm");
  const queueList = $("queueList");

  const R = 120;
  const C = 2 * Math.PI * R;
  ringProgress.style.strokeDasharray = `${C}`;

  // ---------------------------------------------------------------
  // menu (built once)
  // ---------------------------------------------------------------
  LABELS.forEach((l) => {
    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.innerHTML = `${ICONS[l.id]}<span>${l.name}</span>`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openFocus(l.id);
    });
    menuEl.appendChild(btn);
  });

  // ---------------------------------------------------------------
  // clock: live update + autosize to 92% of container width
  // ---------------------------------------------------------------
  function tickClock() {
    clockText.textContent = fmtClock(new Date());
  }
  // Invisible side-bearings of the digits (px at 100px font size). The ink width is the
  // rendered text box minus these, so the screen margin is measured to the glyph edges.
  let inkCtx = null;
  function sideBearingsAt100() {
    try {
      if (!inkCtx) inkCtx = document.createElement("canvas").getContext("2d");
      const cs = getComputedStyle(clockText);
      inkCtx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
      const hasLS = "letterSpacing" in inkCtx;
      if (hasLS) inkCtx.letterSpacing = "4px"; // 0.04em at 100px
      const m = inkCtx.measureText("00:00:00");
      const advance = hasLS ? m.width : m.width + 8 * 4;
      const left = -m.actualBoundingBoxLeft;                 // gap before the first glyph's ink
      const right = advance - m.actualBoundingBoxRight;      // gap after the last glyph's ink (incl. trailing spacing)
      const total = left + right;
      return total > 0 && total < 40 ? total : 0;            // sanity range; 0 = ignore
    } catch (e) {
      return 0;
    }
  }
  function fitClock() {
    const BASE = 100;
    // clockWrap is already inset by the screen margin (padding on .home-inner, 15% per side),
    // so the digits are scaled to fill it completely
    const targetWidth = clockWrap.clientWidth;
    const prev = clockText.style.fontSize;
    clockText.style.fontSize = `${BASE}px`;
    const measured = clockText.scrollWidth - sideBearingsAt100();
    clockText.style.fontSize = prev;
    if (measured > 0) {
      clockText.style.fontSize = `${(targetWidth / measured) * BASE}px`;
    }
    layoutHome(); // clock height changed -> re-centre the clock/menu block
  }

  // Closed: the clock sits dead-centre. Open: the clock (shrunk) + gap + menu are
  // centred together as one block. Measured, not hard-coded, because the clock
  // fills the width and is far taller on desktop than on a phone.
  function layoutHome() {
    if ($("home").style.display === "none") return; // measurements are 0 while hidden
    const SCALE = 0.72;
    const GAP = 40;
    const clockH = clockWrap.offsetHeight * SCALE;
    const menuH = menuEl.offsetHeight;
    const total = clockH + GAP + menuH;
    const clockShiftY = -total / 2 + clockH / 2;
    const menuY = -total / 2 + clockH + GAP;
    homeInner.style.setProperty("--menuY", `${menuY}px`);
    clockShift.style.transform = state.menuOpen
      ? `translateY(${clockShiftY}px) scale(${SCALE})`
      : "translateY(0) scale(1)";
  }

  tickClock();
  fitClock();
  setInterval(tickClock, 1000);
  window.addEventListener("resize", fitClock);
  window.addEventListener("load", fitClock);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitClock);

  // ---------------------------------------------------------------
  // home tap -> reveal menu
  // ---------------------------------------------------------------
  homeInner.addEventListener("click", () => {
    state.menuOpen = !state.menuOpen;
    homeInner.classList.toggle("menu-open", state.menuOpen);
    layoutHome();
  });

  // ---------------------------------------------------------------
  // navigation
  // ---------------------------------------------------------------
  let tickInterval = null;

  function openFocus(labelId, minutes) {
    clearInterval(tickInterval);
    state.running = false;
    state.done = false;
    state.activeLabel = labelId;
    const m = minutes || state.durationMin;
    state.durationMin = m;
    state.remaining = m * 60;
    state.view = "focus";
    $("home").style.display = "none";
    focusScreen.classList.add("visible");
    renderFocus();
  }

  function backHome() {
    clearInterval(tickInterval);
    state.running = false;
    state.done = false;
    state.showQueue = false;
    state.menuOpen = false;
    state.view = "home";
    homeInner.classList.remove("menu-open");
    focusScreen.classList.remove("visible");
    $("home").style.display = "flex";
    layoutHome();
    queuePanel.classList.remove("open");
    renderQueue();
  }

  backBtn.addEventListener("click", backHome);

  // ---------------------------------------------------------------
  // timer
  // ---------------------------------------------------------------
  function startInterval() {
    clearInterval(tickInterval);
    tickInterval = setInterval(() => {
      state.remaining -= 1;
      if (state.remaining <= 0) {
        state.remaining = 0;
        state.running = false;
        state.done = true;
        clearInterval(tickInterval);
      }
      renderFocus();
    }, 1000);
  }

  function toggleRunning() {
    if (state.remaining === 0) return;
    state.done = false;
    state.running = !state.running;
    if (state.running) startInterval();
    else clearInterval(tickInterval);
    renderFocus();
  }

  function resetTimer() {
    clearInterval(tickInterval);
    state.running = false;
    state.done = false;
    state.remaining = state.durationMin * 60;
    renderFocus();
  }

  function adjustDuration(delta) {
    if (state.running) return;
    state.durationMin = Math.min(120, Math.max(5, state.durationMin + delta));
    state.remaining = state.durationMin * 60;
    state.done = false;
    renderFocus();
  }

  minusBtn.addEventListener("click", () => adjustDuration(-5));
  plusBtn.addEventListener("click", () => adjustDuration(5));
  resetBtn.addEventListener("click", resetTimer);
  playBtn.addEventListener("click", toggleRunning);

  function renderFocus() {
    const meta = labelById(state.activeLabel);
    focusLabel.textContent = meta.name;
    activeIcon.innerHTML = ICONS[meta.id];
    activeName.textContent = meta.name;

    const total = state.durationMin * 60;
    const progress = total > 0 ? (total - state.remaining) / total : 0;
    ringProgress.style.strokeDashoffset = `${C * (1 - progress)}`;

    timeDisplay.textContent = fmt(state.remaining);
    statusText.textContent = state.done ? "complete" : state.running ? "focusing" : "ready";

    minusBtn.disabled = state.running;
    plusBtn.disabled = state.running;
    durationText.textContent = `${state.durationMin} min`;

    playBtn.innerHTML = state.running ? ICONS.pause : ICONS.play;
    playBtn.classList.toggle("running", state.running);

    queueBtn.classList.toggle("active", state.showQueue);
  }

  // ---------------------------------------------------------------
  // queue
  // ---------------------------------------------------------------
  queueBtn.addEventListener("click", () => {
    state.showQueue = !state.showQueue;
    queuePanel.classList.toggle("open", state.showQueue);
    renderFocus();
  });

  addBtn.addEventListener("click", () => {
    state.adding = !state.adding;
    renderQueue();
  });

  function removeFromQueue(id) {
    state.queue = state.queue.filter((s) => s.id !== id);
    renderQueue();
  }

  function addToQueue() {
    state.queue.push({ id: nextId(), label: state.draftLabel, minutes: state.draftMinutes });
    state.adding = false;
    renderQueue();
  }

  function renderQueue() {
    addBtn.innerHTML = state.adding ? ICONS.x : ICONS.plus;
    addBtn.classList.toggle("active", state.adding);

    addForm.hidden = !state.adding;
    addForm.innerHTML = "";
    if (state.adding) {
      const labelRow = document.createElement("div");
      labelRow.className = "add-row";
      LABELS.forEach((l) => {
        const chip = document.createElement("button");
        chip.className = "chip" + (state.draftLabel === l.id ? " selected" : "");
        chip.innerHTML = `${ICONS[l.id]}<span>${l.name}</span>`;
        chip.addEventListener("click", () => {
          state.draftLabel = l.id;
          renderQueue();
        });
        labelRow.appendChild(chip);
      });

      const durationRow = document.createElement("div");
      durationRow.className = "add-row";
      DURATIONS.forEach((m) => {
        const chip = document.createElement("button");
        chip.className = "chip" + (state.draftMinutes === m ? " selected" : "");
        chip.textContent = `${m}m`;
        chip.addEventListener("click", () => {
          state.draftMinutes = m;
          renderQueue();
        });
        durationRow.appendChild(chip);
      });

      const submit = document.createElement("button");
      submit.className = "add-submit";
      submit.textContent = "Add to queue";
      submit.addEventListener("click", addToQueue);

      addForm.appendChild(labelRow);
      addForm.appendChild(durationRow);
      addForm.appendChild(submit);
    }

    queueList.innerHTML = "";
    if (state.queue.length === 0 && !state.adding) {
      const empty = document.createElement("span");
      empty.className = "queue-empty";
      empty.textContent = "Nothing queued.";
      queueList.appendChild(empty);
    }
    state.queue.forEach((item) => queueList.appendChild(buildQueueCard(item)));
  }

  function buildQueueCard(item) {
    const meta = labelById(item.label);
    const card = document.createElement("div");
    card.className = "queue-card";

    const top = document.createElement("div");
    top.className = "queue-card-top";
    const icon = document.createElement("span");
    icon.innerHTML = ICONS[meta.id];
    icon.style.display = "flex";
    const removeBtn = document.createElement("button");
    removeBtn.className = "queue-card-remove";
    removeBtn.innerHTML = ICONS.xSmall;
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromQueue(item.id);
    });
    top.appendChild(icon);
    top.appendChild(removeBtn);

    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "queue-card-name";
    name.textContent = meta.name;
    const min = document.createElement("div");
    min.className = "queue-card-min";
    min.textContent = `${item.minutes} min`;
    body.appendChild(name);
    body.appendChild(min);

    card.appendChild(top);
    card.appendChild(body);

    // swipe to remove
    let startX = 0;
    let offset = 0;
    let dragging = false;

    card.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
      card.style.transition = "none";
    });
    card.addEventListener("touchmove", (e) => {
      offset = e.touches[0].clientX - startX;
      card.style.transform = `translateX(${offset}px) rotate(${offset / 40}deg)`;
      card.style.opacity = `${1 - Math.min(Math.abs(offset) / 300, 0.7)}`;
    });
    card.addEventListener("touchend", () => {
      dragging = false;
      card.style.transition = "transform 180ms ease, opacity 180ms ease";
      if (Math.abs(offset) > 80) {
        card.style.transform = `translateX(${offset > 0 ? 400 : -400}px)`;
        card.style.opacity = "0";
        setTimeout(() => removeFromQueue(item.id), 160);
      } else {
        card.style.transform = "translateX(0)";
        card.style.opacity = "1";
      }
      offset = 0;
    });
    card.addEventListener("click", () => {
      if (!dragging && Math.abs(offset) < 4) {
        state.showQueue = false;
        queuePanel.classList.remove("open");
        openFocus(item.label, item.minutes);
      }
    });

    return card;
  }

  // ---------------------------------------------------------------
  // register service worker
  // ---------------------------------------------------------------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* offline support just won't be available */
      });
    });
  }

  // initial render
  renderQueue();
  renderFocus();
})();
