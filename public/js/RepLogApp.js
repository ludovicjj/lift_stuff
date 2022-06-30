class RepLogApp {
    /**
     * @param {HTMLElement} wrapper Div element contains table and form
     */
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.form = this.wrapper.querySelector('.js-new-rep-log-form');
        this.isTbodyEmpty = false;

        this.loadRepLogs().then(() => {
            // Delete repLog
            this.wrapper.querySelectorAll('.js-delete-rep-log').forEach(link => {
                link.addEventListener('click', this.handleRepLogDelete.bind(this))
            })
            // Row click
            this.wrapper.querySelectorAll('tbody tr').forEach(row => {
                row.addEventListener('click', this.handleRowClick)
            })
        }).catch(error => {
            console.error('There was an error!', error);
        });
        // Add repLog
        this.form.addEventListener('submit', this.handleRepLogAdd.bind(this))
    }

    handleRowClick() {
    }

    async loadRepLogs() {
        const response = await fetch('/api/reps', {
            method: 'GET',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        });
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (response.ok) {
            if (response.status === 204) {
                this.isTbodyEmpty = true;
                const row = this.createDefaultRowFragment().querySelector('tr');
                this.wrapper.querySelector('tbody').appendChild(row);
            } else {
                data.items.forEach((item, key) => {
                    const row = this.createRowFragment(item).querySelector('tr');
                    this.wrapper.querySelector('tbody').appendChild(row);
                })
            }
            this.updateTotalWeightLifted();
            this.updateTotalReps();
        } else {
            return Promise.reject(response.status);
        }
    }

    handleRepLogAdd(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const json = JSON.stringify(Object.fromEntries(formData));
        const url = this.form.getAttribute('action');
        const submit = this.form.querySelector('button[type="submit"]');
        const submitText = submit.textContent;

        const options = {
            method: 'POST',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'Content-Type': 'application/json'
            },
            body: json
        };
        fetch(url, options)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson ? await response.json() : null;

                this.toggleDisabledButton(submit);
                submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                this.removeFormErrors();

                if (response.ok) {
                    // Remove default row if rep table start with no data
                    if (this.isTbodyEmpty) {
                        this.wrapper.querySelector('.default-row').remove();
                        this.isTbodyEmpty = false;
                    }

                    // Build and append new row
                    const row = this.createRowFragment(data).querySelector('tr');
                    this.wrapper.querySelector('tbody').appendChild(row);

                    // Add Listener to new delete button
                    const link = row.querySelector('.js-delete-rep-log');
                    link.addEventListener('click', this.handleRepLogDelete.bind(this))

                    this.updateTotalWeightLifted();
                    this.updateTotalReps();

                    // Clear field value
                    this.clearForm();

                } else if (response.status === 422) {
                    const errors = data.errors
                    this.addFormErrors(errors);
                } else {
                    this.sendError(data.message, data.code);
                }
                setTimeout(() => {
                    this.toggleDisabledButton(submit);
                    submit.textContent = submitText;
                }, 300)
            })
            .catch(error => {
                setTimeout(() => {
                    this.toggleDisabledButton(submit);
                    submit.textContent = submitText;
                }, 300)
                console.error('There was an error!', error);
            })
    }

    handleRepLogDelete(e) {
        e.preventDefault();
        const deleteBtn = e.currentTarget;
        const deleteUrl = deleteBtn.getAttribute('data-url');
        const row = deleteBtn.closest('tr');

        this.toggleDisabledButton(deleteBtn);
        this.toggleMotionToIcon(deleteBtn.querySelector('.fa-ban'), 'fa-spin');

        const options = {
            method: "DELETE",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }

        fetch(deleteUrl, options)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson ? await response.json() : null;
                if (response.ok) {
                    row.classList.add('hide');
                    setTimeout(() => {
                        row.remove();
                        this.updateTotalWeightLifted();
                        this.updateTotalReps();
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

    updateTotalWeightLifted () {
        let totalWeight = 0;
        this.wrapper.querySelectorAll('tbody tr').forEach(function (row) {
            if (row.getAttribute('data-weight')) {
                totalWeight += parseFloat(row.getAttribute('data-weight'));
            }
        })

        this.wrapper.querySelector('.js-total-weight').textContent = totalWeight.toString();
    }

    updateTotalReps() {
        let totalReps = 0;
        this.wrapper.querySelectorAll('tbody tr').forEach(function (row) {
            if (row.getAttribute('data-reps')) {
                totalReps += parseInt(row.getAttribute('data-reps'));
            }
        })
        this.wrapper.querySelector('.js-total-reps').textContent = totalReps.toString();
    }

    removeFormErrors() {
        const fields = this.form.querySelectorAll('input, select');

        fields.forEach(function(field) {
            field.classList.remove('is-invalid');
            field.parentNode.querySelector('.invalid-feedback')?.remove();
        });
    }

    /**
     * @param {Object[]} errors
     */
    addFormErrors(errors) {
        errors.forEach(({property, message})  => {
            const field = this.form.querySelector(`[name="${property}"]`);
            if (field) {
                field.classList.add('is-invalid');

                const feedBack = this.createElement('div');
                feedBack.classList.add('invalid-feedback');
                feedBack.innerText = message;
                field.after(feedBack);
            }
        });
    }

    clearForm() {
        this.form.reset();
    }

    /**
     * @param {number} id
     * @param {string} item
     * @param {number} reps
     * @param {number} totalWeightLifted
     * @param {Object} links
     * @return {DocumentFragment}
     */
    createRowFragment({id, item, reps, totalWeightLifted, links}) {
        const template  = document.createElement('template');
        template.innerHTML = `<tr data-weight="${totalWeightLifted}" data-reps="${reps}">
            <td>${item}</td>
            <td>${reps}</td>
            <td>${totalWeightLifted}</td>
            <td><a class="btn btn-blue btn-sm js-delete-rep-log" role="button" data-url="${links.self}"><i class="fa-solid fa-ban"></i></a></td>
        </tr>`;
        return template.content;
    }

    createDefaultRowFragment()
    {
        const template  = document.createElement('template');
        template.innerHTML = `<tr><td colspan="4" class="default-row">Let's start to lift something !</td></tr>`;
        return template.content;
    }

    /**
     * Disabled or enable bootstrap button
     * @param {HTMLElement} button
     */
    toggleDisabledButton(button) {
        button.classList.toggle('disabled');
        let isButton = button.nodeName === 'BUTTON'
        if (button.classList.contains('disabled')) {
            button.setAttribute('aria-disabled', 'true');
            if (isButton) {
                button.setAttribute('tabindex', '-1');
            }
        } else {
            button.removeAttribute('aria-disabled');
            if (isButton) {
                button.removeAttribute('tabindex');
            }
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
    sendError(message = '', code = 0) {
        const errorResponse = {
            type: 'Error',
            message: message || 'Something went wrong',
            'code': code || 400
        }

        throw (errorResponse);
    }

    /**
     * @param {string} tagName
     * @return {HTMLElement}
     */
    createElement(tagName) {
        return document.createElement(tagName)
    }
}

new RepLogApp(document.querySelector('.js-rep-log-table'));