// ── Language and static voice clips ──
const isSpanish = document.documentElement.lang === "es";
const audioLanguage = isSpanish ? "es" : "en";
const seqSteps = ["left", "right", "both"];
const channelLabels = isSpanish
  ? { left: "izquierdo", right: "derecho", both: "ambos canales" }
  : { left: "Left", right: "Right", both: "Both" };
const testingLabel = (channel) => isSpanish
  ? (channel === "both" ? "Probando <b>ambos canales</b>" : `Probando el canal <b>${channelLabels[channel]}</b>`)
  : `Testing <b>${channelLabels[channel]}</b> ${channel === "both" ? "channels" : "channel"}`;

// ── State ──
let audioCtx = null;
const buffers = {};
let currentSource = null;
let playbackId = 0;
let seqRunning = false;
let seqIdx = 0;
let seqTimer = null;

// ── Theme ──
const themeBtn = document.getElementById("theme-btn");
const icons = { light: "🌙", dark: "☀️", system: "🌓" };
const stored = localStorage.getItem("spk-theme");
let currentTheme = stored || "system";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    themeBtn.textContent = icons.system;
    themeBtn.title = isSpanish ? "Tema: Sistema" : "Theme: System";
  } else {
    root.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? icons.dark : icons.light;
    themeBtn.title = isSpanish
      ? `Tema: ${theme === "dark" ? "Oscuro" : "Claro"}`
      : `Theme: ${theme === "dark" ? "Dark" : "Light"}`;
  }
}

function cycleTheme() {
  const cycle = { system: "light", light: "dark", dark: "system" };
  currentTheme = cycle[currentTheme];
  if (currentTheme === "system") localStorage.removeItem("spk-theme");
  else localStorage.setItem("spk-theme", currentTheme);
  applyTheme(currentTheme);
}

themeBtn.addEventListener("click", cycleTheme);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (currentTheme === "system") applyTheme("system");
});
applyTheme(currentTheme);

// ── Audio helpers ──
function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function loadBuffer(channel) {
  if (!buffers[channel]) {
    // Cache the promise too, so fast repeated clicks share the same request.
    buffers[channel] = fetch(`/audio/${audioLanguage}/${channel}.wav`)
      .then((response) => {
        if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .then((data) => new Promise((resolve, reject) => {
        getCtx().decodeAudioData(data, resolve, reject);
      }))
      .catch((error) => {
        delete buffers[channel];
        throw error;
      });
  }
  return buffers[channel];
}

// ── UI helpers ──
const setStatus = (msg) => (document.getElementById("status").innerHTML = msg);
const setPlaying = (id, on) => document.getElementById(id)?.classList.toggle("playing", on);

function clearAll() {
  // Invalidate audio still downloading or decoding after another click.
  playbackId++;
  ["btn-left", "btn-right", "btn-both", "btn-seq"].forEach((id) => setPlaying(id, false));
  if (currentSource) {
    currentSource.onended = null;
    currentSource.stop();
    currentSource = null;
  }
  if (seqTimer !== null) {
    clearTimeout(seqTimer);
    seqTimer = null;
  }
}

// ── Playback ──
async function playPanned(channel, onDone) {
  const requestId = ++playbackId;
  try {
    const c = getCtx();
    // Resume immediately inside the user's click, before awaiting the network.
    const resumed = c.state === "suspended" ? c.resume() : Promise.resolve();
    const [buf] = await Promise.all([loadBuffer(channel), resumed]);
    if (requestId !== playbackId) return;

    const source = c.createBufferSource();
    source.buffer = buf;
    currentSource = source;

    // The files are mono. Explicit routing keeps the unselected side silent,
    // and sends the same level to both sides for the "both" test.
    const merger = c.createChannelMerger(2);
    if (channel !== "right") source.connect(merger, 0, 0);
    if (channel !== "left") source.connect(merger, 0, 1);
    merger.connect(c.destination);

    source.onended = () => {
      source.disconnect();
      merger.disconnect();
      if (requestId !== playbackId) return;
      currentSource = null;
      onDone?.();
    };
    source.start(0);
  } catch (error) {
    if (requestId !== playbackId) return;
    seqRunning = false;
    clearAll();
    setStatus(isSpanish
      ? "No se pudo reproducir el audio. Comprueba tu conexión y pulsa de nuevo para reintentar."
      : "Audio could not be played. Check your connection and click again to retry.");
  }
}

function playChannel(channel) {
  if (seqRunning) {
    stopSeq();
    return;
  }
  clearAll();
  const btnId = channel === "both" ? "btn-both" : `btn-${channel}`;
  setPlaying(btnId, true);
  setStatus(testingLabel(channel) + '<span class="wave"><span></span><span></span><span></span></span>');
  return playPanned(channel, () => {
    setPlaying(btnId, false);
    setStatus(isSpanish
      ? (channel === "both" ? "Listo — ¿escuchaste <b>ambos canales</b>?" : `Listo — ¿escuchaste el canal <b>${channelLabels[channel]}</b>?`)
      : `Done — did you hear ${channel === "both" ? "<b>both</b> channels" : `the <b>${channelLabels[channel]}</b> channel`}?`);
  });
}

// ── Auto-test sequence ──
function toggleSeq() {
  if (seqRunning) {
    stopSeq();
    return;
  }
  clearAll();
  seqRunning = true;
  seqIdx = 0;
  setPlaying("btn-seq", true);
  return runSeqStep();
}

function runSeqStep() {
  if (!seqRunning || seqIdx >= seqSteps.length) {
    stopSeq();
    return;
  }
  const ch = seqSteps[seqIdx];
  const btnId = ch === "both" ? "btn-both" : `btn-${ch}`;
  ["btn-left", "btn-right", "btn-both"].forEach((id) => setPlaying(id, false));
  setPlaying(btnId, true);
  setStatus((isSpanish ? "Prueba automática — " : "Auto-test — ") + testingLabel(ch) +
    '<span class="wave"><span></span><span></span><span></span></span>');
  seqIdx++;
  return playPanned(ch, () => {
    setPlaying(btnId, false);
    seqTimer = setTimeout(runSeqStep, 400);
  });
}

function stopSeq() {
  seqRunning = false;
  clearAll();
  setStatus(isSpanish ? "Prueba automática finalizada — ¿cómo se escuchó?" : "Auto-test complete — how did it sound?");
}
