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

export { CommentModel }

const Comment = model('comment', CommentModel)
export default Comment;




