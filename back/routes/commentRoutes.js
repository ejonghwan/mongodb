import mongoose from 'mongoose';
import express from 'express';


// model
import Comment from '../models/Comment.js'
import User from '../models/User.js';
import Blog from '../models/Blog.js';



const route = express.Router({ mergeParams: true, });


// @ POST
// @ /api/blog/:blogId/comment
route.post('/', async (req, res) => {
    try {

        const { content, userId } = req.body;
        const { blogId } = req.params;

        if(content && typeof content !== 'string') return res.status(400).send('is requied content') 
        if(!mongoose.isValidObjectId(userId)) return res.status(400).send('is not objectId')
        if(!mongoose.isValidObjectId(blogId)) return res.status(400).send('is not objectId')

        const user = await User.findById(userId);
        const blog = await Blog.findById(blogId);

        console.log('asdasdasd', req.body)
        const createComment = await new Comment({ content, user, blog })

        createComment.save()

        return res.status(200).json(createComment);

    } catch(err) {
        console.log(err)
    }
})


// @ GET
// @ /api/blog/:blogId/comment/allComment
route.get('/allComment', async (req, res) => {
    try {
        const { blogId } = req.params; 
        if(!mongoose.isValidObjectId(blogId)) return res.status(400).send('is not objectId')
        
        const allComment = await Comment.find({blog: blogId});
        return res.status(200).json(allComment);

    } catch(err) {
        console.log(err)
    }
})


// @ GET
// @ /api/blog/:blogId/comment/:commentId
route.get('/:commentId', async (req, res) => {
    try {
        const { blogId, commentId } = req.params; 
        if(!mongoose.isValidObjectId(blogId)) return res.status(400).send('is not objectId')
        
        const findOneComment = await Comment.findOne({ $and: [ {blog: blogId}, {_id: commentId}] })
        return res.status(200).json(findOneComment);

    } catch(err) {
        console.log(err)
    }
})

// @ PUT
// @ /api/blog/:blogId/comment/:commentId
route.put('/:commentId', async (req, res) => {
    try {
        const { blogId, commentId } = req.params; 
        const { content } = req.body;
        if(!mongoose.isValidObjectId(blogId)) return res.status(400).send('is not objectId')
        if(typeof content !== 'string') return res.status(400).send('content')
        

        const updateComment = await Comment.findByIdAndUpdate(commentId, { $set: { content } }, { new: true })


        return res.status(200).json(updateComment);

    } catch(err) {
        console.log(err)
    }
})


// @ DELETE
// @ /api/blog/:blogId/comment/:commentId
route.delete('/:commentId', async (req, res) => {
    try {
        const { blogId, commentId } = req.params; 

        if(!mongoose.isValidObjectId(blogId)) return res.status(400).send('is not objectId asdasd')

        
        const deleteComment = await Comment.findByIdAndDelete(commentId)

        return res.status(200).json(deleteComment);

    } catch(err) {
        console.log(err)
    }
})







export default route;
