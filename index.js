import express from 'express'
import jwt from 'jsonwebtoken'


const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello1")
})

app.post('/auth/login', (req, res) => {

    console.log(req.body)
    const token = jwt.sign({
        email: req.body.email,
        fullName: 'Ilua'
    }, 'secret123')

    res.json({
        success: true
    })

})

app.listen(4444, (err) => {

    if (err) {
        return console.log(err)
    }

    console.log('Server OK1')

})
