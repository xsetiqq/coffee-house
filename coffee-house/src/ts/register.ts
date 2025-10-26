import { getCartCount, isLogged, registerUser } from "./api";
import { RegisterRequest } from "./types";


const form = document.getElementById("registerForm") as HTMLFormElement;
const btn = document.getElementById("registerBtn") as HTMLButtonElement;
const formErr = document.getElementById("formErr") as HTMLDivElement;

const el = {
  login: document.getElementById("regLogin") as HTMLInputElement,
  pass: document.getElementById("regPassword") as HTMLInputElement,
  pass2: document.getElementById("regPassword2") as HTMLInputElement,
  city: document.getElementById("regCity") as HTMLSelectElement,
  street: document.getElementById("regStreet") as HTMLSelectElement,
  house: document.getElementById("regHouse") as HTMLInputElement,
};
const err = {
  login: document.getElementById("errLogin") as HTMLElement,
  pass: document.getElementById("errPassword") as HTMLElement,
  pass2: document.getElementById("errPassword2") as HTMLElement,
  city: document.getElementById("errCity") as HTMLElement,
  street: document.getElementById("errStreet") as HTMLElement,
  house: document.getElementById("errHouse") as HTMLElement,
  pay: document.getElementById("errPay") as HTMLElement,
};


const streetsByCity: Record<string, string[]> = {
  "New York": [
    "Main St",
    "Broadway",
    "5th Avenue",
    "Wall St",
    "Park Ave",
    "Lexington Ave",
    "Madison Ave",
    "Canal St",
    "Houston St",
    "Bleeker St",
  ],
  "Chicago": [
    "Michigan Ave",
    "State St",
    "Lake St",
    "Clark St",
    "Wabash Ave",
    "Randolph St",
    "Monroe St",
    "Dearborn St",
    "Jackson Blvd",
    "Roosevelt Rd",
  ],
  "Boston": [
    "Beacon St",
    "Boylston St",
    "Cambridge St",
    "Hanover St",
    "Commonwealth Ave",
    "Tremont St",
    "Washington St",
    "Summer St",
    "Milk St",
    "Atlantic Ave",
  ],
};

el.city.addEventListener("change", () => {
  const list = streetsByCity[el.city.value] || [];
  el.street.innerHTML =
    `<option value="" selected hidden>Choose street</option>` +
    list.map((s) => `<option value="${s}">${s}</option>`).join("");
  el.street.disabled = list.length === 0;
  
  clearError(el.city, err.city);
  clearError(el.street, err.street);
});


const loginRe = /^[A-Za-z][A-Za-z]{2,}$/; 
const passRe = /^(?=.*[^A-Za-z0-9]).{6,}$/; 

function setError(
  input: HTMLInputElement | HTMLSelectElement,
  holder: HTMLElement,
  msg: string
) {
  input.classList.add("input-error");
  holder.textContent = msg;
}
function clearError(
  input: HTMLInputElement | HTMLSelectElement,
  holder: HTMLElement
) {
  input.classList.remove("input-error");
  holder.textContent = "";
}

function vLogin(): boolean {
  const v = el.login.value.trim();
  if (!loginRe.test(v)) {
    setError(
      el.login,
      err.login,
      "Login: ≥3 chars, English letters, starts with a letter"
    );
    return false;
  }
  clearError(el.login, err.login);
  return true;
}
function vPass(): boolean {
  const v = el.pass.value;
  if (!passRe.test(v)) {
    setError(
      el.pass,
      err.pass,
      "Password: ≥6 and at least 1 special character"
    );
    return false;
  }
  clearError(el.pass, err.pass);
  return true;
}
function vPass2(): boolean {
  if (el.pass2.value !== el.pass.value || el.pass2.value.length === 0) {
    setError(el.pass2, err.pass2, "Passwords must match");
    return false;
  }
  clearError(el.pass2, err.pass2);
  return true;
}
function vCity(): boolean {
  if (!el.city.value) {
    setError(el.city, err.city, "Choose a city");
    return false;
  }
  clearError(el.city, err.city);
  return true;
}
function vStreet(): boolean {
  if (!el.street.value) {
    setError(el.street, err.street, "Choose a street");
    return false;
  }
  clearError(el.street, err.street);
  return true;
}
function vHouse(): boolean {
  const n = Number(el.house.value);
  if (!Number.isFinite(n) || n <= 1) {
    setError(el.house, err.house, "House number must be greater than 1");
    return false;
  }
  clearError(el.house, err.house);
  return true;
}

function validateAll(): boolean {
  const ok =
    vLogin() &&
    vPass() &&
    vPass2() &&
    vCity() &&
    vStreet() &&
    vHouse() &&
    !!getPayment();
  btn.disabled = !ok;
  return ok;
}

function getPayment(): "cash" | "card" | null {
  const node = form.querySelector<HTMLInputElement>(
    'input[name="paymentMethod"]:checked'
  );
  return (node?.value as "cash" | "card") ?? null;
}


const controls: Array<[HTMLInputElement | HTMLSelectElement, () => boolean, HTMLElement]> = [
  [el.login, vLogin, err.login],
  [el.pass, vPass, err.pass],
  [el.pass2, vPass2, err.pass2],
  [el.city, vCity, err.city],
  [el.street, vStreet, err.street],
  [el.house, vHouse, err.house],
];

controls.forEach(([control, fn, holder]) => {
  const ctrl = control as HTMLInputElement | HTMLSelectElement;
  ctrl.addEventListener("blur", () => {
    fn();
    validateAll();
  });
  ctrl.addEventListener("focus", () => clearError(ctrl, holder));
});


validateAll();


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formErr.textContent = "";
  btn.disabled = true;

  
  const payload: RegisterRequest = {
    login: (
      document.getElementById("regLogin") as HTMLInputElement
    ).value.trim(),
    password: (document.getElementById("regPassword") as HTMLInputElement)
      .value,
    confirmPassword: (
      document.getElementById("regPassword2") as HTMLInputElement
    ).value,
    city: (document.getElementById("regCity") as HTMLSelectElement).value,
    street: (document.getElementById("regStreet") as HTMLSelectElement).value,
    houseNumber: Number(
      (document.getElementById("regHouse") as HTMLInputElement).value
    ),
    paymentMethod: (
      document.querySelector(
        'input[name="paymentMethod"]:checked'
      ) as HTMLInputElement
    ).value as "cash" | "card",
  };


  try {
    const res = await registerUser(payload);

    
    localStorage.setItem("authToken", res.data.access_token);
    localStorage.setItem("userProfile", JSON.stringify(res.data.user));

    
    window.location.href = "./card.html";
  } catch (err) {
    if (err instanceof Error) {
      formErr.textContent = err.message; 
    }
    btn.disabled = false;
  }
});











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