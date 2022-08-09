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
     * Fetch RepLogs
     * Add listener foreach delete link into each row
     */
    async repLogLoad() {
        const response = await fetch('/api/reps', {
            method: 'GET',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        });

        if (response.ok) {
            let data = await response.json();
            this.addRow(data);
            this.helper.updateTotalWeightLifted();
            this.helper.updateTotalReps()

            const deleteLinks =  this.wrapper.querySelectorAll('.js-delete-rep-log');
            for (let deleteLink of deleteLinks) {
                deleteLink.addEventListener('click', this.handleRepLogDelete.bind(this))
            }
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
        const formData = new FormData(this.form)
        const json = JSON.stringify(Object.fromEntries(formData))
        const url = this.form.getAttribute('action')
        const submit = this.form.querySelector('button[type="submit"]')
        const submitText = submit.textContent

        // disable submit button and change text content
        this.toggleDisabledButton(submit)
        submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'

        const options = {
            method: 'POST',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'Content-Type': 'application/json'
            },
            body: json
        };

        fetch(url, options).then(async response => {
            this.removeFormErrors()

            if (!response.ok) {
                let jsonError = await response.json()
                const error = this.buildError(jsonError?.message, jsonError?.code, jsonError?.errors)
                return Promise.reject(error)
            }
            return fetch(response.headers.get('Location'), {
                method: 'GET',
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    'Accept': 'application/json'
                },
            })
        }).then(async response => {
            let json = await response.json()
            this.removeDefaultRowIfExist()
            this.addRepLog(json);
            Swal.fire({icon: 'success', title: 'Success', text: 'Your lift have been added with success'})
        }).catch(e => {
            if (e.code === 422) {
                this.addFormErrors(e.errorsData)
            } else {
                Swal.fire({icon: 'error', title: 'Oops...', text: `Something went wrong! (${e.message})`})
            }
        }).finally(() => {
            this.toggleDisabledButton(submit)
            submit.textContent = submitText
        })
    }

    /**
     * Delete One RepLog
     */
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

    addRepLog(data) {
        let rowArray = this.addRow(data)
        let link = rowArray[0].querySelector('.js-delete-rep-log');
        link.addEventListener('click', this.handleRepLogDelete.bind(this));

        this.helper.updateTotalWeightLifted();
        this.helper.updateTotalReps();

        this.form.reset();
    }

    removeFormErrors() {
        const fields = this.form.querySelectorAll('input, select');
        for (let field of fields) {
            field.classList.remove('is-invalid');
            field.parentNode.querySelector('.invalid-feedback')?.remove();
        }
    }

    removeDefaultRowIfExist() {
        if (this.isTbodyEmpty) {
            this.wrapper.querySelector('.default-row').remove();
            this.isTbodyEmpty = false;
        }
    }

    /**
     * @param {Object[]} errors
     */
    addFormErrors(errors) {
        for (let {property, message} of errors) {
            const field = this.form.querySelector(`[name="${property}"]`)

            if (field) {
                field.classList.add('is-invalid')
                const feedBack = this.createHTMLElement('div')
                feedBack.classList.add('invalid-feedback')
                feedBack.innerText = message
                field.after(feedBack)
            }
        }
    }

    /**
     * Create and append row(s) using data
     *
     * @param {Object} data Row data
     * @return {HTMLTableRowElement[]}
     */
    addRow(data) {
        const target = this.wrapper.querySelector('tbody');
        let isCollection = data?.items || false;
        let rows = [];

        if(!isCollection) {
            rows.push(this.createHTMLFragment(data));
        }

        if (isCollection && data.items.length === 0) {
            this.isTbodyEmpty = true;
            rows.push(this.createHTMLFragment());
        }

        if (isCollection && data.items.length > 0) {
            for (let item of data.items) {
                rows.push(this.createHTMLFragment(item));
            }
        }

        for (let row of rows) {
            target.appendChild(row)
        }

        return rows;
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
    createHTMLElement(tagName) {
        return document.createElement(tagName)
    }

    /**
     * @param {Object|null} rowData
     * @return {HTMLTableRowElement}
     */
    createHTMLFragment(rowData = null) {
        const template  = this.createHTMLElement('template');
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
        let row = template.content.querySelector('tr');
        target.appendChild(row);
        return row;
    }
}

class helper {
    constructor(wrapper) {
        this.wrapper = wrapper;
    }

    /**
     * Calcul total value of given data-attribute
     * @param {string} attribute
     * @return {string}
     */
    calculTotalDataAttribute(attribute) {
        let total = 0;
        const elements = this.wrapper.querySelectorAll('tbody tr');
        for (let element of elements) {
            if (element.getAttribute(attribute)) {
                total += parseFloat(element.getAttribute(attribute));
            }
        }

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