(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    root.style.setProperty("--scroll-y", String(scrollY));
    ticking = false;
  };

  const onScroll = () => {
    if (ticking || reduceMotion.matches) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) {
      root.style.setProperty("--scroll-y", "0");
    } else {
      updateParallax();
    }
  });
})();
