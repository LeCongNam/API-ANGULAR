const mongoose = require('mongoose')



async function Connect() {
    try {
        await mongoose.connect(process.env.URI);
        console.log('Connect Successfully');
    } catch (error) {
        console.log('Connected Failse: ',error);
    }
}


module.exports = { Connect };