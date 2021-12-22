import express from 'express';


// model
import Blog from '../models/Blog.js'


const router = express.Router();

router.get('/', async (req, res) => {
    try {

    } catch(err) {
        console.log(err)
    }
})


export default router;