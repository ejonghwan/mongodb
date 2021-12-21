import mongoose from 'mongoose'

// 스케마는 첫번째 인자로 저장할 데이터들 row를 받고 두번째 인자로 옵션들을 받음. 둘다 객체로
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        first: { type: String, required: true,},
        last: { type: String, required: true, }
    },
    age: Number,
    email: String,
    array: [
        { name: { type: String } }
    ]
}, {
    timestamps: true, //생성한 시간을 만들어줌, 업데이트할 때마다 업데이트키를 생성해줌 
})

const User = mongoose.model('user', UserSchema)
export default User;