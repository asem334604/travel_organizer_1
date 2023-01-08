(() => {

const outputField = document.getElementById('output-list') // define output
const travelForm = document.getElementById('travel-form'); // define travel form element
const editForm = document.getElementById('edit_form'); // define edit form element

const storageVal = localStorage.getItem("travel-data"); // check if localstorage exists
const travelArr = (storageVal) ? JSON.parse(storageVal) : []; //yes - transform to array/ no -create an empty array


// create card from form element
travelForm.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent page reload on submit
    let travelCard = {
        departure: travelForm.elements.departure.value,
        arrival: travelForm.elements.arrival.value,
        budget: travelForm.elements.budget.value.toString(),
        startDate: travelForm.elements.start_date.value,
        endDate: travelForm.elements.end_date.value,
        persons: travelForm.elements.persons.value,
        transfer: travelForm.elements.transfer.value,
    };
    travelArr.push(travelCard); // adding an object to array
    localStorage.setItem('travel-data', JSON.stringify(travelArr)); // update localStorage
    render();
    travelForm.reset(); // clear form after submit
});

// delete all localStorege entries
document.getElementById('clear_button').addEventListener('click', () => {
    localStorage.removeItem('travel-data');
    travelArr.length = 0;
    render();
});


// update view
const render = () => {
    outputField.innerHTML = ['<ul>', travelArr.map((value, index) => {
        return `
                <li class="travel_card card p-4 my-1">
                    <div class="row">
                        <div class="col">
                            <h3>From ${value.departure} to ${value.arrival}</h3>
                        </div>
                        <div class="col text-end">
                            <i class="bi bi-pencil-square d-inline mx-1 button_edit " data-bs-target="#edit-modal"
                               data-bs-toggle="modal" edit_id="${index}"> </i>
                            <i class="bi bi-x-circle d-inline mx-1 button_delete" delete_id="${index}"></i>
                            <i class="bi bi-three-dots-vertical d-inline mx-1 button_edit" menu_id="${index}"></i>
                        </div>
                    </div>
                    <h6>Expected budget: ${value.budget} ILS</h6>
                    <h6>${value.startDate} - ${value.endDate} | ${value.persons} persons | ${value.transfer} </h6>
                </li>
                `
    }), '</ul>'].join('');

    // delete entry
    document.querySelectorAll('.button_delete').forEach(element => element.addEventListener('click', () => {
        const id = Number(element.getAttribute('delete_id'));
        travelArr.splice(id, 1);
        localStorage.setItem('travel-data', JSON.stringify(travelArr)); // update localStorage
        render();
    }))

    // edit entry
    document.querySelectorAll('.button_edit').forEach((element) => {
        element.addEventListener('click', () => {
            const editId = Number(element.getAttribute('edit_id'));
            editForm.addEventListener('submit', (event) => {
                event.preventDefault(); // prevent page reload on submit
                let editCard = {
                    departure: editForm.elements.departure_upd.value,
                    arrival: editForm.elements.arrival_upd.value,
                    budget: editForm.elements.budget_upd.value.toString(),
                    startDate: editForm.elements.start_date_upd.value,
                    endDate: editForm.elements.end_date_upd.value,
                    persons: editForm.elements.persons_upd.value,
                    transfer: editForm.elements.transfer_upd.value,
                };

                if (editCard.departure && editCard.departure !== '') {
                    travelArr[editId].departure = editCard.departure;
                } else if (editCard.arrival && editCard.arrival !== '') {
                    travelArr[editId].arrival = editCard.arrival;
                } else if (editCard.budget && editCard.budget !== '') {
                    travelArr[editId].budget = editCard.budget.toString();
                } else if (editCard.startDate && editCard.startDate !== '') {
                    travelArr[editId].startDate = editCard.startDate;
                } else if (editCard.endDate && editCard.endDate !== '') {
                    travelArr[editId].endDate = editCard.endDate;
                } else if (editCard.persons && editCard.persons !== '') {
                    travelArr[editId].persons = editCard.persons;
                } else if (editCard.transfer && editCard.transfer !== '') {
                    travelArr[editId].transfer = editCard.transfer;
                }
                localStorage.setItem('travel-data', JSON.stringify(travelArr)); // update localStorage
                editForm.reset(); // clear form after submit
                document.getElementById('modal-close-button').click();
                render();
            })
        })
    })
}

// update view
render();
})()