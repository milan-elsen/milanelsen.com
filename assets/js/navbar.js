const menuBtn = document.querySelector('.menu-btn');
const navbarCollpase = document.querySelector('.navbar-collapse');

let menuOpen = false;
menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('active');
    navbarCollpase.classList.add('active');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('active');
	navbarCollpase.classList.remove('active');
    menuOpen = false;
  }
});