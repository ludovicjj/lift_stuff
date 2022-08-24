class Loader {
    constructor(container, loader) {
        this.container = container;
        this.loader = loader;
        this.run()
    }

    run() {
        this.container.style.maxHeight = '100vh';
        this.container.style.overflowY = 'hidden';
        window.addEventListener('load', () => {
            this.hideLoader( 1000).then(() => {
                this.clearContainerAndLoader(500)
            })
        })

    }

    hideLoader = (delay = 0) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loader.classList.add('hidden');
                resolve();
            }, delay)
        })
    }

    clearContainerAndLoader = (delay = 0) => {
        setTimeout(() => {
            this.loader.remove()
            this.container.style = null;
        },delay)
    }
}

export default Loader