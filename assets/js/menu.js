const tabs = document.querySelectorAll(".tab");
const productList = document.getElementById("product-list");
const loadMoreBtn = document.getElementById("load-more");

let allProducts = [];
let currentCategory = "coffee";
let visibleCount = 4;

async function loadProducts() {
  const res = await fetch("./assets/products/products.json");
  return res.json();
}

function renderProducts(data, category) {
  productList.innerHTML = "";
  const filtered = data.filter((p) => p.category === category);

  const isMobile = window.innerWidth <= 768;
  const visibleProducts = isMobile ? filtered.slice(0, visibleCount) : filtered;

  visibleProducts.forEach((product, index) => {
    const item = document.createElement("div");
    item.className = "product-card";
    item.innerHTML = `
      <div class="product-inner">
        <img src="./assets/menu/${product.category}/${product.category}-${
      index + 1
    }.jpg" 
             alt="${product.name}" 
             class="product-img" />
        <div class="product-info">
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <span class="price">$${product.price}</span>
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

loadProducts().then((products) => {
  allProducts = products;
  renderProducts(allProducts, currentCategory);

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
});

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

function openMenu() {
  mobileMenu.classList.add("is-open");
  burger?.setAttribute("aria-expanded", "true");
  if (burgerIcon) burgerIcon.src = "./assets/header/State=active.png";
  document.body.classList.add("no-scroll");
}
function closeMenu() {
  mobileMenu.classList.remove("is-open");
  burger?.setAttribute("aria-expanded", "false");
  if (burgerIcon) burgerIcon.src = "./assets/header/State=default.png";
  document.body.classList.remove("no-scroll");
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

mSheet?.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  const isHash = href.startsWith("#");

  closeMenu();

  if (isHash) {
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const topbarH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--topbar-h"
          )
        ) || 0;
      const y =
        target.getBoundingClientRect().top + window.scrollY - topbarH - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && mobileMenu.classList.contains("is-open")) {
    closeMenu();
  }
});

const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");

let currentProduct = null;

function computeTotal(base) {
  const sizeDelta = Number(
    document.querySelector('input[name="size"]:checked')?.dataset.delta || 0
  );
  const addsCount = document.querySelectorAll(
    ".adds input:checked, .seg--chips input:checked"
  ).length;
  return (Number(base) + sizeDelta + 0.5 * addsCount).toFixed(2);
}

function openModal(product, imgSrc) {
  currentProduct = product;
  modalImg.src = imgSrc;
  modalImg.alt = product.name;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.description;

  modal
    .querySelectorAll('input[name="size"]')
    .forEach((r) => (r.checked = r.value === "S"));
  modal
    .querySelectorAll('.seg--chips input[type="checkbox"]')
    .forEach((c) => (c.checked = false));
  modal
    .querySelectorAll(".seg-item")
    .forEach((l) => l.classList.remove("is-active"));
  modal
    .querySelector('input[name="size"][value="S"]')
    .closest(".seg-item")
    .classList.add("is-active");

  modalPrice.textContent = `$${computeTotal(product.price)}`;

  modal.classList.add("is-open");
  document.body.classList.add("body--lock");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (document.activeElement && modal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  modal.classList.remove("is-open");
  document.body.classList.remove("body--lock");
  modal.setAttribute("aria-hidden", "true");
  currentProduct = null;
}

productList.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const idx = [...productList.children].indexOf(card);
  const filtered = allProducts.filter((p) => p.category === currentCategory);
  const product =
    window.innerWidth <= 768
      ? filtered.slice(0, visibleCount)[idx]
      : filtered[idx];
  const imgSrc = `./assets/menu/${product.category}/${product.category}-${
    idx + 1
  }.jpg`;
  openModal(product, imgSrc);
});

modal.addEventListener("change", (e) => {
  if (e.target.matches('input[name="size"]')) {
    modal
      .querySelectorAll(".seg .seg-item")
      .forEach((l) => l.classList.remove("is-active"));
    e.target.closest(".seg-item").classList.add("is-active");
  }

  if (e.target.type === "checkbox" && e.target.closest(".seg--chips")) {
    const label = e.target.closest(".seg-item");
    label.classList.toggle("is-active", e.target.checked);
  }

  if (currentProduct) {
    modalPrice.textContent = `$${computeTotal(currentProduct.price)}`;
  }
});

modal.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});


const addsGroup  = document.getElementById("addsGroup");
const sizesGroup = document.getElementById("sizesGroup"); 
function openModal(product, imgSrc) {
  currentProduct = product;


  modalImg.src = imgSrc;
  modalImg.alt = product.name;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.description;


if (sizesGroup && product.sizes) {
  const entries = [
    ["S", product.sizes.s],
    ["M", product.sizes.m],
    ["L", product.sizes.l],
  ].filter(([, v]) => !!v);

  sizesGroup.innerHTML = entries
    .map(
      ([key, obj], i) => `
    <label class="seg-item ${i === 0 ? "is-active" : ""}">
      <input type="radio" name="size" value="${key}"
             data-delta="${Number(obj["add-price"] || 0)}" ${
        i === 0 ? "checked" : ""
      }>
      <span class="seg-content">
        <img src="./assets/menu/modal-icons/sizes/${key.toLowerCase()}.png"
             alt="${key}" width="30" height="30">
        <span>${obj.size}</span>
      </span>
    </label>
  `
    )
    .join("");
}




if (addsGroup) {
  const adds = product.additives || [];
  addsGroup.innerHTML = adds
    .map(
      (a, i) => `
    <label class="seg-item">
      <input type="checkbox" data-price="${Number(
        a["add-price"] || 0
      )}" value="${a.name}">
      <span class="seg-content">
        <img src="./assets/menu/modal-icons/sizes/${i + 1}.png"
             alt="${i + 1}" width="30" height="30">
        <span>${a.name}</span>
      </span>
    </label>
  `
    )
    .join("");
}



  modalPrice.textContent = `$${computeTotal(product.price)}`;

  modal.classList.add("is-open");
  document.body.classList.add("body--lock");
  modal.setAttribute("aria-hidden", "false");
}
function computeTotal(base) {
  const sizeDelta = Number(
    modal.querySelector('input[name="size"]:checked')?.dataset.delta || 0
  );
  const addsTotal = Array.from(
    modal.querySelectorAll('#addsGroup input[type="checkbox"]:checked')
  ).reduce((sum, el) => sum + Number(el.dataset.price || 0), 0);

  return (Number(base) + sizeDelta + addsTotal).toFixed(2);
}

modal.addEventListener("change", (e) => {

  if (e.target.matches('input[name="size"]')) {
    modal
      .querySelectorAll(".seg .seg-item")
      .forEach((l) => l.classList.remove("is-active"));
    e.target.closest(".seg-item").classList.add("is-active");
  }

  if (e.target.type === "checkbox" && e.target.closest(".seg--chips")) {
    e.target
      .closest(".seg-item")
      .classList.toggle("is-active", e.target.checked);
  }

  if (currentProduct) {
    modalPrice.textContent = `$${computeTotal(currentProduct.price)}`;
  }
});
