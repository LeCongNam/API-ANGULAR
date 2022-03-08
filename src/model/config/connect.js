const mongoose = require('mongoose')
var url = "mongodb+srv://lecongnam:Vobichuyen0612@cluster0.lgnhj.mongodb.net/angular_api?retryWrites=true&w=majority"

async function Connect() {
    try {
        await mongoose.connect(url);
        console.log('Connect Successfully');
    } catch (error) {
        console.log('Connected Failse: ', error);
    }
}


module.exports = { Connect };