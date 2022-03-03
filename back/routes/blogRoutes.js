import express from 'express';
import mongoose from 'mongoose';

// model
import Blog from '../models/Blog.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'


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
router.get('/allBlog', async (req, res) => {
    try {
        const { page } = req.query;
        let p = parseInt(page);
        const allBlog = await Blog.find()
            .skip(p * 6)
            .limit(6)
            // .populate([{ path: 'user' }, { path: 'comments', populate: { path: 'user' } }])
        return res.status(200).json(allBlog)


        /*
            모델 내장하냐 안하냐 ...기본 최적화 
            1. N < 100 = 내장 
            2. 100 < N < 1000 = 부분(id) 내장  (퍼퓰레이트)
            3. 1000 < N  =  관계  (버추얼 필드생성 후 퍼퓰레이트)
            4. N을 다양한 조건으로 탐색 = 관계
            - 관계: 부모 자식문서
            - 2번은 이미 인덱스가 걸려있는 _id를 사용하기에 상관없지만... 3번같은 경우엔 comments는 인덱스가 걸려있지만 comments의 blog에는 인덱스처리가 안되어있어서 blog로 탐색하려면 따로 인덱스를 걸어줘야한다

        
            ! 그럼 코멘트가 1000개 있으면 무조건 내장하면 안될까 ? 그건 아님.... 아래 
    
            글 안에 모든 코멘트를 내장할 필요가 없음.. 어차피 보여지는 것만 그때그때 내장하면 됨
            예) 글안에 코멘트 페이지네이션
            
            - 페이지 네이션 하기 
            - 코멘트가 총 몇개인지는 알아야함 
            - 최신 코멘트만 가져오기




            모델 생성 시 만들어지는 _id는 유니크, 인덱스처리가 되어있음 
        */



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
        
        // 코멘트 총 갯수 이렇게 해도 되는데 모델에 내장하는게 더 좋음 
        // const commentCount = await Comment.find({ blog: blogId }).countDocuments();
        // console.log('코멘트 카운트: ', commentCount)


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