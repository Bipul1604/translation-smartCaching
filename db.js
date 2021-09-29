//including the mongoose module
const mongoose = require("mongoose");
//creating connection with mongoose  database and create translateDB databse if not exist
mongoose.connect("mongodb://localhost:27017/translateDB", {useNewUrlParser: true});
//Create Database Schema
const translateSchema=new mongoose.Schema({

  src_lang:{
    type:String,
    required:true},
  target_lang:{
      type:String,
      required:true},
  text:{
      type:String,
      required:true},

  translatedtext :{
      type:String,
      required:true}
});
//create database collection
const Translation=new mongoose.model("Translation",translateSchema);
