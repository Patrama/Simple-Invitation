(function () {
  "use strict";
  var CFG = window.EVENT;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────────────────── CONTENT ───────────────────────── */
  function displayName() {
    return CFG.mode === "single"
      ? CFG.names.single
      : CFG.names.first + " & " + CFG.names.second;
  }

  function renderTitleBlock(el) {
    el.innerHTML = "";
    if (CFG.mode === "single") {
      el.textContent = CFG.names.single;
    } else {
      var first = document.createTextNode(CFG.names.first);
      var amp = document.createElement("span");
      amp.className = "amp";
      amp.textContent = "&";
      var second = document.createTextNode(CFG.names.second);
      el.appendChild(first);
      el.appendChild(amp);
      el.appendChild(second);
    }
  }

  function populateContent() {
    document.title = displayName() + " · You're Invited";
    document.getElementById("gate-eyebrow").textContent = CFG.eyebrow;
    document.getElementById("gate-title").textContent = displayName();
    document.querySelectorAll('[data-copy="eyebrow"]').forEach(function (n) { n.textContent = CFG.eyebrow; });
    document.querySelectorAll('[data-copy="tagline"]').forEach(function (n) { n.textContent = CFG.tagline; });
    renderTitleBlock(document.getElementById("title-block"));

    // Feature media (photo or video replacing the illustrated character)
    var stage = document.getElementById("feature-stage");
    if (CFG.feature.kind === "video") {
      var v = document.createElement("video");
      v.src = CFG.feature.src; v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
      stage.appendChild(v);
    } else {
      var img = document.createElement("img");
      img.src = CFG.feature.src; img.alt = CFG.feature.alt || "";
      stage.appendChild(img);
    }

    document.getElementById("date-label").textContent = CFG.dateLabel;
    document.getElementById("time-label").textContent = CFG.timeLabel;

    document.getElementById("venue-name").textContent = CFG.location.venueName;
    document.getElementById("venue-address").textContent = CFG.location.address;
    document.getElementById("map-iframe").src = CFG.location.mapEmbedSrc;
    document.getElementById("directions-link").href = CFG.location.directionsUrl;

    document.getElementById("thankyou-heading").textContent = CFG.thankYou.heading;
    document.getElementById("thankyou-body").textContent = CFG.thankYou.body;

    renderGifts();
  }

  function renderGifts() {
    var grid = document.getElementById("gift-grid");
    var items = (CFG.gifts || []).slice(0, 4);
    grid.style.setProperty("--gift-count", Math.min(items.length, 2));
    if (items.length >= 3) grid.style.setProperty("--gift-count", 2);
    if (window.innerWidth > 900) grid.style.setProperty("--gift-count", items.length);

    items.forEach(function (g) {
      var card = document.createElement("div");
      card.className = "gift-card";
      var isQR = g.type === "qr";
      card.innerHTML =
        '<span class="gift-card__label">' + escapeHTML(g.label) + '</span>' +
        '<span class="gift-card__name">' + escapeHTML(g.name) + '</span>' +
        (isQR
          ? '<img class="gift-card__qr" src="' + escapeAttr(g.detail) + '" alt="QR code for ' + escapeAttr(g.name) + '">'
          : '<span class="gift-card__detail">' + escapeHTML(g.detail) + '</span>') +
        (g.note ? '<span class="gift-card__note">' + escapeHTML(g.note) + '</span>' : '') +
        (!isQR ? '<button type="button" class="gift-card__copy" data-copy-value="' + escapeAttr(g.detail) + '">Copy</button>' : '');
      grid.appendChild(card);
    });

    grid.querySelectorAll(".gift-card__copy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        navigator.clipboard && navigator.clipboard.writeText(btn.getAttribute("data-copy-value"));
        var original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = original; }, 1500);
      });
    });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(str) { return escapeHTML(str); }

  /* ───────────────────────── THEME ───────────────────────── */
  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);
    localStorage.setItem("invite-theme", mode);
  }
  function initTheme() {
    var saved = localStorage.getItem("invite-theme");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(saved || (CFG.theme.default === "system" ? system : CFG.theme.default));

    document.getElementById("theme-toggle").addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (!localStorage.getItem("invite-theme-manual")) applyTheme(e.matches ? "dark" : "light");
    });
    document.getElementById("theme-toggle").addEventListener("click", function () {
      localStorage.setItem("invite-theme-manual", "1");
    });
  }

  /* ───────────────────────── COUNTDOWN ───────────────────────── */
  function initCountdown() {
    var target = new Date(CFG.dateTimeISO).getTime();
    var days = document.getElementById("cd-days"),
        hours = document.getElementById("cd-hours"),
        mins = document.getElementById("cd-mins"),
        secs = document.getElementById("cd-secs");

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        days.textContent = hours.textContent = mins.textContent = secs.textContent = "00";
        document.querySelector(".countdown").setAttribute("aria-label", "The celebration has begun");
        clearInterval(timer);
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      days.textContent = String(d).padStart(2, "0");
      hours.textContent = String(h).padStart(2, "0");
      mins.textContent = String(m).padStart(2, "0");
      secs.textContent = String(s).padStart(2, "0");
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ───────────────────────── PARALLAX ───────────────────────── */
  function initParallax() {
    if (reduceMotion) return;
    var layers = document.querySelectorAll(".parallax-layer");

    function apply(nx, ny) { // nx, ny in [-1, 1]
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute("data-depth")) || 0.04;
        var x = nx * depth * 100;
        var y = ny * depth * 100;
        layer.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      });
    }

    window.addEventListener("mousemove", function (e) {
      var nx = (e.clientX / window.innerWidth) * 2 - 1;
      var ny = (e.clientY / window.innerHeight) * 2 - 1;
      apply(nx, ny);
    });

    var gyroActive = false;
    function onOrientation(e) {
      if (e.beta === null || e.gamma === null) return;
      gyroActive = true;
      var nx = Math.max(-1, Math.min(1, e.gamma / 30));
      var ny = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      apply(nx, ny);
    }
    window.__enableGyro = function () {
      if (typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then(function (state) {
          if (state === "granted") window.addEventListener("deviceorientation", onOrientation);
        }).catch(function () {});
      } else {
        window.addEventListener("deviceorientation", onOrientation);
      }
    };
  }

  /* ───────────────────────── PAGINATION ───────────────────────── */
  function initPagination() {
    var track = document.getElementById("panels");
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));
    var dotNav = document.getElementById("dot-nav");
    var index = 0;
    var locked = false;

    panels.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to section " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotNav.appendChild(dot);
    });

    function updateDots() {
      Array.prototype.forEach.call(dotNav.children, function (dot, i) {
        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }

    function goTo(i) {
      index = Math.max(0, Math.min(panels.length - 1, i));
      track.style.transform = "translateY(-" + (index * 100) + "dvh)";
      updateDots();
    }

    function lockThenUnlock() {
      locked = true;
      setTimeout(function () { locked = false; }, 650);
    }

    window.addEventListener("wheel", function (e) {
      if (locked) return;
      if (Math.abs(e.deltaY) < 12) return;
      goTo(index + (e.deltaY > 0 ? 1 : -1));
      lockThenUnlock();
    }, { passive: true });

    var touchStartY = null;
    window.addEventListener("touchstart", function (e) { touchStartY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchend", function (e) {
      if (touchStartY === null || locked) return;
      var dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) {
        goTo(index + (dy > 0 ? 1 : -1));
        lockThenUnlock();
      }
      touchStartY = null;
    }, { passive: true });

    window.addEventListener("keydown", function (e) {
      if (locked) return;
      if (["ArrowDown", "PageDown"].indexOf(e.key) > -1) { goTo(index + 1); lockThenUnlock(); }
      if (["ArrowUp", "PageUp"].indexOf(e.key) > -1) { goTo(index - 1); lockThenUnlock(); }
    });

    updateDots();
    window.__goToPanel = goTo;
  }

  /* ───────────────────────── MUSIC ───────────────────────── */
  function initMusic() {
    var audio = document.getElementById("bg-audio");
    var btn = document.getElementById("music-toggle");
    if (CFG.music && CFG.music.src) audio.src = CFG.music.src;

    function setPlaying(playing) {
      btn.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-pressed", String(playing));
    }

    btn.addEventListener("click", function () {
      if (audio.paused) { audio.play().then(function () { setPlaying(true); }).catch(function () {}); }
      else { audio.pause(); setPlaying(false); }
    });

    window.__startMusic = function () {
      audio.play().then(function () { setPlaying(true); }).catch(function () { setPlaying(false); });
    };
  }

  /* ───────────────────────── RSVP ───────────────────────── */
  function initRSVP() {
    var form = document.getElementById("rsvp-form");
    var status = document.getElementById("rsvp-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var payload = {
        name: data.get("name"),
        attendance: data.get("attendance"),
        comment: data.get("comment") || "",
        submittedAt: new Date().toISOString()
      };

      if (!CFG.rsvpEndpoint || CFG.rsvpEndpoint.indexOf("PASTE_YOUR") === 0) {
        status.setAttribute("data-state", "err");
        status.textContent = "RSVP endpoint isn't configured yet (see /other/README.md).";
        return;
      }

      status.removeAttribute("data-state");
      status.textContent = "Sending…";

      var body = new URLSearchParams(payload);
      fetch(CFG.rsvpEndpoint, { method: "POST", mode: "no-cors", body: body })
        .then(function () {
          status.setAttribute("data-state", "ok");
          status.textContent = "Thank you — your RSVP was sent.";
          form.reset();
        })
        .catch(function () {
          status.setAttribute("data-state", "err");
          status.textContent = "Something went wrong. Please try again.";
        });
    });
  }

  /* ───────────────────────── GATE ───────────────────────── */
  function initGate() {
    var gate = document.getElementById("gate");
    document.getElementById("open-btn").addEventListener("click", function () {
      gate.classList.add("is-hidden");
      if (window.__enableGyro) window.__enableGyro();
      if (window.__startMusic) window.__startMusic();
      setTimeout(function () { gate.style.display = "none"; }, 900);
    });
  }

  /* ───────────────────────── INIT ───────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    populateContent();
    initTheme();
    initCountdown();
    initParallax();
    initPagination();
    initMusic();
    initRSVP();
    initGate();
  });
})();
