/* Login / sign-up forms: client validation, API call, error mapping. */
(function () {
  const form = document.getElementById("auth-form");
  if (!form) return;
  const kind = form.dataset.form; // "login" | "signup"
  const cfg = window.STUDYHUB_CONFIG;
  const msg = document.getElementById("form-msg");
  const btn = form.querySelector("button[type=submit]");
  const params = new URLSearchParams(location.search);

  // Carry context from the URL into hidden fields (course slug, post-login path, source)
  ["course", "next", "source"].forEach((k) => { const el = form.elements[k]; if (el && params.get(k)) el.value = params.get(k); });
  const courseNote = document.getElementById("course-note");
  if (courseNote && form.elements.course && form.elements.course.value) {
    courseNote.textContent = "You're signing up to start: " + form.elements.course.value.replace(/-/g, " ") + ".";
    courseNote.hidden = false;
  }

  // Same-origin relative paths only (prevents open redirects)
  const safePath = (p) => (typeof p === "string" && p.startsWith("/") && !p.startsWith("//") ? p : null);

  const rules = {
    full_name: (v) => (v.trim().length >= 2 ? "" : "Enter your full name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."),
    password: (v) => (kind === "signup" ? (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v) ? "" : "Use at least 8 characters, with a letter and a number.") : (v ? "" : "Enter your password."))
  };
  const setErr = (name, text) => {
    const input = form.elements[name], out = document.getElementById(name + "-err");
    if (!input || !out) return;
    out.textContent = text; out.hidden = !text;
    input.setAttribute("aria-invalid", text ? "true" : "false");
  };
  const show = (text, ok) => { msg.textContent = text; msg.className = "form-msg " + (ok ? "ok" : "bad"); msg.hidden = !text; };

  Object.keys(rules).forEach((n) => { const el = form.elements[n]; if (el) el.addEventListener("blur", () => setErr(n, rules[n](el.value))); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); show("");
    let firstBad = null;
    Object.keys(rules).forEach((n) => { const el = form.elements[n]; if (!el) return; const t = rules[n](el.value); setErr(n, t); if (t && !firstBad) firstBad = el; });
    if (firstBad) { firstBad.focus(); return; }

    const payload = Object.fromEntries(new FormData(form).entries());
    if (payload.website) return; // honeypot filled: silently drop
    delete payload.website;
    Object.keys(payload).forEach((k) => payload[k] === "" && delete payload[k]);

    btn.disabled = true; const label = btn.textContent; btn.textContent = "Please wait…";
    try {
      if (window.StudyHubAPI.isDemo()) {
        show("Demo mode: the form is valid, but no backend is connected yet, so nothing was saved.", true);
        return;
      }
      const data = await window.StudyHubAPI.post(kind, payload);
      const dest = safePath(data.redirect) || safePath(payload.next) || (kind === "login" ? cfg.ROUTES.afterLogin : cfg.ROUTES.afterSignup);
      show("Success. Redirecting…", true);
      location.assign(dest);
    } catch (err) {
      Object.entries(err.fields || {}).forEach(([n, t]) => setErr(n, t));
      show(err.message, false);
    } finally { btn.disabled = false; btn.textContent = label; }
  });
})();
