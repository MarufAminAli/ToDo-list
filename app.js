const express = require('express');
const bodyParser = require('body-parser');
const date = require (__dirname + "/date.js")
const mongoose = require ("mongoose");
const _ = require ("lodash")

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const day = date.getDate();
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser : true});

const itemsSchema = {
   name:String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
   name : "welcome to your ToDo List"
})
const item2 = new Item ({
   name : "Hit the + button to add a new item"
})
const item3 = new Item ({
   name : "<= hit this to delete and item"
})

const defaultItems =[ item1, item2, item3 ];

const listSchema = {
   name:String,
   items:[itemsSchema]
}
const List = mongoose.model("List", listSchema);

async function getItems(){
   const Items = await Item.find({});
   return Items;
}


app.get ("/", (req, res) => {
  

getItems().then(function(foundItems){
   if(foundItems.length === 0){
      Item.insertMany(defaultItems).then(()=>{
         console.log ("succesfully saved default items to Database")
      })
      .catch((err)=>{
         console.log(err);
         res.redirect("/");
      });
   }else {
      res.render("list", {listTitle: day, newListItems: foundItems})
   };
});

});

app.post ( "/", (req, res) => { 

   const itemName = req.body.newItem;
   const listName = req.body.list;
   
   const item = new Item ({
      name: itemName
   });

   if (listName===day){
      item.save();
      res.redirect("/");
   }else {
      List.findOne({name: listName}).then(foundList => {
         foundList.items.push(item);
         foundList.save();
         res.redirect("/" + listName);
      });
   };

 });


 app.post("/delete", (req, res) => {
   const checkedItemId = req.body.checkbox;
   const listName1 = req.body.listName;
   if (listName1===day){
      Item.findByIdAndRemove(checkedItemId).then(() => {
         console.log("succesfully deleted " + checkedItemId + "from Database");
         res.redirect("/")
            })
         }else {
            List.findOneAndUpdate({name: listName1}, {$pull:
               {items:{_id: checkedItemId}}}).then((foundList)=>{
                  res.redirect("/" + listName1)
               })
         }
      })
  
app.get ("/:customListName", (req,res)=> {
   const customListName = _.capitalize(req.params.customListName);

   

   List.findOne({name:customListName}).then(foundList =>{
      if(!foundList){
         const list = new List ({
            name: customListName,
            items:defaultItems
         });
         list.save()
         res.redirect("/" + customListName)
      }else {
         res.render ("list", {listTitle: foundList.name, newListItems:foundList.items});
      }
   })
});
 
app.listen (3000, function(){
console.log("server is running on port 3000");

});

