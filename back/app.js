import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'


const app = express();
app.use(express.json())
dotenv.config()



import User from './models/User.js'


const server = async () => {
    try {
        const dbInfo = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@mongostudy.5g49u.mongodb.net/${process.env.DB_TITLE}?retryWrites=true&w=majority`

        mongoose.set('debug', true) //mongoose query 보기

        await mongoose.connect(dbInfo)
        .then(result => console.log('몽고디비 연결성공'))
    

        // model

        // const user = new User({
        //     username: 'jonghwan222',
        //     name: { first: 'lee222', last: 'jonghwan222' },
        //     age: 30,
        //     email: 'jjongrrr@naver.com222'
        // })
    
        // user.save();


        app.post('/api/user/signup', async (req, res) => {
            try {
                console.log(req.body)
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



        app.get('/api/user/alluser', async (req, res) => {
            try {
                const user = await User.find({});
                res.status(200).json({ user })
            } catch(err) {
                console.log(err)
            }
            
        })


        app.get('/api/user/:userId', async (req, res) => {
            try {
                const { userId } = req.params;

                if(!mongoose.isValidObjectId(userId)) { //isValidObjectId는 objectId 형식인지 불린값으로 리턴해줌
                    res.status(400).json({ err: 'invalid userId' })
                }
                const user = await User.findOne({ _id: userId }) 
            
                return res.status(200).json(user)
            } catch(err) {
                console.log(err)
            } 
        })


        app.delete('/api/user/delete/:userId', async(req, res) => {
            try {
                const { userId } = req.params
                if(!mongoose.isValidObjectId(userId)) {
                    return res.status(400).json({ err: 'invalid userId' })
                }

                const user = await User.findByIdAndDelete({ _id: userId })

                return res.status(200).json(user)

            } catch(err) {
                console.log(err)
            }
        })


        app.put('/api/user/update/:userId', async(req, res) => {
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

                let bodyObj = {}
                if(req.body.age) bodyObj.age = req.body.age
                if(req.body.name) bodyObj.name = req.body.name
                if( req.body.email) bodyObj.email = req.body.email

                console.log(bodyObj, 'asdasd')
            
               
                // "name": { "first": "cc", "last": "ee" }

                // console.log(req.body)
                // const user = await User.findByIdAndUpdate(userId, {
                //     // username: req.body.username,
                // //    $set: { bodyObj },
                
                // }, { new: true })
                const user = await User.findByIdAndUpdate(userId, bodyObj, { new: true })

                res.status(200).json(user)

            } catch(err) {
                console.log(err)
            }
        })
        

        // test
        app.post('/api/user/test/:userId', async(req, res) => {
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

        app.put('/api/user/test/:userId', async(req, res) => {
            try {
                const { userId } = req.params;
                const user = await User.findOneAndUpdate(userId, { 
                    // $pull: {
                    //     array: { _id: '61c1f85f11fb31321cc79973' } // $pull 되는구나.. 만약 배열안 객체에 또 객체가 있을 경우 한버 더 타고 들어가면 됨.
                    // }

                    
                }, { new: true })

                res.json(user)
            } catch(err) {
                console.log(err)
            }
        })

    
        // app.get('/test', (req, res) => {
        //     res.send('hoihohoho')
        // })
    
        // app.get('/user', (req, res) => {
            
        // })
    
        app.listen(3000, () => {
            console.log('listen')
        })
    } catch(err) {
        console.log(err)
    }
}


server();
