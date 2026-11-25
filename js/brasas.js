/* Brasas subindo sobre a arte de fundo */
(() => {
  const tela = document.querySelector(".fundo-fixo canvas");
  if (!tela || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = tela.getContext("2d"); let L, A, p = [];
  const nova = (y) => ({ x: Math.random() * L, y: y ?? A + 10, r: .6 + Math.random() * 1.9, v: .35 + Math.random() * 1.1, f: Math.random() * 6.28, t: Math.random() });
  const medir = () => {
    const d = Math.min(devicePixelRatio || 1, 2), antes = L; L = tela.clientWidth; A = tela.clientHeight;
    tela.width = L * d; tela.height = A * d; c.setTransform(d, 0, 0, d, 0, 0);
    if (L !== antes) p = Array.from({ length: L < 820 ? 34 : 80 }, () => nova(Math.random() * A));
  };
  medir(); addEventListener("resize", medir);
  const quadro = (t) => {
    c.clearRect(0, 0, L, A); c.globalCompositeOperation = "lighter";
    p.forEach((b, i) => {
      b.y -= b.v; b.x += Math.sin(t / 900 + b.f) * .5 + .12; if (b.y < -10) p[i] = nova();
      c.fillStyle = `rgba(255,${b.t > .7 ? "205,120" : "105,35"},${(.3 + .5 * Math.abs(Math.sin(t / 420 + b.f))) * Math.max(0, Math.min(1, b.y / (A * .35)))})`;
      c.beginPath(); c.arc(b.x, b.y, b.r, 0, 6.29); c.fill();
    });
    requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
})();
