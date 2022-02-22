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

        // const user = await User.findById(userId);
        // const blog = await Blog.findById(blogId);
        // 여기서는 promise.all
        /*
            위에껀 동기(직렬)로 user불러오고 기다렸다가 blog를 불러오지만
            아래껀 비동기(병렬)로 user, blog를 한번에 불러옴 
            time: 171ms -> 97ms 
        */
        const [user, blog] = await Promise.all([
            User.findById(userId),
            Blog.findById(blogId)
        ])


        // console.log('asdasdasd', req.body)
        const createComment = await new Comment({ content, user, blog })


        await Promise.all([  //두개는 직렬로 할 필요 없어서..
            createComment.save(),
            // Blog모델에 코멘트 모델 넣어놨고 ...코멘트를 추가하거나 업데이트할때 "코멘트api안에서 블로그를" 업데이트해줘야됨 
            await Blog.updateOne({ _id: blogId }, { $push: { comments: createComment } })
        ])
        
        



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

        /*
            comments._id - Blog안에 comments배열이 있을텐데 거기안에서 commentId를 선택
            comments.$.content - 선택한 코멘츠의 인덱스를 .$ 이게 지정해줌... 해당 인덱스 content에 넣어줌
        */
        await Blog.updateOne({ 'comments._id': commentId }, { 'comments.$.content': content })


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
        await Blog.updateOne({ 'comments._id': commentId }, { $pull: { comments: { _id: commentId } } })
        return res.status(200).json(deleteComment);

    } catch(err) {
        console.log(err)
    }
})







export default route;
