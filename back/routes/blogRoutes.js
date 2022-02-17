import express from 'express';
import mongoose from 'mongoose';


// model
import Blog from '../models/Blog.js';
import User from '../models/User.js'



const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { title, content, isLive, userId } = req.body;
        if(typeof title !== 'string') res.status(400).send({ err: 'title is required' });
        if(typeof content !== 'string') res.status(400).send({ err: 'content is required' });
        if(isLive && typeof isLive !== 'boolean') res.status(400).send({ err: 'is not boolean' });
        if(!mongoose.isValidObjectId(userId)) res.status(400).send({ err: 'userId is invalid' });
        
        const user = await User.findById(userId);
        if(!user) res.status(400).send({ err: 'user does not exist' })


        let blog = new Blog({ ...req.body, user })
        await blog.save();

        return res.status(200).json(blog)
        
    } catch(err) {
        console.log(err)
    }
})



router.get('/allBlog', async (req, res) => {
    try {
        
        const allBlog = await Blog.find()
        res.status(200).json(allBlog) 

    } catch(err) {
        console.log(err)
    }
})

router.get('/', async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err)
    }
})


router.get('/', async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err)
    }
})


router.get('/', async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err)
    }
})



export default router;