//including the mongoose module
const mongoose = require("mongoose");
//creating connection with  translateDB databse
mongoose.connect("mongodb://localhost:27017/translateDB", {useNewUrlParser: true});
   //we use Translation collection of translateDB
const Translation= mongoose.model("Translation");
//checking the requsted translation is already  present or not in database
const cacheMiddleware = async (req, res, next) => {

  const { src_lang, target_lang, text } = req.query;

  Translation.find({src_lang:`${src_lang}`, target_lang:`${target_lang}`,text:`${text}` },function(err,founditems){
    if (err) {
    console.log(err)
    return res.status(500).send("DB Error occured!");
  }
  if (founditems.length !== 0){

      return res.status(200).send(JSON.stringify({ ...founditems[0]._doc,_id: undefined }))

    }
    next();
  });
}
//exporting this module as required in route.js
module.exports = cacheMiddleware;
