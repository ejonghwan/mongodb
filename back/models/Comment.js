import mongoose from 'mongoose';



const { Types, model, Schema } = mongoose;


const CommentModel = new Schema({
    content: { type: String, required: true, },
    user: { type: Types.ObjectId, required: true, ref: 'user', },
    blog: { type: Types.ObjectId, required: true, ref: 'blog', } 
}, {
    timestamps: true,
})



const Comment = model('comment', CommentModel)
export default Comment;




