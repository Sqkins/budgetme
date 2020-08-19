var express = require('express');
var socket = require('socket.io');
var mysql = require('mysql');
var path = require('path');

//Setup App
var app = express();
var server = app.listen(8080, function() {
  console.log('Listening on port 8080');
});

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/main.html'));
});

var con = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
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
  var sql = "SELECT * FROM transactions";
  con.query(sql, function (err, result) {
    if ( !err ) {
      console.log(result);
    } else if ( err ) {
      console.log(err);
    }
  });
});
