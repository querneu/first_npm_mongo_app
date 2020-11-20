const express = require('express')
const path = require('path');
const auth = require('http-auth');
const mongoose = require('mongoose')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const Registration = mongoose.model('Registration')

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd')
})

router.get('/registrations', basic.check((req, res) => {
    Registration.find()
    .then((registrations) => {
        res.render('index', {title: 'Listando registros', registrations})
    })
    .catch(()=>{
        res.send('Algo deu errado!')
    })
}))

router.get('/', (req, res) => {
    res.render('form', { title: 'Registration form' })
})
router.post('/',
    [
        check('name')
            .isLength({ min: 1 })
            .withMessage('Please enter a name'),
        check('email')
            .isLength({ min: 1 })
            .withMessage('Please enter an email'),
    ],
    (req, res) => {
        console.log(req.body)
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            const registration = new Registration(req.body)
            registration.save().then(() => {
                res.send('Obrigado por registrar!')
            }).catch((err) => {
                console.log(err)
                res.send('Desculpe, algo deu errado!')
            })
        } else {
            res.render('form', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body
            })
        }
    }
)


module.exports = router