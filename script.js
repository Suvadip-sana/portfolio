let mobNav = document.querySelector(".mobile-navbar");
let close = document.querySelector(".close");
let menuLogo = document.querySelector(".menuLogo");

menuLogo.addEventListener("click", () => {
    mobNav.classList.add("open");
})

close.addEventListener("click", () => {
    mobNav.classList.remove("open");
})