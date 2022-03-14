const express = require('express')
const router = express.Router()
const productController = require('../controller/ProductController')


router.get('/home',productController.home)

router.post('/create', productController.create)

router.post('/login', productController.login )

router.post('/register', productController.register )

router.patch('/update/:id',productController.update)

router.delete('/delete',productController.delete)


router.get('/', productController.home )


module.exports = router