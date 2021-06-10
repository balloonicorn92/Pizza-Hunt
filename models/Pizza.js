const {  model, Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
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
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
        }
    ]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});
//get total count of comments on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length
})
//create Pizza model 
const Pizza = model('Pizza', PizzaSchema);

//export
module.exports = Pizza;