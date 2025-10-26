import { confirmOrder, getCartCount, isLogged } from "./api";
import { CartItem, ConfirmOrderRequest, LoginUser, SizeKey } from "./types";


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








const KEY = "cart";
function readCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") as CartItem[]; }
  catch { return []; }
}
function writeCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  
  const badge = document.getElementById("cartCount") as HTMLSpanElement | null;
  if (badge) {
    const n = items.reduce((s, i) => s + (i.count ?? 0), 0);
    badge.textContent = String(n);
    badge.hidden = n === 0;
  }
}
function removeItemByIndex(idx: number) {
  const list = readCart();
  if (!list[idx]) return;
  list.splice(idx, 1);
  writeCart(list);
}



function moneyFromCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
function priceHtml(
  lineBase: number,
  lineFinal: number,
  logged: boolean
): string {
  const hasDiscount = logged && lineFinal < lineBase;
  if (hasDiscount) {
    return `<span class="price-old">${moneyFromCents(lineBase)}</span>
            <span class="price-new">${moneyFromCents(lineFinal)}</span>`;
  }
  return `${moneyFromCents(lineFinal)}`;
}

const listRoot   = document.getElementById("cartList")   as HTMLDivElement;
const totalEl    = document.getElementById("cartTotal")  as HTMLSpanElement;
const actionsEl  = document.getElementById("cartActions")as HTMLDivElement;
const cartSummary = document.getElementById("cart-summary") as HTMLDivElement;

function renderCart(): void {
  const items = readCart(); 
  listRoot.innerHTML = "";

  if (items.length === 0) {
    listRoot.innerHTML = `<div class="cart-empty" style="padding:24px 0;text-align:center;opacity:.7"></div>`;
  } else {
    const logged = isLogged();

    items.forEach((it, idx) => {
      const li = document.createElement("div");
      li.className = "cart-item";

      const subtitle = [
        it.sizeLabel || "",
        it.additives?.length ? it.additives.join(", ") : null,
      ]
        .filter(Boolean)
        .join(", ");

      const lineBase = it.unitBaseCents * (it.count || 1);
      const lineFinal = it.unitFinalCents * (it.count || 1);

      li.innerHTML = `
        <button class="trash" aria-label="Remove" data-i="${idx}">
          <img src="./assets/card/trash.svg" alt="Remove" width="24" height="24">
        </button>

        <img class="thumb" src="${it.img}" alt="" width="100" height="100" />

        <div class="infoItem">
          <div class="title">${it.name}</div>
          <div>
            <div class="sub">${subtitle}</div>
            ${it.count > 1 ? `<div class="qty">x${it.count}</div>` : ""}
          </div>
        </div>

        <div class="price">
          ${priceHtml(lineBase, lineFinal, logged)}
        </div>
      `;

      listRoot.appendChild(li);
    });

    
    listRoot.addEventListener(
      "click",
      (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
          ".trash"
        );
        if (!btn) return;
        const i = Number(btn.dataset.i || -1);
        if (i >= 0) {
          removeItemByIndex(i);
          renderCart();
        }
      },
      { once: true }
    );
  }

  
  const logged = isLogged();
  const totals = items.reduce(
    (acc, it) => {
      acc.base += it.unitBaseCents * (it.count || 1);
      acc.final += it.unitFinalCents * (it.count || 1);
      return acc;
    },
    { base: 0, final: 0 }
  );

  const hasDiscount = logged && totals.final < totals.base;
  totalEl.innerHTML = hasDiscount
    ? `<span class="price-old">${moneyFromCents(totals.base)}</span>
       <span class="price-new">${moneyFromCents(totals.final)}</span>`
    : moneyFromCents(totals.final);

  renderActions(items.length > 0);
}


function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function renderActions(hasItems: boolean): void {
  const logged = isLogged();

  
  function readUser(): LoginUser | null {
    try {
      const raw = localStorage.getItem("userProfile");
      if (!raw) return null;
      return JSON.parse(raw) as LoginUser;
    } catch {
      return null;
    }
  }
  const user = readUser();

  
  if (logged && user) {
    cartSummary.innerHTML = `
      <div class="cart-summary">
        <span class="label">Address:</span>
        <span class="value">${user.city}, ${user.street}, ${
      user.houseNumber
    }</span>
      </div>
      <div class="cart-summary">
        <span class="label">Pay by:</span>
        <span class="value">${capitalize(user.paymentMethod)}</span>
      </div>`;
  } else {
    cartSummary.innerHTML = ""; 
  }

  
  actionsEl.innerHTML = "";

  if (!logged) {
    
    actionsEl.innerHTML = `
      <div class="auth-actions">
        <a class="btn" href="./signin.html">Sign In</a>
        <a class="btn" href="./register.html">Registration</a>
      </div>`;
    return;
  }

  
  if (hasItems) {
    
    actionsEl.innerHTML = `<button id="confirmOrder" class="auth-actions btn">Confirm order</button>`;
    document
      .getElementById("confirmOrder")
      ?.addEventListener("click", onConfirmOrder);
  } else {
    
    actionsEl.innerHTML = "";
  }
}


async function onConfirmOrder() {
  clearTopNotice();

  const btn = document.getElementById(
    "confirmOrder"
  ) as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Processing…";
  }

  try {
    const cart = readCart();
    if (cart.length === 0) {
      showTopNotice("Your cart is empty.");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Confirm order";
      }
      return;
    }

    
    const payload: ConfirmOrderRequest = {
      items: cart.map((it) => ({
        productId: it.productId,
        size: it.sizeKey as SizeKey, 
        additives: it.additives || [],
        quantity: it.count || 1,
      })),
      totalPrice: cartTotalFinalDollars(cart), 
    };

    const res = await confirmOrder(payload);

    
    localStorage.removeItem("cart");
    renderCart();

    
    const msg = res?.data?.message ?? "Order confirmed";
    const id = res?.data?.orderId ?? null;

    
    let finalText = msg;
    if (id) finalText += `\nOrder ID: ${id}`;

    showTopNotice(finalText, "success");
  } catch (err) {
    
    const msg =
      err instanceof Error && err.message
        ? err.message
        : "Something went wrong. Please, try again";
    showTopNotice(msg, "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Confirm order";
    }
  }
}


renderCart();


window.addEventListener("storage", (e) => {
  if (e.key === KEY) renderCart();
});


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


function showTopNotice(text: string, tone: "error" | "success" = "error") {
  let bar = document.getElementById("cartNotice") as HTMLDivElement | null;
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "cartNotice";
    bar.style.cssText =
      "width:100%;text-align:center;margin:12px 0;font-weight:600;";
    actionsEl.parentElement?.prepend(bar);
  }
  bar.style.color = tone === "error" ? "#ff3b30" : "#2ecc71";
  bar.textContent = text;
}

function clearTopNotice() {
  const bar = document.getElementById("cartNotice");
  if (bar?.parentElement) bar.parentElement.removeChild(bar);
}

function cartTotalFinalDollars(items: CartItem[]): number {
  const cents = items.reduce(
    (s, it) => s + (it.unitFinalCents ?? it.unitBaseCents) * (it.count || 1),
    0
  );
  return +(cents / 100).toFixed(2);
}