const burger = document.getElementById("burger");
const burgerIcon = document.getElementById("burger-icon");
const menu = document.getElementById("mobile-menu");

burger.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  burgerIcon.src = open
    ? "./assets/header/State=active.png"
    : "./assets/header/State=default.png";
});
