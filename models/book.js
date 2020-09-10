let mongoose = require('mongoose');

let bookSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String,
        required : true
    },
    author:{
        type: mongoose.Types.ObjectId,
        ref: "Author"
    },
    isbn:{
        type:String,
        validate:{
            validator: function(isbnString){
                return isbnString.length == 13;

            },
            message:'ISBN needs to be 13 digits exactly.'
        }

    },
    dop: {
        type:Date,
        default: Date.now()
    },
    summary: String

    

});

module.exports = mongoose.model('Book',bookSchema);