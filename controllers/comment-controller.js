const { Comment, Pizza } = require('../models')
const { db } = require('../models/Pizza')

const commentController = {
    addComment({ params, body }, res) {
        console.log(body)
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                //$push method add data to the array
                { $push: { comments: _id } },
                { new: true }
            )
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!'})
                return
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err))
    },

    addReply({ params, body }, res){
            Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
            ).then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'no pizza found with this id' })
                    return
                }
                res.json(dbPizzaData)
            }).catch(err => res.json(err))
    },

    removeReply( { params }, res){
        Comment.findOneAndDelete(
            { _id: params.commentId},
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
            ).then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err))
    },

    removeComment( { params }, res ) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if(!deletedComment){
                return res.status(404).json({ message: 'no comment found with this id'})
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            )
        })
        .then(dbPizzaData => {
            if(!dbPizzaData){
            res.status(404).json({ message: 'no pizza found with this id'})
            return
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.json(err))
    }
    /*The first method used here, .findOneAndDelete(), works a lot like .findOneAndUpdate(), as it deletes the document 
    while also returning its data. We then take that data and use it to identify and remove it from the associated pizza 
    using the Mongo $pull operation. Lastly, we return the updated pizza data, now without the _id of the comment in the 
    comments array, and return it to the user.*/

}

module.exports = commentController