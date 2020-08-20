var express = require('express');
var socket = require('socket.io');
var mysql = require('mysql');
var path = require('path');

//Setup App
var app = express();
var server = app.listen(80, function() {
  console.log('Listening on port 80');
});

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/main.html'));
});

var con = mysql.createConnection({
  host: "localhost",
  port: '3306',
  user: "root",
  password: "",
  database: "budgetme",
  insecureAuth : true
});

con.connect(function(err) {
  if ( !err ) {
    console.log("Connected to MySQL");
  } else if ( err ) {
    console.log(err);
  }
  var sql = "SELECT * FROM reasons";
  con.query(sql, function (err, result) {
    if ( !err ) {
      reasons = result;
    } else if ( err ) {
      console.log(err);
    }
  });
});

//variables

var reasons = [];

//socket paths:
//sending reason data from database ~ reasons-data
//adding a reason ~ add-reason (data = 'reason')
var io = socket(server);
io.on('connection', function(socket) {
  console.log('Made socket connection.');
  console.log(socket.id);
  socket.emit('reasons-data',reasons);
  socket.on('add-reason',function(data){
    newReason(data);
  })
});

function newReason(reason) {
  var sql = "INSERT INTO customers (reason) VALUES ("+reason+")";
  con.query(sql, function (err, result) {
    if ( !err ) {
      console.log(reason + ' has been added as a new reason!');
      reasons.push(reason);
      io.emit('reasons-data',reasons);
    } else if ( err ) {
      console.log(err);
    }
  });
}
