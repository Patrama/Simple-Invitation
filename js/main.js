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
    var layers = Array.prototype.slice.call(document.querySelectorAll(".parallax-layer"));
    if (reduceMotion || !layers.length) return;

    // data-depth is now a direct max-pixel offset (not a fraction), so
    // movement is actually visible: background blobs drift ~20-30px,
    // foreground confetti / the photo frame swing further, ~35-70px.
    var current = { nx: 0, ny: 0 };
    var targetState = { nx: 0, ny: 0 };
    var raf = null;

    var strength = (CFG.parallax && typeof CFG.parallax.strength === "number") ? CFG.parallax.strength : 1;

    function render() {
      // ease toward the target each frame — smoother than snapping
      // straight to the pointer/tilt reading, and reads as "depth"
      // rather than a jitter.
      current.nx += (targetState.nx - current.nx) * 0.12;
      current.ny += (targetState.ny - current.ny) * 0.12;
      layers.forEach(function (layer) {
        var depth = (parseFloat(layer.getAttribute("data-depth")) || 20) * strength;
        var x = current.nx * depth;
        var y = current.ny * depth;
        layer.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      });
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    function setTarget(nx, ny) {
      targetState.nx = Math.max(-1, Math.min(1, nx));
      targetState.ny = Math.max(-1, Math.min(1, ny));
    }

    // Desktop: cursor position relative to viewport center
    window.addEventListener("mousemove", function (e) {
      var nx = (e.clientX / window.innerWidth) * 2 - 1;
      var ny = (e.clientY / window.innerHeight) * 2 - 1;
      setTarget(nx, ny);
    });
    // Recenter if the cursor leaves the window
    window.addEventListener("mouseleave", function () { setTarget(0, 0); });

    // Mobile: device tilt. beta (front/back) and gamma (left/right).
    var gyroBaseline = null;
    function onOrientation(e) {
      if (e.beta === null || e.gamma === null) return;
      // Calibrate around whatever angle the guest is already holding
      // the phone at, so it doesn't assume one fixed "neutral" tilt.
      if (!gyroBaseline) gyroBaseline = { beta: e.beta, gamma: e.gamma };
      var nx = (e.gamma - gyroBaseline.gamma) / 20;
      var ny = (e.beta - gyroBaseline.beta) / 20;
      setTarget(nx, ny);
    }
    window.__enableGyro = function () {
      if (typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function") {
        // iOS 13+: must be requested directly from a user-gesture handler.
        DeviceOrientationEvent.requestPermission().then(function (state) {
          if (state === "granted") window.addEventListener("deviceorientation", onOrientation);
        }).catch(function () {});
      } else if (typeof DeviceOrientationEvent !== "undefined") {
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

  /* ───────────────────────── GUESTBOOK ───────────────────────── */
  // Runs before initPagination so the panel count / dot-nav reflect
  // whether this feature is on at all.
  function prepareGuestbookPanel() {
    var panel = document.querySelector("[data-guestbook-panel]");
    if (!panel) return;
    var enabled = CFG.guestbook && CFG.guestbook.enabled;
    if (!enabled) { panel.remove(); return; }
    panel.hidden = false;
  }

  function statusMeta(attendance) {
    var a = (attendance || "").toLowerCase();
    if (a.indexOf("will") > -1) return { key: "will", text: "Will attend" };
    if (a.indexOf("maybe") > -1) return { key: "maybe", text: "Maybe" };
    return { key: "cant", text: "Can't attend" };
  }

  function initGuestbook() {
    var panel = document.querySelector("[data-guestbook-panel]");
    if (!panel) return; // feature disabled, nothing to wire up

    var toggle = document.getElementById("guestbook-toggle");
    var wrap = document.getElementById("guestbook");
    var status = document.getElementById("guestbook-status");
    var list = document.getElementById("guestbook-list");
    var loaded = false;

    function renderEntries(entries) {
      list.innerHTML = "";
      if (!entries.length) {
        status.textContent = "No responses yet — be the first!";
        return;
      }
      status.textContent = entries.length + " response" + (entries.length === 1 ? "" : "s") + " so far";
      entries.forEach(function (entry) {
        var meta = statusMeta(entry.attendance);
        var li = document.createElement("li");
        li.className = "guestbook__item";
        li.innerHTML =
          '<div class="guestbook__row">' +
            '<span class="guestbook__name">' + escapeHTML(entry.name || "Guest") + "</span>" +
            '<span class="guestbook__badge" data-status="' + meta.key + '">' + escapeHTML(meta.text) + "</span>" +
          "</div>" +
          (entry.comment ? '<p class="guestbook__comment">' + escapeHTML(entry.comment) + "</p>" : "");
        list.appendChild(li);
      });
    }

    function load() {
      if (loaded) return;
      if (!CFG.rsvpEndpoint || CFG.rsvpEndpoint.indexOf("PASTE_YOUR") === 0) {
        status.setAttribute("data-state", "err");
        status.textContent = "RSVP endpoint isn't configured yet (see /other/README.md).";
        return;
      }
      status.textContent = "Loading…";
      status.removeAttribute("data-state");

      fetch(CFG.rsvpEndpoint, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("http-" + r.status);
          return r.text();
        })
        .then(function (text) {
          var data;
          try {
            data = JSON.parse(text);
          } catch (parseErr) {
            // Apps Script most often returns HTML instead of JSON when
            // the deployment hasn't been redeployed since doGet was
            // added, or "Who has access" isn't set to Anyone.
            console.error("Guestbook: response wasn't JSON —", text.slice(0, 300));
            throw new Error("not-json");
          }
          if (data.ok === false) throw new Error(data.error || "script-error");
          loaded = true;
          renderEntries(data.entries || []);
        })
        .catch(function (err) {
          console.error("Guestbook load failed:", err);
          status.setAttribute("data-state", "err");
          if (String(err.message).indexOf("not-json") === 0) {
            status.textContent = "The script returned an unexpected response — usually means it needs redeploying as a new version (see /other/README.md).";
          } else if (String(err.message).indexOf("http-") === 0) {
            status.textContent = "The script responded with an error (" + err.message.replace("http-", "HTTP ") + ").";
          } else {
            status.textContent = "Couldn't reach the guest list right now — check the endpoint URL and deployment access in /other/README.md.";
          }
        });
    }

    function setOpen(open) {
      wrap.hidden = !open;
      toggle.textContent = open ? "Hide guest list" : "Show guest list";
      toggle.setAttribute("aria-expanded", String(open));
      if (open) load();
    }

    toggle.addEventListener("click", function () { setOpen(wrap.hidden); });
    setOpen(!!(CFG.guestbook && CFG.guestbook.openByDefault));
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
    prepareGuestbookPanel();   // must run before initPagination counts panels
    initTheme();
    initCountdown();
    initParallax();
    initPagination();
    initMusic();
    initRSVP();
    initGuestbook();
    initGate();
  });
})();
