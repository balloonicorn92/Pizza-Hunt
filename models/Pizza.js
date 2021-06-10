const {  model, Schema } = require('mongoose');
//name of pizza
//name of user
//timestamp of creation
//timestamp of updates
//pizza size
//pizza toppings

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
});

//create Pizza model 
const Pizza = model('Pizza', PizzaSchema);

//export
module.exports = Pizza;