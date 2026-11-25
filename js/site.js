(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // trocar de idioma mantém a pessoa na mesma seção
  $$(".idioma a").forEach((a) => a.addEventListener("click", () => { const s = $(".menu a.aqui"); if (s && s.hash && !a.hasAttribute("aria-current") && scrollY > 200) a.hash = s.hash; }));
  const en = document.documentElement.lang === "en";

  /* topo e menu */
  const topo = $(".topo"), menu = $(".menu"), abre = $(".abre");
  const firmar = () => topo.classList.toggle("firme", scrollY > 60 || document.body.dataset.pagina === "materia");
  addEventListener("scroll", firmar, { passive: true }); firmar();
  const alternar = (v) => { menu.classList.toggle("aberto", v); topo.classList.toggle("aberta", v); abre.setAttribute("aria-expanded", v); abre.textContent = v ? (en ? "Close" : "Fechar") : "Menu"; };
  abre.addEventListener("click", () => alternar(!menu.classList.contains("aberto")));
  menu.addEventListener("click", (e) => e.target.closest("a") && alternar(false));
  addEventListener("keydown", (e) => e.key === "Escape" && alternar(false));
  const links = $$('.menu a[href^="#"]');
  const olho = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.classList.toggle("aqui", l.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => olho.observe(s));

  /* vídeos e fotos ampliadas */
  const jan = $("dialog");
  if (jan) {
    const miolo = $(".miolo", jan), leg = $(".leg", jan);
    const mostrar = (no, texto) => { miolo.replaceChildren(no); leg.textContent = texto; jan.showModal(); };
    $$("a[data-yt]").forEach((a) => a.addEventListener("click", (e) => {
      if (location.protocol === "file:" || e.metaKey || e.ctrlKey) return; // fora de um servidor o YouTube bloqueia o player: abre o link
      e.preventDefault();
      const d = document.createElement("div"); d.className = "tela16";
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1&rel=0`;
      f.title = a.dataset.titulo; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
      f.referrerPolicy = "strict-origin-when-cross-origin";
      d.append(f); mostrar(d, a.dataset.titulo);
    }));
    $$(".fotos button").forEach((b) => b.addEventListener("click", () => {
      const o = $("img", b), i = new Image(); i.src = o.src; i.alt = o.alt; i.className = "ampla"; mostrar(i, o.alt);
    }));
    $("button", jan).addEventListener("click", () => jan.close());
    jan.addEventListener("click", (e) => e.target === jan && jan.close());
    jan.addEventListener("close", () => miolo.replaceChildren());
  }

  /* spotify: qualquer link marcado toca no player da página */
  const sp = $("#spotify");
  if (sp) {
    const marcados = $$("a[data-sp]");
    marcados.forEach((a) => a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      sp.src = "https://open.spotify.com/embed/" + a.dataset.sp;
      sp.className = a.dataset.sp.startsWith("track") ? "faixa" : "";
      $("#abrir-spotify").href = a.href;
      marcados.forEach((m) => m.dataset.sp === a.dataset.sp && !m.classList.contains("sp") ? m.setAttribute("aria-current", "true") : m.removeAttribute("aria-current"));
      if (!a.closest(".estante") || innerWidth <= 820) $(".player").scrollIntoView({ block: "center" });
    }));
  }

  /* agenda */
  const agenda = $("#agenda-lista");
  if (agenda) {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const shows = (window.SHOWS || []).map((s) => ({ ...s, d: new Date(s.data + "T12:00:00") })).filter((s) => s.d >= hoje).sort((a, b) => a.d - b.d);
    if (shows.length) {
      $("#agenda-vazia").hidden = true; agenda.hidden = false;
      shows.forEach((s) => {
        const li = document.createElement("li"), t = document.createElement("time"), m = document.createElement("div"), n = document.createElement("strong"), l = document.createElement("span");
        t.dateTime = s.data; t.textContent = s.d.toLocaleDateString(en ? "en-US" : "pt-BR", en ? { day: "numeric", month: "short", year: "numeric" } : { day: "2-digit", month: "2-digit", year: "numeric" });
        n.textContent = s.evento || s.local; l.textContent = [s.evento && s.local, s.cidade].filter(Boolean).join(", ");
        m.append(n, l); li.append(t, m);
        if (/^https?:/.test(s.ingresso || "")) { const a = document.createElement("a"); a.className = "bt"; a.href = s.ingresso; a.target = "_blank"; a.rel = "noopener"; a.textContent = en ? "Tickets" : "Ingressos"; li.append(a); }
        agenda.append(li);
      });
    }
  }

  /* contato: monta o e-mail no programa do visitante */
  const form = $("form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (n) => form.elements[n].value.trim();
    location.href = "mailto:headhunterdeathcult666@gmail.com?subject=" + encodeURIComponent(`[${v("assunto")}] ${v("nome")}`) +
      "&body=" + encodeURIComponent(`${v("mensagem")}\n\n${v("nome")}\n${v("email")}`);
  });
})();
