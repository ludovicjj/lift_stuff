const nav = document.querySelector('.navbar');
const content = document.querySelector('.container-content');
const navToggleLink = document.querySelector('a.navbar-toggle-link');

if (navToggleLink) {
    const span = navToggleLink.querySelector('span');
    navToggleLink.addEventListener('click', function (e) {
        e.preventDefault();
        nav.classList.toggle('active');

        if (content.classList.contains('open')) {
            content.classList.remove('open')
            content.classList.add('close');
            span.innerHTML = '<i class="fa-solid fa-bars"></i>';
        } else {
            span.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            content.classList.add('open')
            content.classList.remove('close')
        }
    })
}