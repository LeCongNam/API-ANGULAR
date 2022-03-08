const apiRoute1 = require('./apiv1')
const apiRoute2 = require('./apiv2')


function routes(app) {
   
    // api của Lê Công Nam
    app.use('/api',apiRoute1)

    // api của Phan Đình Khôi
    app.use('/api2',apiRoute2)

    app.use('/api/*', (req, res, err) => {
        res.status(409)
            .json({
                'status code': 409,
                'error-message': err
            })
    })
}

module.exports = routes;