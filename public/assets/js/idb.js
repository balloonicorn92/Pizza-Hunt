const Pizza = require("../../../models/Pizza");

//create variable to hold db connection
let db;
//establish a connected to IndexedDV database called pizza_hunt and set it to version 1
const request = indexedDB.open('pizza_hunt', 1)

//this event will emit if the db version changes
request.onupgradeneeded = function(event) {
    //reference the database
    const db = event.target.result
    //create an object store (table) called new pizza and set it to have aut increment on pk
    db.createObjectStore('new_pizza', {  autoIncrement: true })
}

//upon successful 
request.onsucces = function(event){
    //when db is successfully created with its object store (from onupgradeneeded event above) or simply establish connection... save reference to the db in global var
    db = event.target.result
    //check if app is online, if yes run uploadPizza() to send data to api
    if (navigator.online) {
        uploadPizza()
    }
}

request.onerror = function(event){
    //log error
    console.log(event.target.errorCode)
}

// make note of the funtion(event).... these are all event handlers... what is the webpage doing to cause these event?!

//this function will be executed if we attempt to submit a new pizza with no internet connection
function saveRecord(record){
    //open new transaction with db with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite')
    //transaction = a temporary connection with the database in order to store the information since we cannot connect to the actual api db
    //access the object store for new_pizza
    const pizzaObjectStore = transaction.objectStore('new_pizza')

    //add record to you store with the add method
    pizzaObjectStore.add(record)
}

function uploadPizza() {
    //open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite')

    //access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza')

    //get all records from the object store and set to a variable
    const getAll = pizzaObjectStore.getAll()

    //upon successful .getAll() execution, run the following
    getAll.onsucces = function() {
        //if there was data in idb store let send it to the api server to do the fetch request
        if (getAll.result.length > 0){
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }).then (response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse)
                }
                //open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite')
                //access new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza')
                //clear all items in your store
                pizzaObjectStore.clear()

                alert('all saved pizza has been submitted')
            }).catch( err => {
                console.log(err)
            })
        }
    }
}

//listen for app coming back online
window.addEventListener('online', uploadPizza)