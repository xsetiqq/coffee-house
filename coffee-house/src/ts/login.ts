import { loginUser } from "./api";
import type { LoginRequest } from "./types";


const qs = <T extends Element>(sel: string, root: ParentNode = document) =>
  root.querySelector(sel) as T | null;

function setError(input: HTMLInputElement, msgEl: HTMLElement, msg: string) {
  input.classList.add("input-error");
  msgEl.textContent = msg;
}
function clearError(input: HTMLInputElement, msgEl: HTMLElement) {
  input.classList.remove("input-error");
  msgEl.textContent = "";
}


function validateLogin(v: string): string | null {
  if (v.trim().length < 3) return "Login must be at least 3 characters";
  if (!/^[A-Za-z]/.test(v)) return "Login must start with a letter";
  if (!/^[A-Za-z]+$/.test(v)) return "Only English letters are allowed";
  return null;
}
function validatePassword(v: string): string | null {
  if (v.length < 6) return "Password must be at least 6 characters";
  if (!/[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]/.test(v))
    return "Password must contain at least 1 special character";
  return null;
}


const form = qs<HTMLFormElement>("#loginForm")!;
const loginInput = qs<HTMLInputElement>("#loginInput")!;
const passwordInput = qs<HTMLInputElement>("#passwordInput")!;
const loginErr = qs<HTMLElement>("#loginErr")!;
const passwordErr = qs<HTMLElement>("#passwordErr")!;
const formErr = qs<HTMLElement>("#formErr")!;
const submitBtn = qs<HTMLButtonElement>("#loginBtn")!;


submitBtn.disabled = true;


[loginInput, passwordInput].forEach((el) =>
  el.addEventListener("focus", () => {
    if (el === loginInput) clearError(loginInput, loginErr);
    if (el === passwordInput) clearError(passwordInput, passwordErr);
    formErr.textContent = "";
  })
);


loginInput.addEventListener("blur", () => {
  const msg = validateLogin(loginInput.value);
  if (msg) setError(loginInput, loginErr, msg);
});
passwordInput.addEventListener("blur", () => {
  const msg = validatePassword(passwordInput.value);
  if (msg) setError(passwordInput, passwordErr, msg);
});


function updateSubmitState() {
  const ok =
    !validateLogin(loginInput.value) && !validatePassword(passwordInput.value);
  submitBtn.disabled = !ok;
}
loginInput.addEventListener("input", updateSubmitState);
passwordInput.addEventListener("input", updateSubmitState);


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formErr.textContent = "";

  
  const lMsg = validateLogin(loginInput.value);
  const pMsg = validatePassword(passwordInput.value);
  if (lMsg) setError(loginInput, loginErr, lMsg);
  if (pMsg) setError(passwordInput, passwordErr, pMsg);
  if (lMsg || pMsg) return;

  
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Signing in...";

  const payload: LoginRequest = {
    login: loginInput.value.trim(),
    password: passwordInput.value,
  };

  try {
    const { data } = await loginUser(payload);
    
    localStorage.setItem("authToken", data.access_token);
    localStorage.setItem("userProfile", JSON.stringify(data.user));

    
    window.location.href = "./card.html";
  } catch {
    formErr.textContent = "Incorrect login or password";
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
