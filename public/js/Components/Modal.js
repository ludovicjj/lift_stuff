const bootstrap = require('bootstrap')
class Modal {
    /**
     * @param {HTMLElement} link
     * @param {HTMLElement} modal
     * @param {string} event
     */
    constructor(link, modal, event = 'click') {
        this.link = link;
        this.modal = new bootstrap.Modal(modal);
        this.event = event;

        this.link.addEventListener(this.event, this.openModal.bind(this))
    }

    openModal(e) {
        e.preventDefault()
        this.modal.show();
    }
}

module.exports = Modal