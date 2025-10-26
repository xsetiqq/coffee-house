import { getCartCount, isLogged } from "./api";



const cartLink = document.getElementById("cartBtn") as HTMLAnchorElement | null;
const cartBadge = document.getElementById(
  "cartCount"
) as HTMLSpanElement | null;

function ensureCartLinkVisibility(): void {
  if (!cartLink) return;
  const logged = isLogged();
  const hasItems = getCartCount() > 0;

  cartLink.style.display = logged || hasItems ? "inline-flex" : "block";
}

function updateCartBadge(): void {
  if (!cartBadge) return;
  const n = getCartCount();
  cartBadge.textContent = String(n);
  cartBadge.hidden = n === 0;
  ensureCartLinkVisibility();
}
updateCartBadge();


























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

mSheet?.addEventListener("click", (e: MouseEvent) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const link = target.closest("a");
  if (!(link instanceof HTMLAnchorElement)) return;

  const href = link.getAttribute("href") ?? "";
  const isHash = href.startsWith("#");

  closeMenu();

  if (isHash) {
    e.preventDefault();
    const id = href.slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    const topbarH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--topbar-h"
        )
      ) || 0;

    const y =
      section.getBoundingClientRect().top + window.scrollY - topbarH - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && mobileMenu.classList.contains("is-open")) {
    closeMenu();
  }
});




