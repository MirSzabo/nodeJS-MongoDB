const express = require("express");
const router = express.Router();

//bring in article model
const Article = require("../models/article");

  //add route
  router.get("/add", (req, res) => {
    res.render("add_article", {
      title: "Add Article"
    });
  });
  
  //add submit POST route
  router.post("/add", (req, res) => {
    req.checkBody("title", "Title is required").notEmpty();
    req.checkBody("author", "Author is required").notEmpty();
    req.checkBody("body", "Body is required").notEmpty();
  
    //get errors
    let errors = req.validationErrors();
    if(errors){
      res.render("add_article", {
        title: "Add Article",
       errors:errors 
      });
    } else {
      const article = new Article();
      article.title = req.body.title;
      article.author = req.body.author;
      article.body = req.body.body;
    
      article.save(err => {
        if(err){
          console.log(err);
          return;
        } else {
          req.flash("success", "Article Added");
          res.redirect("/");
        }
      });
    }
    
  });
  
  //load edit form
  router.get("/edit/:id", (req, res) => {
    Article.findById(req.params.id, (err, article) => {
      res.render("edit_article", {
        title:"Edit Article",
        article:article
      });
    });
  });
  
  //update submit
  router.post("/edit/:id", (req, res) => {
    const article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
  
    let query = {_id: req.params.id}
  
    Article.update(query, article, err => {
      if(err){
        console.log(err);
        return;
      } else {
        req.flash("success", "Article Updated");
        res.redirect("/");
      }
    });
  });
  
  //delete
  router.delete('/:id', function(req, res){
   /* if(!req.user._id){
      res.status(500).send();
    }*/
  
    let query = {_id:req.params.id}
    Article.remove(query, function(err){
      if(err){
        console.log(err);
      }
      res.send('Success');
    });
    /*Article.findById(req.params.id, function(err, article){
      if(article.author != req.user._id){
        res.status(500).send();
      } else {
        Article.remove(query, function(err){
          if(err){
            console.log(err);
          }
          res.send('Success');
        });
      }
    });*/
  });

  //get single article 
router.get("/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("article", {
      article:article
    });
  });
});

  
  module.exports = router;