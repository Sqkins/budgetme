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
      io.emit('reasons-data')
    } else if ( err ) {
      console.log(err);
    }
  });
});


//socket paths:
//sending reason data from database ~ reasons-data
var io = socket(server);
io.on('connection', function(socket) {
  console.log('Made socket connection.');
  console.log(socket.id);
});
