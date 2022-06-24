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

    handleRepLogAdd(e) {
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
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson ? await response.json() : null;
                const submit = form.querySelector('button[type="submit"]');
                const submitText = submit.textContent;
                this.toggleDisabledButton(submit);
                submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

                const ids = ['reps', 'item'];
                ids.map(id => {
                    const field = form.querySelector(`#${id}`);
                    field.classList.remove('is-invalid');
                    field.parentNode.querySelector('.invalid-feedback')?.remove();

                })

                if (response.ok) {
                    const {reps, totalWeightLifted} = data;
                    console.log(data);
                    // Build <tr>
                    const tr = this.createElement('tr')
                    tr.setAttribute('data-weight', totalWeightLifted);
                    tr.setAttribute('data-reps', reps);

                    // Build all <td>
                    const cells = this.createRow(data)

                    // Append each <td> to <tr>
                    cells.forEach(cell => {
                        tr.appendChild(cell)
                    })

                    // Update TotalWeightLifted && TotalReps
                    this.wrapper.querySelector('table tbody').appendChild(tr);
                    this.updateTotalWeightLifted();
                    this.updateTotalReps();

                    // Clear field value
                    form.querySelector(`#reps`).value = '';
                    form.querySelector(`#item`).value = '';

                } else if(response.status === 422) {
                    const errors = data.errors
                    errors.forEach(({property, message}) => {
                        const div = this.createElement('div')
                        div.classList.add('invalid-feedback');
                        div.textContent = message
                        const input = this.wrapper.querySelector(`#${property}`);
                        input.classList.add('is-invalid');
                        input.parentNode.appendChild(div);
                    })
                } else {
                    setTimeout(() => {
                        this.toggleDisabledButton(submit);
                        submit.textContent = submitText;
                    }, 300)
                    this.sendError(data.message, data.code);
                }
                setTimeout(() => {
                    this.toggleDisabledButton(submit);
                    submit.textContent = submitText;
                }, 300)
            })
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    handleRepLogDelete(e) {
        e.preventDefault();
        const deleteBtn = e.currentTarget;
        const deleteUrl = deleteBtn.getAttribute('data-url');
        const row = deleteBtn.closest('tr');
        const tableContainer = this.wrapper.querySelector('.table-responsive');

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

    updateTotalReps() {
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
     * @param {number} id
     * @param {string} item
     * @param {number} reps
     * @param {number} totalWeightLifted
     * @return {HTMLElement[]}
     */
    createRow({id, item, reps, totalWeightLifted}) {
        // Item
        const tdItem = this.createElement('td')
        tdItem.textContent = item;
        // Reps
        const tdReps = this.createElement('td')
        tdReps.textContent = reps.toString();
        // Weight
        const tdWeight = this.createElement('td')
        tdWeight.textContent = totalWeightLifted.toString();
        // Delete Link
        const tdDelete = this.createElement('td');
        const linkDelete = this.createElement('a');
        linkDelete.classList.add("btn")
        linkDelete.classList.add("btn-blue")
        linkDelete.classList.add("btn-sm")
        linkDelete.classList.add("js-delete-rep-log")
        linkDelete.setAttribute('role', 'button');
        linkDelete.setAttribute('data-url', `/api/reps/${id}`);
        linkDelete.addEventListener('click', this.handleRepLogDelete.bind(this));
        const i =this.createElement('i');
        i.classList.add('fa-solid')
        i.classList.add('fa-ban')
        linkDelete.appendChild(i);
        tdDelete.appendChild(linkDelete);

        const tds = [];
        tds.push(tdItem, tdReps, tdWeight, tdDelete);
        return tds
    }

    /**
     * @param {string} tagName
     * @return {HTMLElement}
     */
    createElement(tagName)
    {
        return document.createElement(tagName)
    }
}

new RepLogApp(document.querySelector('.js-rep-log-table'));