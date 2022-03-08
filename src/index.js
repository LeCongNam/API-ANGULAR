const express = require('express')
const app = express()
var cors = require('cors')
var morgan = require('morgan')
const routes = require('./routes')
const db = require('./model/config/connect')
require('dotenv').config()




// Logger 
app.use(morgan('dev'))

// Fix cors allow /*/
app.use(cors())

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())


// Connect DB
db.Connect()

// Initial Router
routes(app)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running http://localhost:${process.env.PORT || 3000}`);
})
