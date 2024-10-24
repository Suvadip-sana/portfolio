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



function handleScroll() {
  let scrollPosition = window.scrollY;
  scrollPosition > 400 ? backToTop.style.display = "flex" : backToTop.style.display = "none";
}

// Check the scroll position when the page loads
window.addEventListener("load", handleScroll);

// Check the scroll position when the user scrolls
window.addEventListener("scroll", handleScroll);

backToTop.addEventListener("click", () => {
  window.scrollTo({top: 0, behavior: "smooth"});
});
