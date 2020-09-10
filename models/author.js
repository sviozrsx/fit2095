let mongoose = require('mongoose');

let authorSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {
        firstName:{type:String,
        required: true,
        } ,
        lastName:String,
    },
    dob:Date,
    address: {
        state:{
            type:String,
            validate: {
                validator: function (stateString){
                    return stateString.length == 2 || stateString.length == 3;
                },
                message: 'State should be either 2 or 3 characters. e.g. VIC or WA'
            }
        },

        suburb: String,
        street: String,
        unit: String,

    },
    numBooks: {
        type:Number,
        validate: {
            validator: function(booksWritten){
                return booksWritten <= 150 && booksWritten >= 1;
            },
            message: 'Number of books written needs to be between1'
        }
    }

    
});

module.exports = mongoose.model('Author',authorSchema);