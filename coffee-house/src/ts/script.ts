import { getFavorites, isLogged } from "./api";
import { getCartCount } from "./api";
import { SliderItem } from "./types";




async function loadSliderItems(): Promise<SliderItem[]> {
  const { data } = await getFavorites();
  return data.slice(0, 3).map(
    (p): SliderItem => ({
      title: p.name,
      desc: p.description,
      price: p.price,
      img: productImageUrl(p.id),
    })
  );
}

function productImageUrl(id: number): string {
  return `/images/${id}.jpg`;
}

function qs<T extends Element = Element>(
  selector: string,
  root: ParentNode = document
): T {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el as T;
}



const track = qs<HTMLDivElement>("#ch-track");
const dotsRoot = qs<HTMLDivElement>("#ch-dots");
const nextBtn = qs<HTMLButtonElement>(".ch-prev");
const prevBtn = qs<HTMLButtonElement>(".ch-next");
const slider = qs<HTMLDivElement>("#ch-slider");
const cartLink = document.getElementById("cartBtn") as HTMLAnchorElement | null;
const cartBadge = document.getElementById(
  "cartCount"
) as HTMLSpanElement | null;

function ensureCartLinkVisibility(): void {
  if (!cartLink) return;
  const logged = isLogged();
  const hasItems = getCartCount() > 0;

  cartLink.style.display = logged || hasItems ? "inline-flex" : "none";
}

function updateCartBadge(): void {
  if (!cartBadge) return;
  const n = getCartCount();
  cartBadge.textContent = String(n);
  cartBadge.hidden = n === 0;
  ensureCartLinkVisibility();
}
 updateCartBadge();
 
const loader = document.createElement("div");
loader.className = "loader";
loader.innerHTML = `
  <svg xmlns="http:
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="loader-icon">
    <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/>
    <path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/>
    <path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/>
    <path d="m4.9 4.9 2.9 2.9"/>
  </svg>
`;
track.appendChild(loader);

let items: SliderItem[] = [];

try {
  items = await loadSliderItems();
} catch (e) {
  track.innerHTML = `
  <div style="
    width:100%;
    text-align:center;
    color:#ff3b30;
    font-weight:600;
    padding:16px;
  ">
    Something went wrong. Please, refresh the page
  </div>
`;
  console.error(e);
  throw e;
}

track.innerHTML = "";

items.forEach((it) => {
  const s = document.createElement("div");
  s.className = "ch-slide";
  s.innerHTML = `
    <div class="ch-inner">
      <img class="ch-img" src="${it.img}" alt="${it.title}" draggable="false">
      <div class="ch-inner-text">
        <h3 class="ch-title">${it.title}</h3>
        <p class="ch-desc">${it.desc}</p>
        <div class="ch-price">$${Number(it.price).toFixed(2)}</div>
      </div>
    </div>`;
  track.appendChild(s);
});

dotsRoot.innerHTML = "";
items.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "ch-dot";
  d.dataset.i = String(i);
  d.innerHTML = `<div class="ch-fill"></div>`;
  dotsRoot.appendChild(d);
});

const slides = Array.from(
  document.querySelectorAll<HTMLDivElement>(".ch-slide")
);

const fills = Array.from(document.querySelectorAll<HTMLDivElement>(".ch-fill"));

let i = 0;
let paused = false;
let holding = false;
let start = 0;
let elapsed = 0;
const DURATION = 6000;

function go(n: number) {
  i = (n + slides.length) % slides.length;
  track.style.transform = `translateX(-${i * 100}%)`;
  fills.forEach((f) => (f.style.width = "0%"));
  elapsed = 0;
  start = performance.now();
}

function next() {
  go(i + 1);
}
function prev() {
  go(i - 1);
}

function loop(t: number) {
  if (!paused) {
    elapsed = t - start;
    const pct = Math.min(100, (elapsed / DURATION) * 100);
    fills[i].style.width = pct + "%";
    if (elapsed >= DURATION) {
      next();
      return requestAnimationFrame(loop);
    }
  } else {
    start = t - elapsed;
  }
  requestAnimationFrame(loop);
}

nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

dotsRoot.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const dot = target.closest(".ch-dot") as HTMLElement | null;
  if (!dot) return;

  go(Number(dot.dataset.i));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});

slider.addEventListener("mouseenter", () => {
  if (!holding) paused = true;
});
slider.addEventListener("mouseleave", () => {
  if (!holding) paused = false;
});

let sx = 0,
  sy = 0;
let dragging = false;
let swiped = false;

function down(e: TouchEvent | MouseEvent | PointerEvent) {
  dragging = true;
  swiped = false;
  holding = true;
  paused = true;

  const p = e instanceof TouchEvent ? e.touches[0] : e;
  sx = p.clientX || 0;
  sy = p.clientY || 0;
}

function move(e: TouchEvent | MouseEvent | PointerEvent) {
  if (!dragging) return;
  const p = e instanceof TouchEvent ? e.touches[0] : e;
  const dx = (p.clientX ?? 0) - sx;
  const dy = (p.clientY ?? 0) - sy;

  if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
    swiped = true;
    if (e.cancelable && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  }
}


function up(e: TouchEvent | MouseEvent | PointerEvent) {
  if (!dragging) return;
  dragging = false;
  holding = false;
  paused = false;

  const p = e instanceof TouchEvent ? e.changedTouches[0] : e;
  const cx = p.clientX ?? 0;
  const cy = p.clientY ?? 0;
  const dx = cx - sx;
  const dy = cy - sy;

  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    (dx < 0 ? next : prev)();
  }
}


slider.addEventListener("pointerdown", down);
slider.addEventListener("pointermove", move);
slider.addEventListener("pointerup", up);
slider.addEventListener("pointercancel", up);

slider.addEventListener("touchstart", down, { passive: true });
slider.addEventListener("touchmove", move, { passive: false });
slider.addEventListener("touchend", up, { passive: true });

slider.addEventListener(
  "click",
  (e) => {
    if (swiped) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      swiped = false;
    }
  },
  true
);

nextBtn.addEventListener("click", (e) => {
  if (swiped) {
    e.preventDefault();
    return;
  }
  next();
});
prevBtn.addEventListener("click", (e) => {
  if (swiped) {
    e.preventDefault();
    return;
  }
  prev();
});
slider.addEventListener("pointerdown", down);
slider.addEventListener("pointerup", up);
slider.addEventListener("pointercancel", up);
slider.addEventListener("touchstart", down, { passive: true });
slider.addEventListener("touchend", up, { passive: true });

go(0);
requestAnimationFrame((ts) => {
  start = ts;
  requestAnimationFrame(loop);
});

function setTopbarHeight() {
  const tb = document.querySelector<HTMLElement>(".topbar");
  const h = tb ? tb.offsetHeight : 60;
  document.documentElement.style.setProperty("--topbar-h", h + "px");
}
setTopbarHeight();
window.addEventListener("resize", setTopbarHeight);

const burger = document.getElementById("burger");
const burgerIcon = document.getElementById("burger-icon");
const mobileMenu = document.getElementById("mobile-menu");
const mBackdrop = document.getElementById("mobile-backdrop");
const mClose = document.getElementById("mobile-close");
const mSheet = document.getElementById("mobile-sheet");

function openMenu() {
  if (!mobileMenu) {
  throw new Error("#mobile-menu not found");
}
  mobileMenu.classList.add("is-open");
  burger?.setAttribute("aria-expanded", "true");
    if (burgerIcon instanceof HTMLImageElement) {
      burgerIcon.src = "./assets/header/State=active.png";
    }
  document.body.classList.add("no-scroll");
}
function closeMenu() {
    if (!mobileMenu) {
  throw new Error("#mobile-menu not found");
}
  mobileMenu.classList.remove("is-open");
  burger?.setAttribute("aria-expanded", "false");
  if (burgerIcon instanceof HTMLImageElement)
    burgerIcon.src = "./assets/header/State=default.png";
  document.body.classList.remove("no-scroll");
}
  if (!mobileMenu) {
  throw new Error("#mobile-menu not found");
}
burger?.addEventListener("click", () => {
  mobileMenu.classList.contains("is-open") ? closeMenu() : openMenu();
});
mBackdrop?.addEventListener("click", closeMenu);
mClose?.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("is-open"))
    closeMenu();
});

mSheet?.addEventListener('click', (e: MouseEvent) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const link = target.closest('a');
  if (!(link instanceof HTMLAnchorElement)) return;

  const href = link.getAttribute('href') ?? '';
  const isHash = href.startsWith('#');

  closeMenu();

  if (isHash) {
    e.preventDefault();
    const id = href.slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    const topbarH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')
      ) || 0;

    const y = section.getBoundingClientRect().top + window.scrollY - topbarH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
});


window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && mobileMenu.classList.contains("is-open")) {
    closeMenu();
  }
});
