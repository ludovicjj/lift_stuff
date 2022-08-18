// const showMenu = document.querySelector('.brand');
// const navBar = document.querySelector('.navbar');
//
// if (window.sessionStorage?.menu && window.sessionStorage.menu === 'show') {
//     console.log('state menu is show')
//     navBar.style.transition = 'margin-left 0s'
//     navBar.classList.add('active');
// }
//
// if (showMenu) {
//     showMenu.addEventListener('click', () => {
//         navBar.style.transition = null;
//         navBar.classList.toggle('active');
//         if (navBar.classList.contains('active')) {
//             window.sessionStorage.setItem('menu', 'show')
//         } else {
//             window.sessionStorage.removeItem('menu')
//         }
//     })
// }
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