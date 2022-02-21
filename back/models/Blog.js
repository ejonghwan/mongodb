import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose;


const BlogSchema = new Schema({
    title: { type: String, required: true, },
    content: { type: String, required: true, },
    isLive: { type: Boolean, default: false, },
    user: { type: Types.ObjectId, required: true, ref: 'user' },
}, {
    timestamps: true,
})

// comments 필드가 없으니 가상으로 만듦
// 이 필드는 db에 저장되는게 아님..데이터 보내줄 때 추가돼서 보내줌
BlogSchema.virtual('comments', {
    ref: "comment", //어디를 참조할건지
    localField: "_id", //이 필드에서 어떤 것을 
    foreignField: "blog", // 이 필드랑 어떤 관계냐 ...Comment 모델에 들어가보면 blog로 필드이름 저장되어있음.. ref아님
})

BlogSchema.set("toObject", { virtuals: true });
BlogSchema.set("toJSON", { virtuals: true });


const Blog = model('blog', BlogSchema);

export default Blog;