// Movie catalog – drives carousel navigation
const CAROUSEL_MOVIES = [
  { id: 'thank-you-chuck',        category: 'ミステリー',     title: '[字幕] サンキュー、チャック',   poster: 'images/thumbnail/thumb1.jpg', description: '世界の終わりに明かされる、愛すべき贈り物とは？スティーヴン・キングとマイク・フラナガンが仕掛ける感動のミステリー。' },
  { id: 'why-write-love-letters', category: 'ドラマ',         title: '人はなぜラブレターを書くのか', poster: 'images/thumbnail/thumb2.jpg', description: '24年前の記憶と現在が交差するとき、一通の手紙が奇跡を起こす。綾瀬はるか主演。' },
  { id: 'placeholder-1',          category: 'アドベンチャー', title: '夜明けの航海',                poster: 'images/thumbnail/thumb3.jpg', description: '海を渡る若者たちの群像劇。嵐の夜、小さな船に乗り合わせた五人が辿り着く先とは。' },
  { id: 'placeholder-2',          category: '音楽',           title: '街角の交響曲',                poster: 'images/thumbnail/thumb4.jpg', description: '廃れかけた楽団が再び息を吹き返す瞬間を、温かいまなざしで描く感動作。' },
  { id: 'placeholder-1',          category: 'アドベンチャー', title: '夜明けの航海',                poster: 'images/thumbnail/thumb5.jpg', description: '海を渡る若者たちの群像劇。嵐の夜、小さな船に乗り合わせた五人が辿り着く先とは。' },
];

document.querySelectorAll(".carousel-wrapper").forEach((wrapper) => {
  const carousel = wrapper.querySelector(".carousel");
  const nextBtn  = wrapper.querySelector(".next");
  const prevBtn  = wrapper.querySelector(".prev");
  const items    = carousel ? Array.from(carousel.querySelectorAll(".item")) : [];

  if (!carousel || !nextBtn || !prevBtn || items.length === 0) return;

  let currdeg = 0;
  const step  = 360 / items.length;

  // Build per-item movie list by cycling through CAROUSEL_MOVIES
  const movieData = items.map((_, i) => CAROUSEL_MOVIES[i % CAROUSEL_MOVIES.length]);

  const infoPanel = wrapper.querySelector(".carousel-info");
  const hasInfo   = Boolean(infoPanel);

  function normalizeAngle(a) {
    let v = ((a + 180) % 360) - 180;
    if (v > 180)   v -= 360;
    if (v <= -180) v += 360;
    return v;
  }

  function truncateText(s, n) {
    if (!s) return "";
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function updateItems() {
    let centerIndex = 0;
    let smallest    = Infinity;

    items.forEach((item, index) => {
      const itemAngle  = index * step + currdeg;
      const rad        = (itemAngle * Math.PI) / 180;
      const normalized = normalizeAngle(itemAngle);
      const isFront    = Math.cos(rad) >= 0;
      const shouldShow = hasInfo ? (isFront && normalized >= 0) : isFront;

      item.style.opacity       = shouldShow ? "1" : "0";
      item.style.pointerEvents = shouldShow ? "auto" : "none";

      const m = movieData[index];
      if (m && m.poster) {
        item.style.backgroundImage    = `linear-gradient(rgba(0,0,0,0.22),rgba(0,0,0,0.38)), url('${m.poster}')`;
        item.style.backgroundSize     = "cover";
        item.style.backgroundPosition = "center";
      }

      const absNorm = Math.abs(normalized);
      if (absNorm < smallest) {
        smallest    = absNorm;
        centerIndex = index;
      }
    });

    if (infoPanel) {
      const d     = movieData[centerIndex];
      const tag   = infoPanel.querySelector(".card__tag");
      const title = infoPanel.querySelector(".card__title");
      const short = infoPanel.querySelector(".card__short");
      const link  = infoPanel.querySelector(".carousel-detail-link");
      const rsv   = infoPanel.querySelector(".carousel-reserve-link");
      if (tag)   tag.textContent = d.category || "Movie";
      if (title) title.textContent = d.title  || "Untitled";
      if (short) short.textContent = truncateText(d.description || "", 130);
      if (link)  link.href = `movie-detail.html?id=${d.id}`;
      if (rsv)   rsv.href  = `schedule.html?movieId=${d.id}`;
    }
  }

  // Click item → save to localStorage + navigate to movie detail
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      const m = movieData[index];
      if (!m) return;
      const booking = JSON.parse(localStorage.getItem("hal_booking") || "{}");
      booking.movieId    = m.id;
      booking.movieTitle = m.title;
      booking.poster     = m.poster || "";
      booking.category   = m.category || "";
      localStorage.setItem("hal_booking", JSON.stringify(booking));
      window.location.href = `movie-detail.html?id=${m.id}`;
    });
  });

  function rotate(dir) {
    currdeg += dir === "n" ? -step : step;
    carousel.style.transform = `rotateY(${currdeg}deg)`;
    updateItems();
  }

  updateItems();
  nextBtn.addEventListener("click", () => rotate("n"));
  prevBtn.addEventListener("click", () => rotate("p"));

  // Auto-rotate every 4 s
  setInterval(() => rotate("n"), 4000);
});
