const mongoose = require('mongoose')
var url ="mongodb+srv://lecongnam:Vobichuyen0612@cluster0.j3gct.mongodb.net/clean-blog?retryWrites=true&w=majority"

async function Connect() {
    try {
        await mongoose.connect(process.env.URI |url);
        console.log('Connect Successfully');
    } catch (error) {
        console.log('Connected Failse: ',error);
    }
}


module.exports = { Connect };