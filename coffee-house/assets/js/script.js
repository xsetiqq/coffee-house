const items = [
  {
    title: "S’mores Frappuccino",
    desc: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
    price: "5.50",
    img: "assets/slider-section/coffee-slider-1.png",
  },
  {
    title: "Caramel Macchiato",
    desc: "Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream and whipped thick foam.",
    price: "5.00",
    img: "assets/slider-section/coffee-slider-2.png",
  },
  {
    title: "Ice coffee",
    desc: "A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.",
    price: "4.50",
    img: "assets/slider-section/coffee-slider-3.png",
  },
];

const track = document.getElementById("ch-track");
const dotsRoot = document.getElementById("ch-dots");
const nextBtn = document.querySelector(".ch-prev");
const prevBtn = document.querySelector(".ch-next");
const slider = document.getElementById("ch-slider");

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

items.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "ch-dot";
  d.dataset.i = i;
  d.innerHTML = `<div class="ch-fill"></div>`;
  dotsRoot.appendChild(d);
});

const slides = [...document.querySelectorAll(".ch-slide")];
const dots = [...document.querySelectorAll(".ch-dot")];
const fills = [...document.querySelectorAll(".ch-fill")];

let i = 0;
let paused = false; 
let holding = false; 
let start = 0;
let elapsed = 0; 
const DURATION = 6000;

function go(n) {
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

function loop(t) {
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

dotsRoot.addEventListener("click", (e) => {
  const t = e.target.closest(".ch-dot");
  if (!t) return;
  go(Number(t.dataset.i));
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

function down(e) {
  dragging = true;
  swiped = false;
  holding = true;
  paused = true;

  const p = e.touches ? e.touches[0] : e;
  sx = p.clientX || 0;
  sy = p.clientY || 0;
}

function move(e) {
  if (!dragging) return;
  const p = e.touches ? e.touches[0] : e;
  const dx = (p.clientX || 0) - sx;
  const dy = (p.clientY || 0) - sy;


  if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
    swiped = true;
    if (e.cancelable && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  }
}

function up(e) {
  if (!dragging) return;
  dragging = false;
  holding = false;
  paused = false;

  const p = e.changedTouches ? e.changedTouches[0] : e;
  const cx = p.clientX || 0;
  const cy = p.clientY || 0;
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

function setTopbarHeight(){
  const tb = document.querySelector('.topbar');
  const h  = tb ? tb.offsetHeight : 60;
  document.documentElement.style.setProperty('--topbar-h', h + 'px');
}
setTopbarHeight();
window.addEventListener('resize', setTopbarHeight);


const burger      = document.getElementById('burger');
const burgerIcon  = document.getElementById('burger-icon'); 
const mobileMenu  = document.getElementById('mobile-menu');
const mBackdrop   = document.getElementById('mobile-backdrop');
const mClose      = document.getElementById('mobile-close');
const mSheet      = document.getElementById('mobile-sheet');

function openMenu(){
  mobileMenu.classList.add('is-open');
  burger?.setAttribute('aria-expanded','true');
  if (burgerIcon) burgerIcon.src = './assets/header/State=active.png';
  document.body.classList.add('no-scroll');
}
function closeMenu(){
  mobileMenu.classList.remove('is-open');
  burger?.setAttribute('aria-expanded','false');
  if (burgerIcon) burgerIcon.src = './assets/header/State=default.png';
  document.body.classList.remove('no-scroll');
}

burger?.addEventListener('click', ()=> {
  mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
});
mBackdrop?.addEventListener('click', closeMenu);
mClose?.addEventListener('click', closeMenu);
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
});

mSheet?.addEventListener('click', (e)=>{
  const link = e.target.closest('a');
  if(!link) return;

  const href = link.getAttribute('href') || '';
  const isHash = href.startsWith('#');

  closeMenu();

  if(isHash){
 
    const id = href.slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      const topbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - topbarH - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
});

window.addEventListener('resize', ()=>{
  if(window.innerWidth > 768 && mobileMenu.classList.contains('is-open')){
    closeMenu();
  }
});
