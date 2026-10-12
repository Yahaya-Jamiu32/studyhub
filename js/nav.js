/* Primary navigation: accessible mobile menu + scroll-spy. No dependencies. */
(function () {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  if (!burger || !menu) return;

  const setOpen = (open, returnFocus) => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (!open && returnFocus) burger.focus();
  };
  burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".nav")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) setOpen(false, true); });
  matchMedia("(min-width:821px)").addEventListener("change", () => setOpen(false));

  // Scroll-spy: mark the section in view with aria-current="location"
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      const a = map.get(en.target.id) || (en.target.id === "experience" ? map.get("about") : null);
      if (a) a.setAttribute("aria-current", "location");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["about", "courses", "experience", "how", "categories"].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
})();
