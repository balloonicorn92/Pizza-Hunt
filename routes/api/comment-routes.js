const router = require('express').Router();
const {
    addComment,
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment)

// /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId')
.put(addReply)
.delete(removeComment)

//look at this pizza... then go to this paticular comment and then go and delete this one reply.... thank you.
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply)

module.exports = router