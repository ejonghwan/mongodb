import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import path from 'path'


// 
// import userRoutes from './routes/userRoutes.js'
// import blogRoutes from './routes/blogRoutes.js'
// import commentRoutes from './routes/commentRoutes.js'
import { userRoutes, blogRoutes, commentRoutes } from './routes/index.js'
// import { generateFakeData } from './faker.js'
import { generateFakeData } from './faker2.js'



const app = express();
app.use(express.json())
app.use(cors({ origin: true, credentials: true, }));

dotenv.config()

import User from './models/User.js'




const server = async () => {
    try {
        // const dbInfo = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@mongostudy.5g49u.mongodb.net/${process.env.DB_TITLE}?retryWrites=true&w=majority`
        const dbInfo = process.env.MONGO_URI;
        const PORT = process.env.PORT;

        // if(!dbInfo) throw new Error('is not defined MONGO_URI');
        // if(!PORT) throw new Error('is not defined PORT'); 

        // mongoose.set('debug', true) //mongoose query 보기

        await mongoose.connect(dbInfo)
        .then(result => console.log('몽고디비 연결성공'))



        // generateFakeData(10, 1, 10) 여기서 에러 나는 이유는 서버가 실행되기 전 axios호출했기 떄문..listen 이후에 axios 실행해야함
        
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


        app.listen(PORT, async () => {
            console.log(`listen ${PORT}`)
            
            // await generateFakeData(2, 10, 15)

          
        })
    } catch(err) {
        console.log(err)
    }
}


server();
