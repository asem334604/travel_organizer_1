(() => {

    const outputField = document.getElementById('output-list') // define output
    const travelForm = document.getElementById('travel-form'); // define travel form element
    const editForm = document.getElementById('edit_form'); // define edit form element

    const storageVal = localStorage.getItem("travel-data"); // check if localstorage exists
    const travelArr = (storageVal) ? JSON.parse(storageVal) : []; //yes - transform to array/no -create an empty array

    // define names for id's and props
    const inputs = ['departure', 'arrival', 'budget', 'startDate', 'endDate', 'persons', 'transfer'];

// create card from form element
    travelForm.addEventListener('submit', (event) => {
        event.preventDefault(); // prevent page reload on submit
        let travelCard = inputs.reduce((acc, value) => {
            acc[value] = document.getElementById(value).value;
            return acc;
        }, {})
        travelCard.timestampOfAdded = new Date().getTime();
        travelCard.addedAt = 'Created: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
        travelArr.push(travelCard); // adding an object to array
        localStorage.setItem('travel-data', JSON.stringify(travelArr)); // update localStorage
        travelForm.reset(); // clear form after submit
        render();
    });

// delete all localStorege entries
    document.getElementById('clear_button').addEventListener('click', () => {
        localStorage.removeItem('travel-data');
        travelArr.length = 0;
        render();
    });


// update view
    const render = () => {
        outputField.innerHTML = ['<ul id = "travel-list">', travelArr.map((value, index) => {
            return `
                <li class="travel_card card p-4 my-1">
                    <div class="row">
                        <div class="col">
                            <h3>From ${value.departure} to ${value.arrival}</h3>
                        </div>
                        <div class="col text-end">
                            <i class="bi bi-pencil-square d-inline mx-1 button_edit" data-bs-target="#edit-modal"
                               data-bs-toggle="modal" item_id="${index}"> </i>
                            <i class="bi bi-x-circle d-inline mx-1 button_delete" item_id="${index}"></i>
                            <i class="bi bi-three-dots-vertical d-inline mx-1 button_edit" item_id="${index}"></i>
                        </div>
                    </div>
                    <h6>Expected budget: ${value.budget} ILS</h6>
                    <h6>${value.startDate} - ${value.endDate} | ${value.persons} persons | ${value.transfer} </h6>
                    <p class="date_added">${value.addedAt}</p>
                </li>
                `
        }), '</ul>'].join('');

        // one eventListener for all displayed cards
        document.getElementById('travel-list')
            .addEventListener('click', (e) => {
                let hasClass = (cl) => e.target.classList.contains(cl);
                const id = e.target.getAttribute('item_id');
                // delete entry
                if (hasClass('button_delete')) {
                    travelArr.splice(id, 1);
                    localStorage.setItem('travel-data', JSON.stringify(travelArr)); // update localStorage
                    render();
                }
                // edit entry
                else if (hasClass('button_edit')) {
                    editForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const editCard = inputs.reduce((acc, value) => {
                            acc[value] = document.getElementById(value + 'Edit').value;
                            return acc;
                        }, {})
                        inputs.forEach((input) => {
                            if ((editCard[input]) && (editCard[input] !== ''))
                                travelArr[id][input] = editCard[input];
                        })
                        if (Object.values(editCard).join('') !== '') {
                            travelArr[id].timestampOfAdded = new Date().getTime();
                            travelArr[id].addedAt = 'Edited: ' + new Date().toLocaleDateString()
                                + ' ' + new Date().toLocaleTimeString();
                        }
                        localStorage.setItem('travel-data', JSON.stringify(travelArr)); // update localStorage
                        editForm.reset(); // clear form after submit
                        document.getElementById('modal-close-button').click();
                        render();
                    })
                }
            })

        // sort entries
        document.getElementById('sort_option')
            .addEventListener('change', (e) => {
                let val = e.target.value;
                travelArr.sort((a, b) => {
                    if (val === 'startDate') {
                        let c = new Date(a[val]).getTime(), d = new Date(b[val]).getTime();
                        return (c - d);
                    }
                    return Number(a[val]) - Number(b[val]);
                })
                e.target.blur();
                localStorage.setItem('travel-data', JSON.stringify(travelArr)); // update localStorage
                render();
            })
    }

// update view
    render();
})()