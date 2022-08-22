require('../css/loader.css');

const hideOverflowContainer = (container, delay = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            container.style.maxHeight = '100vh';
            container.style.overflowY = 'hidden';
            resolve();
        },delay)
    })
}
const hideLoader = (loader, delay = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            loader.classList.add('hidden');
            resolve();
        }, delay)
    })
}
const clearContainerAndLoader = (container, loader, delay = 0) => {
    setTimeout(() => {
        loader.remove()
        container.style = null;
    },delay)
}

window.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('body > .container')
    const loader = document.querySelector('.loader');

    hideOverflowContainer(container).then(() => {
        window.addEventListener('load', () => {
            hideLoader(loader, 1000).then(() => {
                clearContainerAndLoader(container, loader, 500)
            })
        })
    })
})
