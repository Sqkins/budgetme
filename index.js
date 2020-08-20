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
  var sql = "SELECT * FROM transactions";
  con.query(sql, function (err, result) {
    if ( !err ) {
      spendinghistory = result;
    } else if ( err ) {
      console.log(err);
    }
  });
});

//variables

var reasons = [];
var spendinghistory = [];

//socket paths:
//sending reason data from database ~ reasons-data
//adding a reason ~ add-reason (data = 'reason')
//sending clients spendinghistory ~ spending-data (data = 'reason','amount','date')
//sending a new transaction ~ new-transaction (data = 'reason','amount','date')
var io = socket(server);
io.on('connection', function(socket) {
  console.log('Made socket connection.');
  console.log(socket.id);
  socket.emit('reasons-data',reasons);
  socket.on('add-reason',function(data){
    newReason(data);
  });
  socket.on('new-transaction',function(data){
    addTransaction(data);
  });
});

function addTransaction(data) {
  console.log(data);
  var sql = "INSERT INTO transactions (reason,date,amount) VALUES (\""+data.reason+"\",\""+data.date+"\",\""+data.amount+"\")";
  con.query(sql, function (err, result) {
    if ( !err ) {
      var sql = "SELECT * FROM transactions";
      con.query(sql, function (err, result) {
        if ( !err ) {
          spendinghistory = result;
        } else if ( err ) {
          console.log(err);
        }
      });
      io.emit('spending-data',spendinghistory);
    } else if ( err ) {
      console.log('error');
    }
  });
}


function newReason(reason) {
  var sql = "INSERT INTO reasons (reason) VALUES (\""+reason+"\")";
  con.query(sql, function (err, result) {
    if ( !err ) {
      console.log(reason + ' has been added as a new reason!');
      var sql = "SELECT * FROM reasons";
      con.query(sql, function (err, result) {
        if ( !err ) {
          reasons = result;
        } else if ( err ) {
          console.log(err);
        }
      });
      io.emit('reasons-data',reasons);
    } else if ( err ) {
      console.log(err);
    }
  });
}
