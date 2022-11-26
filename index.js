import express from 'express'
import jwt from 'jsonwebtoken' 
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'
import userModel from './models/User.js'

mongoose.connect('mongodb+srv://allgloryforrobots:02121991a@cluster0.zjvmd.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB error', err))

const app = express() 
app.use(express.json())

app.post('/auth/reqister', registerValidation, async (req, res) => {

    try {

        const errors =  validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const doc = new userModel({
            email: req.body.email,
            fullName: req.body.fullName, 
            avatarUrl: req.body.avatarUrl, 
            passwordHash
        })

        const user = await doc.save()
        res.json(user)

    } catch (err) {
        res.status(500).json({
            message: 'Не удалось зарегестрироваться',

        })
    }

})

app.listen(4444, (err) => {

    if (err) {
        return console.log(err)
    }

    console.log('Server OK')

})
