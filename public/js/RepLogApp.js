class RepLogApp {
    /**
     * @param {HTMLElement} wrapper Div element contains table and form
     */
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.wrapper.querySelectorAll('.js-delete-rep-log').forEach(link => {
            link.addEventListener('click', this.handleRepLogDelete.bind(this))
        })
        this.wrapper.querySelectorAll('tbody tr').forEach(link => {
            link.addEventListener('click', this.handleRowClick)
        })

        this.wrapper.querySelector('.js-new-rep-log-form').addEventListener('submit', this.handleRepLogAdd.bind(this))
    }

    handleRepLogAdd(e)
    {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formData));
        const addUrl = form.getAttribute('action');

        const options = {
            method: 'POST',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'Content-Type': 'application/json'
            },
            body: json
        };
        fetch(addUrl, options)
            .then()
            .catch()
    }

    handleRepLogDelete(e) {
        e.preventDefault();
        const deleteBtn = e.currentTarget;
        const deleteUrl = deleteBtn.getAttribute('data-url');
        const row = deleteBtn.closest('tr');
        const tableContainer = this.wrapper.querySelector('.table-responsive');

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
                    row.classList.add('hide');
                    setTimeout(() => {
                        row.remove();
                        this.updateTotalWeightLifted();
                        this.updateTotalReps();
                        if (tableContainer.scrollHeight <= 276) {
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
    }

    updateTotalWeightLifted () {
        let totalWeight = 0;
        this.wrapper.querySelectorAll('tbody tr').forEach(function (row) {
           totalWeight += parseFloat(row.getAttribute('data-weight'));
        })

        this.wrapper.querySelector('.js-total-weight').textContent = totalWeight.toString();
    }

    updateTotalReps()
    {
        let totalReps = 0;
        this.wrapper.querySelectorAll('tbody tr').forEach(function (row) {
            totalReps += parseInt(row.getAttribute('data-reps'));
        })
        this.wrapper.querySelector('.js-total-reps').textContent = totalReps.toString();
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