var mongoose=require("mongoose");

var userSchema1=new mongoose.Schema({
   image:String,
   id:String,
   name:String,
   score:String,
   teamid:String
});
 module.exports = mongoose.model("leaders",userSchema1);