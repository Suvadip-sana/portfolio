let mobNav = document.querySelector(".mobile-navbar");
let close = document.querySelector(".close");
let menuLogo = document.querySelector(".menuLogo");
let backToTop = document.querySelector(".go-top");

menuLogo.addEventListener("click", () => {
    mobNav.classList.add("open");
});

close.addEventListener("click", () => {
    mobNav.classList.remove("open");
});

window.addEventListener("scroll", () => {
    // console.log(window);
    let scrollPosition = window.scrollY;
    scrollPosition > 400 ? backToTop.style.display = "flex" : backToTop.style.display = "none";
});

backToTop.addEventListener("click", () => {
    window.scrollTo({top: 0, behavior: "smooth"});
});