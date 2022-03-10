const express = require('express')
const router = express.Router()
const projectControler = require('../controller/ProjectController')


router.get('/home',projectControler.home)

router.post('/create', projectControler.create)

router.post('/login', projectControler.login )

router.post('/register', projectControler.register )

router.patch('/update',projectControler.update)

router.delete('/delete/:id',projectControler.delete)


router.get('/', projectControler.home )


module.exports = router