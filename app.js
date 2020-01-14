var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

// Mongo connection
mongoose.connect("mongodb://localhost/BlogApp", { useNewUrlParser: true, useUnifiedTopology: true });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
// Overrides POST method for PUT method
app.use(methodOverride('_method'));
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


app.get("/blogs/:id/edit", function(req, res){
    var blogId = req.params.id;
    Blog.findById(blogId, function(err, blogFound){
        if(err) console.log("Blog didnt found")
        else{
          res.render("edit.ejs",{blogFound:blogFound});  
        }
    });
});


// Update route

app.put("/blogs/:id", function(req, res){
    var blogId = req.params.id;
    

    var updateTitle = req.body.blogTitle;
    var updateImage = req.body.blogImage;
    var updateBody = req.body.blogBody;
    Blog.findByIdAndUpdate(blogId, {title: updateTitle, image: updateImage, body: updateBody}, function(err, updatedBlog){
        if(err){
            console.log("blog didnt update");

        }else{
            
            res.redirect("/blogs/" + blogId);
        }


    });
});





app.listen("8080", process.env.IP, function(){
    console.log("Server is running!");
});