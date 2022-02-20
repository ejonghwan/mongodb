import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// 
// import userRoutes from './routes/userRoutes.js'
// import blogRoutes from './routes/blogRoutes.js'
// import commentRoutes from './routes/commentRoutes.js'
import { userRoutes, blogRoutes, commentRoutes } from './routes/index.js'



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




        // routes
        app.use('/api/user', userRoutes)
        app.use('/api/blog', blogRoutes)
        app.use('/api/blog/:blogId/comment', commentRoutes)


        app.listen(5000, () => {
            console.log('listen')
        })
    } catch(err) {
        console.log(err)
    }
}


server();
