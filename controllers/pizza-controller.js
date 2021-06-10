const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
    //get all the pizzas
    getAllPizzas(req, res) {
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch( err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    //get one pizza by its ID
    getPizzaById({ params }, res){
        Pizza.findOne({  _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this ID' })
                return;
            }
            res.json(dbPizzaData);
        })
        .catch( err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    //create a pizza
    // { body } is destructioring body out of the express.js request
    createPizza({ body }, res){
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(res => res.status(400).json(err))
    },

    //update pizza by id
    updatePizza({ params, body }, res){
        //the "where" in mongoose comes first {_id: params.id} THEN the updated data 'body' THEN any options on how data should be returned {new: true}
        Pizza.findOneAndUpdate({ _id: params.id}, body, { new: true }) //new: true instructs mongoose to return the new version of tthe document
        .then(dbPizzaData => {
            if (!dbPizzaData){
            res.status(404).json({ message: 'No pizza found with this ID'})
            return;
        }
        res.json(err => res.status(400).json(err))
        }).catch(err => res.status(400).json(err))
    },

    // delete a pizza
    deletePizza({ params }, res){
        Pizza.findByIdAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this id'})
                return
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.status(400).json(err))
    }

}


module.exports = pizzaController;