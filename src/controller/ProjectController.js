const Project = require('../model/Project.model')
var jwt = require('jsonwebtoken');
const { response } = require('express');
const User = require('../model/User.model')

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
    async    update(req, res) {
        let { project_name_old, ...data } = req.body

        if (project_name_old) {
            await Project.find({ project_name: project_name_old }).exec()
                .then(dataRes => {
                    if (Number(dataRes) !== 0) {
                        let newDataProject = Object.assign(dataRes[0], data)
                        console.log(newDataProject);
                        Project.findOneAndUpdate({ project_name: project_name_old }, newDataProject)
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
                    return res.send({ err: "Project not found" })
                })
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

            if (err || data == null || data ==[]) {
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