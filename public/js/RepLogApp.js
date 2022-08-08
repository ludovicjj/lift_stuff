class RepLogApp {
    /**
     * @param {HTMLElement} wrapper Div element contains table and form
     */
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.helper = new helper(this.wrapper);
        this.form = this.wrapper.querySelector(RepLogApp.selectors.repLogForm);
        this.isTbodyEmpty = false;

        // load RepLog
        this.repLogLoad().catch(error => {console.log(error.message)})
        // Add RepLog
        this.form.addEventListener('submit', this.handleRepLogAdd.bind(this))
    }

    static get selectors() {
        return {
            repLogForm : '.js-new-rep-log-form',
        }
    }

    /**
     * Fetch RepLogs and Update DOM
     * Add listener foreach delete link into each row
     */
    async repLogLoad() {
        const response = await fetch('/api/reps', {
            method: 'GET',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        });
        const data = await this.getResponseData(response)

        if (response.ok) {
            this.addRow(data)
            this.helper.updateTotalWeightLifted();
            this.helper.updateTotalReps()

            const deleteLinks =  this.wrapper.querySelectorAll('.js-delete-rep-log');
            deleteLinks.forEach(deleteLink => {
                // add Listener for delete.
                deleteLink.addEventListener('click', this.handleRepLogDelete.bind(this))
            })
        } else {
            const error = this.buildError('Failed to load items', response.status);
            return Promise.reject(error);
        }
    }

    /**
     * Add One RepLog
     * Add listener to delete link into each row
     */
    handleRepLogAdd(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const json = JSON.stringify(Object.fromEntries(formData));
        const url = this.form.getAttribute('action');
        const submit = this.form.querySelector('button[type="submit"]');
        const submitText = submit.textContent;

        // disable submit button and change text content
        this.toggleDisabledButton(submit);
        submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

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
                // Clear form errors
                this.removeFormErrors();

                // error
                if (!response.ok) {
                    const data = await this.getResponseData(response);
                    const error = this.buildError(data?.message, data?.code, data?.errors);
                    return Promise.reject(error);
                }

                return fetch(response.headers.get('Location'), {
                    method: 'GET',
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        'Accept': 'application/json'
                    },
                })
            })
            .then(async response => {
                if (response.ok) {
                    // success alert
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Your lift have been added with success',
                    })

                    const data = await this.getResponseData(response);

                    // Remove default row if rep table start with no data
                    if (this.isTbodyEmpty) {
                        this.wrapper.querySelector('.default-row').remove();
                        this.isTbodyEmpty = false;
                    }

                    // Build and append new row
                   const row = this.addRow(data);
                    if (row) {
                        // Add Listener to new delete button
                        const link = row.querySelector('.js-delete-rep-log');
                        link.addEventListener('click', this.handleRepLogDelete.bind(this))
                    }

                    this.helper.updateTotalWeightLifted();
                    this.helper.updateTotalReps();

                    // Clear field value
                    this.clearForm();
                }
            })
            .catch(error => {
                if (error.code === 422) {
                    this.addFormErrors(error.errorsData);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `Something went wrong! (${error.message})`,
                    })
                }
            })
            .finally(() => {
                this.toggleDisabledButton(submit);
                submit.textContent = submitText;
            })
    }

    handleRepLogDelete(e) {
        e.preventDefault();
        const deleteBtn = e.currentTarget;
        Swal.fire({
            icon: 'question',
            title: 'Delete',
            text: 'Are you sure you want to delete this lift ?',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return this.deleteRepLog(deleteBtn);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleted!',
                    text:'Your lift has been deleted.',
                    icon:'success'
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log('cancel')
            }
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Something went wrong! (${error.message})`,
            })
        })
    }

    deleteRepLog(deleteBtn) {
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

        return fetch(deleteUrl, options)
            .then(async response => {
                if (!response.ok) {
                    const data = await this.getResponseData(response)
                    this.sendError(data?.message, data?.code);
                }
                if (response.ok) {
                    row.classList.add('hide');
                    setTimeout(() => {
                        row.remove();
                        this.helper.updateTotalWeightLifted();
                        this.helper.updateTotalReps();
                    }, 500);
                }
            })
            .catch(error => {
                const errorPromise = this.buildError(error.message, error.code);
                return Promise.reject(errorPromise);
            })
            .finally(() => {
                this.toggleDisabledButton(deleteBtn);
                this.toggleMotionToIcon(deleteBtn.querySelector('.fa-ban'), 'fa-spin');
            })
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
     * Create a row foreach items into data.
     * Or create one default row if items into data is an empty array.
     *
     * @param {Object} data Contain items
     * @return {HTMLTableRowElement|null}
     */
    addRow(data) {
        const isCollection = data?.items || false;

        if(!isCollection) {
            return this.createAndAppendRowFragment(data);
        }

        if (data.items.length === 0) {
            this.isTbodyEmpty = true;
            this.createAndAppendRowFragment();
            return null;
        }

        data.items.forEach(item => {
            return this.createAndAppendRowFragment(item);
        })
    }

    /**
     * @param {Object|null} rowData
     * @return {HTMLTableRowElement}
     */
    createAndAppendRowFragment(rowData = null) {
        const template  = document.createElement('template');
        const target = this.wrapper.querySelector('tbody');

        if (rowData) {
            const {item, reps, totalWeightLifted, links} = rowData;

            template.innerHTML = `<tr data-weight="${totalWeightLifted}" data-reps="${reps}">
            <td>${item}</td>
            <td>${reps}</td>
            <td>${totalWeightLifted}</td>
            <td><a class="btn btn-blue btn-sm js-delete-rep-log" role="button" data-url="${links.self}"><i class="fa-solid fa-ban"></i></a></td>
            </tr>`;
        } else {
            template.innerHTML = `<tr><td colspan="4" class="default-row">Let's start to lift something !</td></tr>`;
        }

        const row = template.content.querySelector('tr')
        target.appendChild(row);
        return row;
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
    toggleMotionToIcon(icon, motion) {
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
     * @param {string} message the error message
     * @param {number} code the error status code, default is 400
     * @param {[]|Object[]} errorsData the errors data returned
     * @return {Object} the error object
     */
    buildError(message = '', code = 0, errorsData = []) {
        return {
            type: 'Error',
            message: message || 'Something went wrong',
            errorsData: errorsData,
            code: code || 400
        };
    }

    /**
     * @param response
     * @return {Promise<Object|null>}
     */
    async getResponseData(response) {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        return isJson ? await response.json() : null;
    }

    /**
     * @param {string} tagName
     * @return {HTMLElement}
     */
    createElement(tagName) {
        return document.createElement(tagName)
    }
}
class helper {
    constructor(wrapper) {
        this.wrapper = wrapper;
    }

    /**
     *
     * @param {string} attribute
     * @return {string}
     */
    calculTotalDataAttribute(attribute) {
        let total = 0;
        this.wrapper.querySelectorAll('tbody tr').forEach(element => {
            if (element.getAttribute(attribute)) {
                total += parseFloat(element.getAttribute(attribute));
            }
        })

        return total.toString();
    }

    /**
     * Update the total weight lifted
     */
    updateTotalWeightLifted () {
        this.wrapper.querySelector('.js-total-weight').textContent = this.calculTotalDataAttribute('data-weight');
    }

    /**
     * Update the total reps done
     */
    updateTotalReps() {
        this.wrapper.querySelector('.js-total-reps').textContent = this.calculTotalDataAttribute('data-reps');
    }
}

new RepLogApp(document.querySelector('.js-rep-log-table'));