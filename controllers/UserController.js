import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 

import userModel from '../models/User.js'

export const register = async (req, res) => {

    try {

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

}

export const login = async (req, res) => {

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

}

export const getMe = async (req, res) => {

    try {

        const user = await userModel.findById(req.userId)
        const { passwordHash, ...userData } = user._doc

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        return res.json({
            ...userData,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Нет доступа',
        })
    }

}