const linkInfo = document.querySelector('#item-info');
const modalInfo = new bootstrap.Modal(document.getElementById('itemInfoModal'));
const acc = document.querySelector(".accordion-btn");

linkInfo.addEventListener('click', (e) => {
    e.preventDefault();
    modalInfo.show();
});

acc.addEventListener('click', (e) => {
    e.target.classList.toggle("active")
    const chevron = e.target.querySelector("i.fa-chevron-down");

    if (e.target.classList.contains('active')) {
        chevron.style.transform = 'rotate(' + 180 + 'deg)'
    } else {
        chevron.style.transform = 'rotate(0deg)'
    }

    const panelWrapper = e.target.nextElementSibling;
    // accordion is open if parent has class show
    if (e.target.parentElement.classList.contains('show')) {
        if (panelWrapper.style.maxHeight) {
            // define max-height with js (value with px)
            panelWrapper.style.maxHeight = panelWrapper.scrollHeight + "px";
            // transition end
            window.setTimeout(() => {
                // remove max-height added by js and use default style from css
                panelWrapper.style.maxHeight = null;
            },200)
        } else {
            // replace max-height:fit-content by value with px
            panelWrapper.style.maxHeight = panelWrapper.scrollHeight + "px";
            // force repaint
            panelWrapper.offsetWidth;
            // define max-height: 0px
            panelWrapper.style.maxHeight = `0px`;
        }
    } else {
        // accordion is close if parent has not class show
        if (panelWrapper.style.maxHeight) {
            panelWrapper.style.maxHeight = null;
        } else {
            panelWrapper.style.maxHeight = panelWrapper.scrollHeight + "px";
        }
    }
})