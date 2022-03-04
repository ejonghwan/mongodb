import express from 'express';
import mongoose from 'mongoose'

// model\
import { User, Comment, Blog } from '../models/index.js'


const router = express.Router();



// @ path  /api/user/signup
router.post('/signup', async (req, res) => {
    try {
        // console.log(req.body)
        let { username, name } = req.body; // 클라이언트 입력오류는 여기서 체크해줌

        if(!username) return res.status(400).send({ err: 'username is required' })
        if(!name || !name.first || !name.last) return res.status(400).send({ err: 'name is required' })


        const user = new User(req.body)
        await user.save();
        res.status(200).send(user)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ err: err.message })
    }
    
})



// @ path  /api/user/alluser
router.get('/alluser', async (req, res) => {
    try {
        const user = await User.find({});
        res.status(200).json({ user })
    } catch(err) {
        console.log(err)
    }
    
})


// @ path  /api/user/
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
       

        if(!mongoose.isValidObjectId(userId)) { //isValidObjectId는 objectId 형식인지 불린값으로 리턴해줌
            res.status(400).json({ err: 'invalid userId' })
        }
        const user = await User.findOne({ _id: userId }) 
    
        //express test 
        const hehe = res.type('json')
        console.log('console: ', hehe)
        // return res.status(200).json(hehe)

        return res.status(200).json(user)
    } catch(err) {
        console.log(err)
    } 
})

// @ DELETE
// @ path  /api/user/delete/:userId
router.delete('/delete/:userId', async(req, res) => {
    try {
        const { userId } = req.params
        if(!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ err: 'invalid userId' })
        }
    
        let [ user ] = await Promise.all([
             User.findByIdAndDelete({ _id: userId }),
             Blog.deleteMany({ 'user._id': userId }),
             Blog.updateMany({ 'comments.user._id': userId }, { $pull: { comments: { 'user._id': userId } } }),
             Comment.deleteMany({ 'user._id': userId }),
        ])
        

        return res.status(200).json(user)

    } catch(err) {
        console.log(err)
    }
})


// @ path  /api/user/update/:userId
router.put('/update/:userId', async(req, res) => {
    try {
        const { userId } = req.params 
        // console.log(req.body, 'asdasdasd')

        if(!mongoose.isValidObjectId(userId)) {
           res.status(400).json({ err: 'invalid userId' }) 
        }
        if(!req.body.age && !req.body.name) {
            res.status(400).json({ err: 'age or name is required' }) 
        }
        if(req.body.age && typeof req.body.age !== 'number') {
            res.status(400).json({ err: 'age must be a number' }) 
        }
        if(req.body.name && typeof req.body.name.first !== 'string' && typeof req.body.name.last !== 'string') {
            return res.status(400).json({ err: 'name must be a string' }) 
        }

        // 조회와 업데이트 모두 한방에 ! 방법 1 
        // let bodyObj = {}
        // if(req.body.age) bodyObj.age = req.body.age
        // if(req.body.name) bodyObj.name = req.body.name
        // if( req.body.email) bodyObj.email = req.body.email

        // console.log(bodyObj, 'asdasd')
        // "name": { "first": "cc", "last": "ee" }

        // console.log(req.body)
        // const user = await User.findByIdAndUpdate(userId, {
        //     // username: req.body.username,
        // //    $set: { bodyObj },
        
        // }, { new: true })
        // const user = await User.findByIdAndUpdate(userId, bodyObj, { new: true })


        // 조회 한번 하고 가져온 다음 업데이트하는 방법 2
        const user = await User.findById(userId) //가져와서 
        if(req.body.age) user.age = req.body.age; // 검증함 하고 !
        if(req.body.name) user.name = req.body.name;
        user.save()  //담는다! 여기서 save()는 실제로 update 메서드가 실행됨..


        
        // 중요!! user 전체를 업데이트 하려면 이렇게 해도 되는데 .. 개별로 하려면 필터 옵션 줘야됨 
        // await Comment.updateMany({ 'user._id': userId }, { user }, { new: true });
        // // await Blog.updateMany({ 'comments.user._id': userId }, { 'commnets.$.user': user }, { new: true }); // 이렇겐 안되나 ..?
        // await Blog.updateMany({ 'comments.user._id': userId }, { 'comments.$[co].user': user }, { arrayFilters: [{ 'co.user._id': userId }] });
        // await Blog.updateMany({ 'user._id': userId }, { user }, { new: true });
        
        
        if(req.body.name.first) {
            await Promise.all([
                 Blog.updateMany({ 'user._id': userId }, { 'user.name.first': user.name.first }),
                 Comment.updateMany({ 'user._id': userId }, { 'user.name.first': user.name.first }),
                 Blog.updateMany({}, { 'comments.$[ele].user.name.first': user.name.first }, { arrayFilters: [ {"ele.user._id": userId} ] })
            ])
            /* 
                await Blog.updateMany({}, { 'comments.$[ele].users.$[user].username': user.name.first }, { arrayFilters: [ {"ele.user._id": userId}, {"user._id": userId} ] })

                comments 필드안에 users 배열이 있고 그 안에 username을 필터링해서 바꿔줌 

            */
        }
        if(req.body.name.last) {
            await Blog.updateMany({ 'user._id': userId }, { 'user.name.last': user.name.last })
            await Comment.updateMany({ 'user._id': userId }, { 'user.name.last': user.name.last })
        }

        
        // co 62143c5831b0efa850896ca0
        // bl 62143c5831b0efa850896c86
        // u 62143c5731b0efa850896c82

        
        // console.log(user)
        // 이런식으로 했을 땐 { new: true } 도 필요없음
        res.status(200).json(user)


    } catch(err) {
        console.log(err)
    }
})


// @ path  /api/user/test/:userId
// test
router.post('/test/:userId', async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, {
            $push: { array: { name: req.body.name } }
        }, {new: true})
        res.json(user)

    } catch(err) {
        console.log(err)
    }
})


// @ path  /api/user/test/:userId
router.put('/test/:userId', async(req, res) => {
    try {
        const { userId } = req.params;

        // 내가 하던거
        // const user = await User.findOneAndUpdate(userId, { 
        //     // $pull: {
        //     //     array: { _id: '61c1f85f11fb31321cc79973' } // $pull 되는구나.. 만약 배열안 객체에 또 객체가 있을 경우 한버 더 타고 들어가면 됨.
        //     // }
        // }, { new: true })

        // 쌤꺼
        // console.log(req.body, "asdasdadasdas")
        // 와우...됐다 !!!!
        const user = await User.findOneAndUpdate({ _id: userId, "array._id":"61c1f7c211fb31321cc7996c"}, {"array.$.name": req.body.name}, { new: true })
        

        res.json(user)
    } catch(err) {
        console.log(err)
    }
})


// router.get('/test', (req, res) => {
//     res.send('hoihohoho')
// })

// router.get('/user', (req, res) => {
    
// })


export default router;