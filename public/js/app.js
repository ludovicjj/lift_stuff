const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

const showMenu = document.querySelector('.brand');
const navBar = document.querySelector('.navbar');

if (window.sessionStorage?.menu && window.sessionStorage.menu === 'show') {
    console.log('state menu is show')
    navBar.style.transition = 'margin-left 0s'
    navBar.classList.add('active');
}

if (showMenu) {
    showMenu.addEventListener('click', () => {
        navBar.style.transition = null;
        navBar.classList.toggle('active');
        if (navBar.classList.contains('active')) {
            window.sessionStorage.setItem('menu', 'show')
        } else {
            window.sessionStorage.removeItem('menu')
        }
    })
}
