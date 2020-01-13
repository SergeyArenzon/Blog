var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// Mongo connection
mongoose.connect("mongodb://localhost/BlogApp", { useNewUrlParser: true, useUnifiedTopology: true });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

// Mongo schema config

var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);




app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error retriving blogs");
        }else{
            res.render('index.ejs',{blogs:blogs}); 
        }
    });
});



app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});   

app.post("/blogs", function(req, res){
    console.log(req.body.blogTitle);

    var newBlog = {
        title: req.body.blogTitle,
        image: req.body.blogImage,
        body: req.body.blogBody
    };
    Blog.create(newBlog, function(err, newBlog){
       if(err){
           console.log("Error adding new post");
       }else{
           res.redirect("/blogs");
       }
    });
    
});
       


app.get("/blogs/:id", function(req, res){
    var blogId = req.params.id;
    Blog.findById(blogId, function(err, blogFound){
        if(err) console.log("Blog didnt found")
        else{
          res.render("show.ejs",{blogFound:blogFound});  
        }
    });
    

});











app.listen("8080", process.env.IP, function(){
    console.log("Server is running!");
});