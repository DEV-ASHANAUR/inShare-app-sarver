const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type : String,
        required: true
    },
    path: {
        type:String,
        required: true
    },
    size: {
        type:Number,
        require: true
    },
    uuid: {
        type: String,
        required:true
    },
    sender: {
        type:String,
        require: false
    },
    receiver: {
        type: String,
        required:false
    },
},{timestamps: true});

module.exports = mongoose.model("File",fileSchema);