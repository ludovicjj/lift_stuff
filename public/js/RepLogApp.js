class RepLogApp {
    /**
     * @param {HTMLElement} wrapper element table
     */
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.wrapper.querySelectorAll('.js-delete-rep-log').forEach(link => {
            link.addEventListener('click', this.handleRepLogDelete.bind(this))
        })
        this.wrapper.querySelectorAll('tbody tr').forEach(link => {
            link.addEventListener('click', this.handleRowClick)
        })
    }

    async handleRepLogDelete(e) {
        e.preventDefault();
        const deleteBtn = e.currentTarget;
        const deleteUrl = deleteBtn.getAttribute('data-url');
        const row = deleteBtn.closest('tr');
        const totalWeight = this.wrapper.querySelector('.js-total-weight');
        const newWeight = totalWeight.textContent - row.getAttribute('data-weight');
        const tableContainer = this.wrapper.closest('.table-responsive');

        this.toggleDisabledButton(deleteBtn);
        this.toggleMotionToIcon(deleteBtn.querySelector('.fa-ban'), 'fa-spin');

        const init = {
            method: "DELETE",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }

        fetch(deleteUrl, init)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson ? await response.json() : null;

                if (response.ok) {
                    totalWeight.textContent = newWeight.toString();
                    row.classList.add('hide');
                    setTimeout(() => {
                        row.classList.add('out');
                        if (tableContainer.scrollHeight <= 230) {
                            tableContainer.style.overflowY = "visible";
                            tableContainer.style.paddingRight = `${0}px`;
                        }
                    }, 500);
                } else {
                    this.toggleDisabledButton(deleteBtn);
                    this.toggleMotionToIcon(deleteBtn.querySelector('.fa-ban'), 'fa-spin');
                    this.sendError(data.message, data.code);
                }

            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    handleRowClick() {
        console.log('Row clicked')
    }

    /**
     * Disabled or enable bootstrap button
     * @param {HTMLElement} button
     */
    toggleDisabledButton(button) {
        button.classList.toggle('disabled');
        if (button.classList.contains('disabled')) {
            button.setAttribute('aria-disabled', 'true');
        } else {
            button.removeAttribute('aria-disabled');
        }

    }

    /**
     * @param {HTMLElement} icon
     * @param {string} motion
     */
    toggleMotionToIcon(icon, motion)
    {
        icon.classList.toggle(motion)
    }

    /**
     * @param {string} message the error message
     * @param {number} code the error status code, default is 400
     */
    sendError(message = '', code = 0)
    {
        const errorResponse = {
            type: 'Error',
            message: message || 'Something went wrong',
            'code': code || 400
        }

        throw (errorResponse);
    }
}

new RepLogApp(document.querySelector('.js-rep-log-table'));