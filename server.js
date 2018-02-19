// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// use json
app.use(bodyParser.json());

// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './client/dist')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// require mongoose
var mongoose = require('mongoose');
// Connect to database
mongoose.connect('mongodb://localhost/Tasks');
mongoose.Promise = global.Promise;

// create schema and model
let Schema = mongoose.Schema;
let CRUDTaskSchema = new mongoose.Schema({
    name: { type: String, required: true},
    desc: { type: String},
    done: { type: Boolean, default: false}
}, {timestamps: true});


let Task = mongoose.model("CRUDTask", CRUDTaskSchema);

// Routes
// Root Request
// get all task
app.get('/tasks', function(req, res) {
    Task.find({}, function(err, tasks) {
        if (err) {  
            console.log("Error retrieving tasks");
            console.log(err)
            res.json({message: "Error", error: err});
        } 
        // console.log('posts: ', posts)
        res.json({message: "Success", data: tasks});
    })
})


// get one task
app.get('/tasks/:id', function(req, res) {
    console.log("enter get")
    Task.findOne({_id: req.params.id}, function(err, task) {
        if(err) {
            console.log('Error retrieving data');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully retrieved a task');
            res.json({message: "Success", data: task});
        }
    })
})

// create new task
app.post('/tasks', function(req, res) {
    console.log(req.body)
    var task = new Task({name: req.body.name, 
                    desc: req.body.desc});
            
    // Try to save that new task to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    task.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('Error saving new task');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully added a task');
            res.json({message: "Success", data: task});
        }
    })
})

// update task
app.put('/tasks/:id', function(req, res) {
    Task.findOneAndUpdate({_id: req.params.id}, 
                        {$set: { name: req.body.name, desc: req.body.desc}}, 
                        null, function(err) {
        if(err) {
            console.log('Error during task update');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully deleting a task');
            res.json({message: "Success"});
        }
    })
})

// delete task
app.delete('/tasks/:id', function(req, res) {
    Task.deleteOne({_id: req.params.id}, function(err) {
        if(err) {
            console.log('Error during delete');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully deleting a task');
            res.json({message: "Success"});
        }
    })
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("Restful Task API listening on port 8000");
})
