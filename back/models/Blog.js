import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose;


const BlogSchema = new Schema({
    title: { type: String, required: true, },
    content: { type: String, required: true, },
    isLive: { type: Boolean, default: false, },
    user: { type: Types.ObjectId, required: true, ref: 'user' }
}, {
    timestamps: true,
})


const Blog = model('blog', BlogSchema);

export default Blog;