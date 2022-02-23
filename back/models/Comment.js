import mongoose from 'mongoose';



const { Types, model, Schema } = mongoose;


const CommentModel = new Schema({
    content: { type: String, required: true, },
    user: { 
        _id: { type: Types.ObjectId, required: true, ref: 'user'},
        username: { type: String, required: true },
        name: {
            first: { type: String, required: true,},
            last: { type: String, required: true, }
        },
    },
    blog: { type: Types.ObjectId, required: true, ref: 'blog', } 
}, {
    timestamps: true,
})


CommentModel.index({ blog: 1, createAt: -1 }); // blog에는 인덱싱 안되어있어서 한번 복합키로 인덱스만들어줌 


export { CommentModel }

const Comment = model('comment', CommentModel)
export default Comment;




