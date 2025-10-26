
import { getProducts,  } from "./api";
import type { Product, Category, CartItem } from "./types";
import { getProductById, isLogged } from "./api";
import type { ProductDetails } from "./types";
import { getCartCount } from "./api";

const ifLoadError = qs<HTMLDivElement>("#ifLoadError");
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
function showLoader() {
  ifLoadError.replaceChildren(loader); 
}
function hideLoader() {
  ifLoadError.replaceChildren(); 
}
showLoader();

function qs<T extends Element>(sel: string, root: ParentNode = document): T {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`Element not found: ${sel}`);
  return el as T;
}
function qsa<T extends Element>(sel: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll(sel)) as T[];
}

function imgFor(product: Product) {
 return `/images/${product.id}.jpg`;
}


let allProducts: Product[] = [];
let currentCategory: Category = "coffee";
let visibleCount = 4;


const tabs = qsa<HTMLButtonElement>(".tab");
const productList = qs<HTMLDivElement>("#product-list");
const loadMoreBtn = qs<HTMLButtonElement>("#load-more");
const cartLink = document.getElementById("cartBtn") as HTMLAnchorElement | null;
const cartBadge = document.getElementById(
  "cartCount"
) as HTMLSpanElement | null;


updateCartBadge();


function renderProducts(data: Product[], category: Category): void {
  productList.innerHTML = "";
  const filtered = data.filter((p) => p.category === category);

  const isMobile = window.innerWidth <= 768;
  const visibleProducts = isMobile ? filtered.slice(0, visibleCount) : filtered;

  visibleProducts.forEach((product) => {
    const item = document.createElement("div");
    item.className = "product-card";

    const priceHtml = (() => {
      const base = Number(product.price).toFixed(2);
      const disc = product.discountPrice
        ? Number(product.discountPrice).toFixed(2)
        : null;

      if (isLogged() && disc) {
        return `<span class="price-old">$${base}</span> <span class="price-new">$${disc}</span>`;
      }
      return `$${base}`;
    })();

    item.innerHTML = `
      <div class="product-inner">
        <img
          src="${imgFor(product)}"
          alt="${product.name}"
          class="product-img"
          draggable="false"
        />
        <div class="product-info">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <span class="price">${priceHtml}</span>
        </div>
      </div>
    `;
    productList.appendChild(item);
  });

  
  if (isMobile && visibleCount < filtered.length) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }
}


(async () => {
  
  try {
    const { data } = await getProducts();
    allProducts = data;
    renderProducts(allProducts, currentCategory);
    hideLoader();
    
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        if (tab.classList.contains("coffee")) currentCategory = "coffee";
        if (tab.classList.contains("tea")) currentCategory = "tea";
        if (tab.classList.contains("dessert")) currentCategory = "dessert";

        visibleCount = 4;
        renderProducts(allProducts, currentCategory);
      });
    });
  } catch (e) {
    ifLoadError.innerHTML = `
     <div style="
    width:95%;
    text-align:center;
    color:#ff3b30;
    font-weight:600;
   
  ">
    Something went wrong. Please, refresh the page
  </div>
`;
    console.error(e);
  }
})();



loadMoreBtn.addEventListener("click", () => {
  visibleCount += 4;
  renderProducts(allProducts, currentCategory);
});


window.addEventListener("resize", () =>
  renderProducts(allProducts, currentCategory)
);


const burger = document.getElementById("burger");
const burgerIcon = document.getElementById("burger-icon");
const mobileMenu = document.getElementById("mobile-menu");
const mBackdrop = document.getElementById("mobile-backdrop");
const mClose = document.getElementById("mobile-close");
const mSheet = document.getElementById("mobile-sheet");

function openMenu(): void {
  if (!(mobileMenu instanceof HTMLElement)) return;
  mobileMenu.classList.add("is-open");
  burger?.setAttribute("aria-expanded", "true");
  if (burgerIcon instanceof HTMLImageElement) {
    burgerIcon.src = "./assets/header/State=active.png";
  }
  document.body.classList.add("no-scroll");
}
function closeMenu(): void {
  if (!(mobileMenu instanceof HTMLElement)) return;
  mobileMenu.classList.remove("is-open");
  burger?.setAttribute("aria-expanded", "false");
  if (burgerIcon instanceof HTMLImageElement) {
    burgerIcon.src = "./assets/header/State=default.png";
  }
  document.body.classList.remove("no-scroll");
}

if (burger) {
  burger.addEventListener("click", () => {
    if (!(mobileMenu instanceof HTMLElement)) return;
    mobileMenu.classList.contains("is-open") ? closeMenu() : openMenu();
  });
}
mBackdrop?.addEventListener("click", closeMenu);
mClose?.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (
    e.key === "Escape" &&
    mobileMenu instanceof HTMLElement &&
    mobileMenu.classList.contains("is-open")
  ) {
    closeMenu();
  }
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
  if (
    window.innerWidth > 768 &&
    mobileMenu instanceof HTMLElement &&
    mobileMenu.classList.contains("is-open")
  ) {
    closeMenu();
  }
});


const modal = qs<HTMLDivElement>("#product-modal");
const modalImg = qs<HTMLImageElement>("#modal-img");
const modalTitle = qs<HTMLHeadingElement>("#modal-title");
const modalDesc = qs<HTMLParagraphElement>("#modal-desc");
const modalPrice = qs<HTMLSpanElement>("#modal-price");
const addsGroup = qs<HTMLDivElement>("#addsGroup");
const sizesGroup = qs<HTMLDivElement>("#sizesGroup");





function showModalLoader(): void {
  modalTitle.textContent = "";
  modalDesc.textContent = "";
  sizesGroup.innerHTML = `
    <div class="loader">
      <svg xmlns="http:
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="loader-icon">
        <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/>
        <path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/>
        <path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/>
        <path d="m4.9 4.9 2.9 2.9"/>
      </svg>
    </div>`;
  addsGroup.innerHTML = "";
  modalPrice.textContent = "";
}


function tooltipText(baseStr?: string, discStr?: string | null): string {
  const base = baseStr ? Number(baseStr) : 0;
  const disc = discStr ? Number(discStr) : NaN;
  if (isLogged() && !Number.isNaN(disc)) {
    return `${base.toFixed(2)} → ${disc.toFixed(2)}`;
  }
  return `$${base.toFixed(2)}`;
}




function arraysEqualUnordered(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return [...a].sort().join("|") === [...b].sort().join("|");
}


function saveToCart(item: CartItem): void {
  const raw = localStorage.getItem("cart");
  const list: CartItem[] = raw ? JSON.parse(raw) : [];

  
  const idx = list.findIndex(
    (x) =>
      x.productId === item.productId &&
      x.sizeKey === item.sizeKey &&
      arraysEqualUnordered(x.additives, item.additives) &&
      x.unitFinalCents === item.unitFinalCents &&
      x.unitBaseCents === item.unitBaseCents
  );

  if (idx >= 0) list[idx].count += item.count;
  else list.push(item);

  localStorage.setItem("cart", JSON.stringify(list));
}


function openModalById(productId: number, imgSrc: string): void {
  
  modal.classList.add("is-open");
  document.body.classList.add("body--lock");
  modal.setAttribute("aria-hidden", "false");

  
  modalImg.src = imgSrc;
  modalImg.alt = "";
  modalTitle.textContent = "";
  modalDesc.textContent = "";

  showModalLoader();

  getProductById(productId)
    .then(({ data }) => {
      
      modalImg.alt = data.name;
      modalTitle.textContent = data.name;
      modalDesc.textContent = data.description ?? "";

      
      const order = ["s", "m", "l"] as const;
      const firstAvailable = order.find((k) => data.sizes[k]);
      sizesGroup.innerHTML = order
        .map((key, i) => {
          const s = (
            data.sizes as Record<string, ProductDetails["sizes"][string]>
          )[key];
          if (!s) {
            return `
            <label class="seg-item" title="Not available">
              <input type="radio" name="size" value="${key.toUpperCase()}" disabled>
              <span class="seg-content">
                <img src="./assets/menu/modal-icons/sizes/${key}.png" alt="${key}" width="30" height="30">
                <span>${key.toUpperCase()}</span>
              </span>
            </label>`;
          }
          const checked = (firstAvailable ? key === firstAvailable : i === 0)
            ? "checked"
            : "";
          const active = checked ? "is-active" : "";
          const tip = tooltipText(s.price, s.discountPrice ?? undefined);
          return `
          <label class="seg-item ${active}" title="${tip}">
            <input type="radio" name="size" value="${key.toUpperCase()}"
                   data-price="${s.price}" data-discount="${
            s.discountPrice ?? ""
          }" ${checked}>
            <span class="seg-content">
              <img src="./assets/menu/modal-icons/sizes/${key}.png" alt="${key}" width="30" height="30">
              <span>${s.size}</span>
            </span>
          </label>`;
        })
        .join("");

      
      addsGroup.innerHTML = (data.additives ?? [])
        .map((a, i) => {
          const tip = tooltipText(a.price, a.discountPrice ?? undefined);
          return `
          <label class="seg-item" title="${tip}">
            <input type="checkbox" data-price="${a.price}" data-discount="${
            a.discountPrice ?? ""
          }" value="${a.name}">
            <span class="seg-content">
              <img src="./assets/menu/modal-icons/sizes/${
                i + 1
              }.png" alt="${i + 1}" width="30" height="30">
              <span>${a.name}</span>
            </span>
          </label>`;
        })
        .join("");

      
      renderModalTotal();

      
      sizesGroup.addEventListener("change", (e) => {
        const t = e.target as HTMLInputElement;
        if (t && t.name === "size") {
          sizesGroup
            .querySelectorAll(".seg-item")
            .forEach((l) => l.classList.remove("is-active"));
          t.closest(".seg-item")?.classList.add("is-active");
          renderModalTotal();
        }
      }); 

      addsGroup.addEventListener("change", () => {
        renderModalTotal();
      });

      
      const addBtn =
        (document.getElementById("addToCart") as HTMLButtonElement | null) ??
        modal.querySelector<HTMLButtonElement>(".pm-add");
      if (addBtn) {
        addBtn.onclick = () => {
          const sizeEl = modal.querySelector<HTMLInputElement>(
            'input[name="size"]:checked'
          );
          if (!sizeEl) return;

          const sizeKey = sizeEl.value.toLowerCase(); 
          const sizeLabel =
            sizesGroup.querySelector(".is-active .seg-content span:last-child")
              ?.textContent || sizeKey.toUpperCase();

          const additives = Array.from(
            modal.querySelectorAll<HTMLInputElement>(
              '#addsGroup input[type="checkbox"]:checked'
            )
          ).map((el) => el.value);

          const { baseCents, finalCents } = computeUnitPricesFromDatasets();

          saveToCart({
            productId: data.id,
            name: data.name,
            category: data.category,
            img: modalImg.src,
            sizeKey,
            sizeLabel,
            additives,
            unitBaseCents: baseCents,
            unitFinalCents: finalCents,
            count: 1,
          });

          closeModal();
        };
      }
    })
    .catch(() => {
      const modalInfo = modal.querySelector(
        ".modal-info"
      ) as HTMLDivElement | null;

      if (modalInfo) {
        modalInfo.innerHTML = `
      <div style="
        width:95%;
        margin: 12px auto;
        text-align:center;
        color:#ff3b30;
        font-weight:600;
        font-size: 15px;
      ">
        Something went wrong. Please, refresh the page
      </div>
    `;
      }

      sizesGroup.innerHTML = "";
      addsGroup.innerHTML = "";
      modalPrice.textContent = "";
    });
}


function closeModal(): void {
  
updateCartBadge();
  if (
    document.activeElement instanceof HTMLElement &&
    modal.contains(document.activeElement)
  ) {
    (document.activeElement as HTMLElement).blur();
  }
  modal.classList.remove("is-open");
  document.body.classList.remove("body--lock");
  modal.setAttribute("aria-hidden", "true");

}


productList.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  const card = target.closest(".product-card") as HTMLElement | null;
  if (!card) return;

  const idx = Array.from(productList.children).indexOf(card);
  const filtered = allProducts.filter((p) => p.category === currentCategory);
  const product =
    window.innerWidth <= 768
      ? filtered.slice(0, visibleCount)[idx]
      : filtered[idx];
  if (!product) return;

  const imgSrc = imgFor(product);
  openModalById(product.id, imgSrc);
});


modal.addEventListener("change", (e: Event) => {
  const t = e.target as HTMLInputElement | null;
  if (!t) return;

  
  if (t.name === "size") {
    sizesGroup
      .querySelectorAll(".seg-item")
      .forEach((l) => l.classList.remove("is-active"));
    t.closest(".seg-item")?.classList.add("is-active");
  }

  
  if (t.type === "checkbox" && t.closest("#addsGroup")) {
    const label = t.closest(".seg-item");
    if (label) {
      if (t.checked) label.classList.add("is-active");
      else label.classList.remove("is-active");
    }
  }

  
  renderModalTotal();
});


modal.addEventListener("click", (e: MouseEvent) => {
  const t = e.target as HTMLElement | null;
  if (!t) return;
  if (t.hasAttribute("data-close")) closeModal();
});
window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});



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


function computeUnitPricesFromDatasets(): {
  baseCents: number;
  finalCents: number;
} {
  const logged = isLogged();

  
  const sizeEl = modal.querySelector<HTMLInputElement>(
    'input[name="size"]:checked'
  );
  const sizeBase = Number(sizeEl?.dataset.price ?? 0);
  const sizeDiscRaw = sizeEl?.dataset.discount;
  const sizeFinal = logged && sizeDiscRaw ? Number(sizeDiscRaw) : sizeBase;

  
  const addInputs = Array.from(
    modal.querySelectorAll<HTMLInputElement>(
      '#addsGroup input[type="checkbox"]:checked'
    )
  );

  const addsBase = addInputs.reduce(
    (sum, el) => sum + Number(el.dataset.price ?? 0),
    0
  );
  const addsFinal = addInputs.reduce((sum, el) => {
    const base = Number(el.dataset.price ?? 0);
    const discRaw = el.dataset.discount;
    const chosen = logged && discRaw ? Number(discRaw) : base;
    return sum + chosen;
  }, 0);

  const unitBase = sizeBase + addsBase;
  const unitFinal = sizeFinal + addsFinal;

  return {
    baseCents: Math.round(unitBase * 100),
    finalCents: Math.round(unitFinal * 100),
  };
}



function renderModalTotal(): void {
  const { baseCents, finalCents } = computeUnitPricesFromDatasets();
  const base = (baseCents / 100).toFixed(2);
  const final = (finalCents / 100).toFixed(2);

  if (isLogged() && finalCents < baseCents) {
    
    modalPrice.innerHTML = `<span class="price-new">$${final}</span> <span class="price-old">$${base}</span>`;
  } else {
    
    modalPrice.innerHTML = `$${final}`;
  }
}
