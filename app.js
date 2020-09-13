const express = require('express');
const app = express();
const port = 4001;
const parser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Messenger', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = mongoose.Schema({name: String, group: String, code: String});
const usersModel = mongoose.model('users', userSchema);
var date = new Date();
var today = date.toLocaleDateString();


const MessageSchema = mongoose.Schema({name: String, message : Array, Key: String });
const MessageModel = mongoose.model('Messages', MessageSchema);


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(parser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/'));


app.use(logger('dev'));
var array = [];
var loginarray = [];



app.use(express.json());

app.get('/', (req, res)=>[
    res.json({"Welcome": "To this site"})
]);




app.post('/user', (req, res) => {


  var user = new usersModel(req.body);
  user.save();
console.log(req.body);

})

app.get('/messages', (req, res)=>{
 MessageModel.find({}, (err,data )=>{
   if (err) throw err;
   res.json(data);
 })
})

app.post('/addmessage', (req, res)=>{
  var data = req.body;
  usersModel.find({code: data.authkey}, (err, docs)=>{
    if (err) throw  err;

    var message = new MessageModel({
      name : data.name,
      message: data.message,
      Key: data.Key
    })
    message.save();

  })
})




app.post('/verify', (req, res) => {
  usersModel.find({code : req.body.code}, function (err, data) {
 if(err) throw err;

 if(data.length === 0){
  res.json({"isAuth": false});

 }
 else{
   MessageModel.find({name: data[0].name}, (err, messages)=>{
     if(err) throw err;
     res.json({"isAuth": true, "name": data[0].name, "group": data[0].group, "messages": messages, authkey: data[0].code});
     console.log(messages);

   });
 }

  })

})









app.listen(port, (req, res) => {
  console.log("Server is up and running on port " + port);
})
