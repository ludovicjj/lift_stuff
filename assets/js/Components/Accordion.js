class Accordion {
    /**
     * @param {HTMLElement} accordion
     */
    constructor(accordion) {
        this.accordion = accordion;
        this.btn = this.accordion.querySelector('.accordion-btn');
        this.panel = this.accordion.querySelector('.panel-wrapper');
        this.panelTransitionDuration = this._getTransitionDuration(this.panel);
        this.isStartOpen = this.accordion.getAttribute('data-acc') === 'show';

        this.btn.addEventListener('click', this.handleClick.bind(this))
    }

    handleClick() {
        if (this.isStartOpen) {
            this._toggleAccordionStartOpen()
        } else {
            this._toggleAccordionStartClose()
        }
    }

    /**
     * Accordion is open by default
     */
    _toggleAccordionStartOpen() {
        this.accordion.classList.toggle("close");
        if (this.panel.style.maxHeight) {
            // open panel (Redefine max-height with JS)
            this.panel.style.maxHeight = this.panel.scrollHeight + "px";
            // transition end (max-height)
            setTimeout(() => {
                // After transition, remove max-height added by JS and use default style from css
                this.panel.style.maxHeight = null;
            }, this.panelTransitionDuration)
        } else {
            // Override css max-height value. Define max-height value in PIXEL with JS
            this.panel.style.maxHeight = this.panel.scrollHeight + "px";
            // force repaint to apply the previous value of max-height in pixel
            // 100% -> 0px (transition not working)
            // 550px -> 0px (transition working)
            this.panel.offsetWidth;
            // close panel with transition
            this.panel.style.maxHeight = `0px`;
        }
    }

    /**
     * Accordion is close by default
     */
    _toggleAccordionStartClose() {
        this.accordion.classList.toggle("open");
        if (this.panel.style.maxHeight) {
            this.panel.style.maxHeight = null;
        } else {
            this.panel.style.maxHeight = this.panel.scrollHeight + "px";
        }
    }

    _getTransitionDuration(element) {
        return parseFloat(window.getComputedStyle(element).transitionDuration) * 1000
    }
}

export default Accordion