import mongoose from 'mongoose'
import { CommentModel } from './Comment.js'

const { Schema, model, Types } = mongoose;


const BlogSchema = new Schema({
    title: { type: String, required: true, },
    content: { type: String, required: true, },
    isLive: { type: Boolean, default: false, },
    user: { 
        _id: { type: Types.ObjectId, required: true, ref: 'user'},
        username: { type: String, required: true },
        name: {
            first: { type: String, required: true,},
            last: { type: String, required: true, }
        },
    },
    // comments: [{}]
    comments: [CommentModel],// 스키마 그대로 넣어도됨
    
    commentCount: { type: Number, required: true, default: 0, }
}, {
    timestamps: true,
})

// BlogSchema.index({ user: 1, age: 1 }) //복합키는 이렇게 검
BlogSchema.index({ title: 'text', content: 'text' }) //serch - text inexing... 인덱싱은 중간에 저장해도 키가 만들어짐


/*
    ## 인덱싱 중요!
    { type: a, $lte: { age: 20 } } // 타입 a이면서 age: 20이하를 찾을 때 둘다 인덱싱이 되어있다면 
    찾을 때 분포도가 높은걸 먼저 분류해놓는게 좋음. (type은 종류가 많아서 다 찾고 다시 한번 age를 인덱싱해야하는데 age를 먼저 분류해놓고 type을 분류해두면 훨씬 빠름)
    (이 예는 둘 다 따로 인덱싱이 되어있고... 만약 복합키로 묶여있다면 복합키를 우선으로 탐색함..복합키가 더 빠름)

    작동: 몽고디비가 먼저 type key로 몇개 검색해보고 age key 몇개 검색해보고 복합키로도 몇개 더 검색해보고 더 빠른걸 찾아내서 그걸로 탐색해줌 
    !!(selectivity가 높은 애들부터 인덱스.. 예로 그룹이 되어있는 type category같은건 별로 좋지않음)


    ## 인덱스를 막 만들면 안되는 이유! (테스트해보고 써야됨)
    1. 인덱스를 만들면 용량이 너무 많아짐... 
        - 저장은 하드에 되지만 이걸 읽을 땐 메모리를 쓰기 때문에 ...
        - 메모리 가격이 비쌈
    2. CRUD에서 R은 빠르지만 CUD는 느려짐..
        - 생성/추가/삭제 할 때 인덱스도 생성해줘야되고 매칭도 시키기 때문에 ...치명적

    
    3. 하나의 글 안에 코멘트가 있고 코멘트에 인덱싱을 해줄 경우 하나의 블로그에 달린 코멘트만큼 인덱싱 가상주소도 늘어나기 때문에 매우 안좋아짐

    !!해결방법은 양이 많지 않을땐 인덱싱 빼고 개발하고 트래픽 보면서 양이 많아지면 익스플레인플랜으로 테스트해보고 적용하는게 좋음

    잘 정리되어 있는 곳
    https://velopert.com/560
    https://ohgym.tistory.com/43
    https://ryu-e.tistory.com/1



    ## index 고려할 사항 (집착 금지. 일단 개발하고 트래픽 발생하는 것부터 천천히 도입)
    1. CUD vs R
    2. memory
    3. query
    4. selectivity


    ## test
    >db.user.find({score:"23"}).explain("executionStats").executionStats.executionTimeMillis

    https://docs.mongodb.com/manual/reference/method/cursor.explain/


*/


/*  
    ## 가상 필드
    comments 필드가 없으니 가상으로 만듦
    이 필드는 db에 저장되는게 아님..데이터 보내줄 때 추가돼서 보내줌
*/
// BlogSchema.virtual('comments', {
//     ref: "comment", //어디를 참조할건지
//     localField: "_id", //이 필드에서 어떤 것을 
//     foreignField: "blog", // 이 필드랑 어떤 관계냐 ...Comment 모델에 들어가보면 blog로 필드이름 저장되어있음.. ref아님
// })

// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });


const Blog = model('blog', BlogSchema);

export default Blog;