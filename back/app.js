import express from 'express';

const app = express();




app.get('/test', (req, res) => {
    res.send('hoihohoho')
})

app.get('/user', (req, res) => {
    
})

app.listen(3000, () => {
    console.log('listen')
})