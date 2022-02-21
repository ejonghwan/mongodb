import express from 'express';
import mongoose from 'mongoose';

// model
import Blog from '../models/Blog.js'
import User from '../models/User.js'


const router = express.Router({ mergeParams: true, });


// @ POST blog post
// @ /api/blog
router.post('/', async (req, res) => {
    try {
        const { title, content, isLive, userId } = req.body;
        if(typeof title !== 'string') return res.status(400).send('title string');
        if(typeof content !== 'string') return res.status(400).send('title string');
        if(typeof isLive !== 'boolean') return res.status(400).send('title boolean');
        if(!mongoose.isValidObjectId(userId)) return res.status(400).send('is not objectId');

        const user = await User.findById(userId)
        // console.log('user!!!!!!!!!', user)
        const blog = await new Blog({ ...req.body, user })
        // const blog = await new Blog({ ...req.body, user })
        blog.save();
        
        return res.status(200).json(blog)



    } catch(err) {
        console.log(err)
    }
})

// @ GET 
// @ /api/blog/allBlog
router.get('/allBlog/:limitNum', async (req, res) => {
    try {
        const { limitNum } = req.params;
        let limitNumC = parseInt(limitNum)
        // console.log('asdasdasd: ', limitNumC)
        const allBlog = await Blog.find().limit(limitNumC).populate([{ path: 'user' }, { path: 'comments', populate: { path: 'user' } }])
        return res.status(200).json(allBlog)

    } catch(err) {
        console.log(err)
    }
})


// @ GET 
// @ /api/blog/:blogId
router.get('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params
        if(!mongoose.isValidObjectId(blogId)) res.status(400).send('is not objectId')
        
        const findBlog = await Blog.findById(blogId)
        return res.status(200).json(findBlog)


    } catch(err) {
        console.log(err)
    }
})


// @ PATCH
// @ /api/blog/update/:blogId/live
router.patch('/update/:blogId/live', async (req, res) => {
    try {

        const { isLive } = req.body;
        const { blogId } = req.params;
        if(typeof isLive !== 'boolean') return res.status(400).send('is not boolean');
        if(!mongoose.isValidObjectId(blogId)) return res.status(400).send('is not objectId');

       
        const findBlog = await Blog.findByIdAndUpdate(blogId, { isLive: isLive }, { new: true })
        
        console.log(findBlog)
        return res.status(200).json(findBlog)

    } catch(err) {
        console.log(err)
    }
})


// @ PUT
// @ /api/blog/update/:blogId
router.put('/update/:blogId', async (req, res) => {
    try {

        if(!title && !content) return res.status(400).send('is not title & content ')
        const { title, content, isLive } = req.body;
        const { blogId } = req.params;
        if(title && typeof title !== 'string') return res.status(400).send('title string');
        if(content && typeof content !== 'string') return res.status(400).send('title string');

        const newContent = {}
        if(title) newContent.title = title;
        if(content) newContent.content = content;
        const findBlog = await Blog.findByIdAndUpdate(blogId, { $set: newContent }, { new: true })
        
        console.log(findBlog)
        return res.status(200).json(findBlog)

    } catch(err) {
        console.log(err)
    }
})





// @ DELETE
// @ /api/blog/delete/:blogId
router.delete('/delete/:blogId', async (req, res) => {
    try {
        
        const { blogId } = req.params;
        if(!mongoose.isValidObjectId(blogId)) return res.status(400).send('is not objectId');
        
        const blogDelete = await Blog.findByIdAndDelete(blogId, { new: true });
        return res.status(200).send(blogDelete)
    } catch(err) {
        console.log(err)
    }
})

        


export default router;