const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
const jsonParser = bodyParser.json(); //middleware

postArray = [
    {
        id: uuid.v4(),
        title: "First Post",
        content: "This is my first post",
        author: "Carolina",
        publishDate: '23-Mar-19'
    },
    {
        id: uuid.v4(),
        title: "Second Post",
        content: "This is my second post",
        author: "Carolina",
        publishDate: '23-Mar-19'
    },
    {
        id: uuid.v4(),
        title: "Third Post",
        content: "This is my third post",
        author: "Ana",
        publishDate: '23-Mar-19'
    }
]


//GET request of all blog posts should go to /blog-posts
app.get('/blog-posts', (req, res) => {
    res.status(200).json({
        message: "Successfully sent the list of posts",
        status: 200,
        posts: postArray
    });
});


//GET by author requests should go to /blog-posts/:author
app.get('/blog-posts/:author', (req, res) => {
    let postAuthor = req.params.author;
    const authorPosts = [];

    if(!postAuthor){
        res.status(406).json({
            message: "Missing author field in params",
            status: 406
        });
    }

    postArray.forEach(item => {
        if(postAuthor == item.author){
            authorPosts.push(item);
        }
    });

    if(authorPosts.length > 0){
        res.status(200).json({
            message: "Successfully sent the list of posts",
            status: 200,
            post: authorPosts
        });
    }else{
        res.status(404).json({
            message : "Author posts not found in the list",
            status : 404
        });
    }    
});


//POST requests of a blog post should go to /blog-posts
app.post('/blog-posts', jsonParser, (req, res) => {

    let postTitle = req.body.title;
    let postContent = req.body.content;
    let postAuthor = req.body.author;
    let postPublishDate = req.body.publishDate;

    let requiredFields = ['title', 'content', 'author', 'publishDate'];

    for (let i = 0; i < requiredFields.length; i++){
        let currentField = requiredFields[i];
        if(!(currentField in req.body)){
            res.status(406).json({
                message : `Missing field ${currentField} in body.`,
                status : 406
            }).send("Finish");
        }
    }

    let newPost = {
        id: uuid.v4(),
        title: postTitle,
        content: postContent,
        author: postAuthor,
        publishDate: postPublishDate
    };
    postArray.push(newPost);

    res.status(201).json({
        message: "Successfully added the post",
        status: 201,
        post: newPost
    });
});


//DELETE requests should go to /blog-posts/:id
app.delete('/blog-posts/:id', jsonParser, (req, res) => {
    let bodyId = req.body.id;
    let paramId = req.params.id;

    if(!bodyId || !paramId || bodyId != paramId){
        res.status(406).json({
            message: "Missing id field in body or paramters or id's don't match",
            status: 406
        });
        return;
    }

    postArray.forEach(item => {
        if(paramId == item.id){
            postArray.splice(item, 1);
            res.status(200).json({
                message: "Successfully deleted post",
                status: 200
            });
            return;
        }
    });

    res.status(404).json({
        message: "Post not found",
        status: 404
    });
});


//PUT requests should go to /blog-posts/:id
app.put('/blog-posts/:id', jsonParser, (req, res) => {
    let postId = req.params.id;
    let updatedPost = req.body;
    let newPost = null;
    
    if(!postId){
        res.status(406).json({
            message: "Missing id field in params",
            status: 406
        });
    }

    if(!updatedPost.title && !updatedPost.content && !updatedPost.author && !updatedPost.publishDate){
        res.status(404).json({
            message: "No data in body",
            status: 404
        });
    }else{
        postArray.forEach(item => {
            if(postId == item.id){
                if(updatedPost.title) {item.title = updatedPost.title;}
                if(updatedPost.content) {item.content = updatedPost.content;}
                if(updatedPost.author) {item.author = updatedPost.author;}
                if(updatedPost.publishDate) {item.publishDate = updatedPost.publishDate;}
                newPost = item;

                res.status(200).json({
                    message: "Successfully updated post",
                    status: 200,
                    post: newPost
                });
            }
        });   
    }

    res.status(404).json({
        message: 'ID does not exist',
        status: 404,
    });

});


app.listen(8080, () => {
    console.log("Your app is running in port 8080");
});