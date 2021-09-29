
//including the required modules
const route = require("express").Router();
const mongoose = require("mongoose");
const smartCache = require("./middleware/smartCache");
const cacheMiddleware = require("./middleware/cache");
//creating connection with the database
mongoose.connect("mongodb://localhost:27017/translateDB", {useNewUrlParser: true});
   //we use Translation collection of translateDB
const Translation= mongoose.model("Translation");

route.get("/translate", cacheMiddleware, smartCache, async (req, res) => {

  //this is the final stage, now the required data is already present in the database, we just need to fetch that data from the database
  //for the requested query
  const { src_lang, target_lang, text } = req.query;
  Translation.find({src_lang:`${src_lang}`, target_lang:`${target_lang}`,text:`${text}`},function(err,founditems){
    if (err) {
    console.log(err)
    return res.status(500).send("DB Error occured!");
  }
  if (founditems.length !== 0){
      return res.status(200).send(JSON.stringify({ ...founditems[0]._doc,_id: undefined }))

    }
      return res.status(500).send("Server Error occured!");
    });
})
//exporting this module because required in index.js
module.exports = route;
