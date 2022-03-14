const Project = require('../model/Project.model')
var jwt = require('jsonwebtoken');
const { response } = require('express');
const User = require('../model/User.model')
const bcrypt = require('bcrypt');
const { compare } = require('bcrypt');

class ProjectController {
    // [GET]: /home
    home(req, res) {
        Project.find({})
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
        // data:  project_name, day_start, day_complete, author, progreess
        let data = req.body

        let newProject = new Project(data)
        newProject.save()
            .then(() => {
                res.json({
                    status: 200,
                    message: 'Add project ok',
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
        let { user_name, password } = req.body

        User.find({
            user_name: user_name,
        }, (err, user) => {
            if (user) {

                try {
                    var salt = bcrypt.genSaltSync(10)
                    var hash = bcrypt.hashSync('Abc123', salt)
                    
                    var compareData = bcrypt.compareSync(password,user[0].password)
                   
                    if (compareData) {
                        var token = jwt.sign(
                            { user_name, password },
                            privateKey,
                            { expiresIn: 20000 }
                        )
                        let userInfo = user[0]
                        res.status(200).json({
                            message: "OK",
                            'data': {
                                'user': userInfo,
                                token
                            }

                        })
                    } else {
                        res.json({ message: "Password or user name do not Exists" });
                    }
                } catch (error) {
                    res.json({ error });
                }

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
        let { ...data } = req.body
        let id = req.params.id

        if (data?.project_name) {
            await Project.find({ _id: id }).exec()
                .then(dataRes => {
                    if (Number(dataRes) !== 0) {
                        Project.findOneAndUpdate({ _id: id }, data)
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
                    // return res.send({ err: "Project not found" })
                })
                .catch(err => res.status(404).json({ err: "Project not found" }))
            return
        }

        return res.status(401).json({ message: "Please send [old project name]?" })
    }

    // [DELETE]: /delete
    delete(req, res) {
        let projectId = req.params.id
        Project.findOneAndDelete({ _id: projectId },
            { sort: 'ASC' },
            (err, data) => {
                if (data?._id) {
                    res.json({
                        message: "Delete Success"
                    })
                    return
                }

                if (err || data == null || data == []) {
                    res.status(409).json({
                        message: "Delete Failse!!",
                        // err
                    })

                    return
                }
            })



    }

}


module.exports = new ProjectController