//including the required module
const googleTranslate = require('@vitalets/google-translate-api');
const mongoose = require("mongoose");
//creating connection with  translateDB databse
mongoose.connect("mongodb://localhost:27017/translateDB", {useNewUrlParser: true});
   //we use Translation collection of translateDB
const Translation= mongoose.model("Translation");
//similar languages for smart Caching
const similarLanguagesList = {
  "hi": ["kn", "bn", "gu", "pa", "ta", "te"],
  "en": ["cy","fr", "de", "it", "es", "nl"],
  "fr": ["de", "it", "es", "nl"],
  "kn":["hi","ta","te","gu"]
}

const smartCache = (req, res, next) => {
  const { src_lang, target_lang, text } = req.query;
   //translating the data

  //hitting the api here for all the similar languages listed above and storing them in the database

    googleTranslate(`${text}`, {to: `${target_lang}`}).then(respons => {
    const similarLanguages = similarLanguagesList[target_lang];
    if(similarLanguages!=null)
    {
      for (let i = 0; i < similarLanguages.length; i++) {

            googleTranslate(`${text}`, {to: `${similarLanguages[i]}`}).then(res => {
          const Translation1=new Translation({
            src_lang: `${src_lang}`,
            target_lang: `${similarLanguages[i]}`,
              text:`${text}`,
              translatedtext: `${res.text}`

          });
          Translation1.save();
        })
        }
      }
      //adding the text language and source language and text and translated text in the database
      const Translation2=new Translation({
                  src_lang: `${src_lang}`,
                  target_lang: `${target_lang}`,
                    text:`${text}`,
                    translatedtext: `${respons.text}`

      });
      Translation2.save((err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).send("DB Error occured!");
      }
      next();
    });
  });
}
//exporting this module as required in route.js
module.exports = smartCache;
