const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const project = new Schema({
    project_name: { type: String, default: 'project1', require },
    day_start:{type:Date, require },
    day_complete:{type:Date, require },
    author:{type:String, require },
    progress:{type: Number, require},
    state:{ type: String}
},{ timestamps:true } );
 
module.exports = mongoose.model('project', project);