let mongodb=require('mongodb');
let express = require('express');
let ejs = require('ejs');
let bodyParser=require('body-parser');
let mongoose = require('mongoose');
let Author = require('./models/author');
let Book = require('./models/book');
const author = require('./models/author');

// Express Configs
let app = express();
app.listen(8080);
app.use(bodyParser.urlencoded({extended:false}));
app.engine('html', ejs.renderFile);
app.set('view engine','html');
app.use(express.static('img'))
//


let MongoClient = mongodb.MongoClient;
let print = console.log;
let DB_URL = 'mongodb://localhost:27017/week6db';
let db; //the database
let library;  //the collection
let authorLib; // author lib
MongoClient.connect(DB_URL,{useUnifiedTopology: true}, function(err,client){
    if(!err){
        print('Connected Successfully to MongoDB');
        db =client.db('week6db');
        library = db.collection('books');
        authorLib = db.collection('authors')

    }


});

//Endpoints

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/views/index.html");
});

app.get('/addbook',(req,res) =>{
    res.sendFile(__dirname+"/views/newbook.html");
});



app.get('/listbooks', (req,res)=>{
    
    library.find({}).toArray(function(err, listLibrary){
        
        res.render('listbooks.html', {ar:listLibrary});
    });
})

app.get('/listauthors', (req,res)=>{
    
    authorLib.find({}).toArray(function(err, listLibrary){
        res.render('listauthors.html', {ar:listLibrary});
    });
})



app.get('/deletebook', (req,res)=>{
    res.sendFile(__dirname+"/views/deletebook.html");
})

app.get('/update', (req,res)=>{
    res.sendFile(__dirname+"/views/update.html");
})

app.get('/newauthor', (req,res)=>{
    res.sendFile(__dirname+"/views/newauthor.html");
})

app.post('/newbookpost',(req,res)=>{
        
    mongoose.connect(DB_URL, function(err){
        let book = new Book({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.name, 
            author: req.body.author,
            isbn: req.body.isbn,
            summary:  req.body.summary
    
        });
        book.save(function(err){
            if (err) print (err);
            else print ("Book saved succesfully);");
        });

        
        let filter={_id: mongoose.Types.ObjectId(req.body.author)};
        let update={
            $inc:{
                numBooks: 1,
            }
        }
        authorLib.updateOne(filter,update);

    });



    res.redirect('/listbooks');
});


app.post('/newauthorpost',(req,res)=>{
        
    mongoose.connect(DB_URL, function(err){
        let author = new Author({
            _id: new mongoose.Types.ObjectId(),
            name:{firstName: req.body.firstName,
                lastName: req.body.lastName,
            }, 
            dob: req.body.dob,
            address:{state: req.body.state,
                suburb: req.body.suburb,
                street: req.body.street,
                unit: req.body.unit},

            numBooks:  req.body.numBooks
    
        });
        author.save(function(err){
            if (err) print (err);
            else print ("Author saved succesfully);");
        });

    });

    res.redirect('/listbooks');
});






app.post('/deletebookpost', (req,res) =>{
    let isbn = req.body.isbn
    library.deleteOne({isbn:isbn})
    res.redirect('/listbooks');
})
app.post('/updatebookpost', (req,res) =>{
    let book = req.body;
    let filter = { isbn: book.isbnOLD};
    let update = {$set: {
        name:book.name,
        author: book.author,
        isbn: book.isbnOLD,
        dop: book.dop,
        summary: book.summary}};
    library.updateOne(filter,update);
    res.redirect('/listbooks');
})


