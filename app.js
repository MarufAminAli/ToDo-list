const express = require('express');
const bodyParser = require('body-parser');
//const { urlencoded } = require('body-parser');
const date = require (__dirname + "/date.js")

const app = express();

const items = [];
const workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get ("/", (req, res) => {

   const day = date.getDate();
   

    res.render("list", {listTitle: day, newListItems: items})

});

app.post ( "/", (req, res) => { 

   const item = req.body.newItem;
   console.log(req.body);
   if (req.body.list === "Work"){
       workItems.push(item);
       res.redirect("/work");
   }else {
      items.push(item)
      res.redirect("/")
   }
  
 });


 app.get ("/work", (req,res) => {
   res.render("list", {listTitle: "Work list", newListItems:workItems});
 })

 
app.listen (3000, function(){
console.log("server is up and running");

});

