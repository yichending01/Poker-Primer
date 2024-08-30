var toggleButton = document.querySelector('.toggle-button');
var mobileNav = document.querySelector('.mobile-nav');
var backdrop = document.getElementById('backdrop')

backdrop.addEventListener('click', function () {
    mobileNav.style.display = "none";
    backdrop.style.display = "none";
})

toggleButton.addEventListener("click", function() {
    mobileNav.style.display = 'block';
    backdrop.style.display = 'block';
});