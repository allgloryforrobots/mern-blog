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

app.post('/auth/login', async (req, res) => {

    try {

        const user = await userModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль',
                // message: 'Пользователь не найден'
                // защита от хакинга
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        console.log(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign(
            {
            _id: user._id,
            }, 
            'secret',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться',

        })
    }

})

app.post('/auth/reqister', registerValidation, async (req, res) => {

    try {

        const errors =  validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new userModel({
            email: req.body.email,
            fullName: req.body.fullName, 
            avatarUrl: req.body.avatarUrl, 
            passwordHash: hash
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
            _id: user._id,
            }, 
            'secret',
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
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
