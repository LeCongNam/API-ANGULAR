const Product = require('../model/product.model')
var jwt = require('jsonwebtoken');
const { response } = require('express');
const User = require('../model/User.model')

class ProductController {
    // [GET]: /home
    home(req, res) {
        Product.find({})
            .exec()
            .then((data) => {
                res.json(data)
            })
            .catch(err => {
                res.json({
                    status: 404,
                    message: 'Cannot get data'
                })
            })
    }

    // [POST]: /create
    create(req, res) {
        // data:  product_name, price, product_properties, description
        let data = req.body
        let newProduct = new Product(data)
        newProduct.save()
            .then(() => {
                res.json({
                    status: 200,
                    message: 'Add product ok',
                    data: data
                })
            })
            .catch((err) => {
                console.log("Error DB: ", err);
                res.status(409)
                    .send({ message: "Insert Failse" })
            })
    }


    // [POST]: /login
    login(req, res) {
        let privateKey = process.env.PRIVATEKEY || 'Abc123'
        let { user_name, password, email } = req.body

        User.find({
            user_name: user_name,
        }, (err, user) => {
            if (user) {
                let token = jwt.sign(
                    { user_name, password, email },
                    privateKey,
                    { expiresIn: 20000 }
                )

                let userInfo = user[0]

                res.status(200).json({
                    message: "OK",
                    userInfo,
                    token

                })
            }
            if (err) {
                res.status(401).json({ message: "Login Failse!!" })
            }
        })


    }


    // [POST]: /register
    register(req, res) {
        const userModel = new User(req.body)
        userModel.save()
            .then((data) => {
                res.send({
                    status: 200,
                    message: "Register Success"
                })
            })
            .catch(err => res.json({
                message: "Register do not complete!! Please check data Register",
                err
            }))
    }

    // [PATH]: /update
    async update(req, res) {
        let { product_name_old, ...data } = req.body

        if (product_name_old) {
            await Product.find({ product_name: product_name_old }).exec()
                .then(dataRes => {
                    console.log("dataRes", dataRes[0]);
                    if (Number(dataRes) !== 0) {
                        let newDataProduct = Object.assign(dataRes[0], data)
                        console.log(newDataProduct);
                        Product.findOneAndUpdate({ product_name: product_name_old }, newDataProduct)
                            .exec()
                            .then(() => {
                                res.status(200).json({
                                    status: 200
                                })
                            })
                            .catch(err => res.status(409).json({
                                message: "Update Failse"
                            }))
                    }
                    return res.send({ err: "Product not found" })
                })

                return
        }

        return res.status(401).json({ message: "Please send [old project name]?" })
    }


    // [DELETE]: /delete
    delete(req, res) {
        let productName = req.body.product_name

        Product.findOneAndDelete({ product_name: productName }, 
            { sort: 'ASC' }, 
            (err, data) => {
            if (Number(data)) {
                res.json({
                    message: "Delete Success"
                })
                return
            }

            if (err) {
                res.status(409).json({
                    message: "Delete Failse!!",
                    err
                })
                return
            }
             res.status(404).json({ message: "Product not Found" })
        })

    }

}


module.exports = new ProductController