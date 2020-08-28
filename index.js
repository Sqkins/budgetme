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
app.use(express.static('public/main'));
app.use(express.static('public/mobile'));
app.use(express.static('icon'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/main/main.html'));
});
app.get('/mobile', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/mobile/mobile.html'));
});
app.get('/colors', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/colors.css'));
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
//adding a reason ~ add-reason (data = 'reason',budget)
//sending clients spendinghistory ~ spending-data (data = 'reason','amount','date')
//sending a new transaction ~ new-transaction (data = 'reason','amount','date')
//updating a reasons budget per week ~ edit-budget (data = 'reason','budget')
var io = socket(server);
io.on('connection', function(socket) {
  console.log('Made socket connection.');
  console.log(socket.id);
  socket.emit('reasons-data',reasons);
  socket.emit('spending-data',spendinghistory);
  socket.on('add-reason',function(data){
    newReason(data);
  });
  socket.on('new-transaction',function(data){
    addTransaction(data);
  });
  socket.on('edit-budget',function(data){
    editBudget(data);
  });
});

function addTransaction(data) {
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
      console.log(err);
    }
  });
}


function newReason(data) {
  console.log(data);
  var sql = "INSERT INTO reasons (reason,budget) VALUES (\""+data.reason+"\","+data.budget+")";
  con.query(sql, function (err, result) {
    if ( !err ) {
      console.log(data.reason + 'with budget £'+data.budget+' has been added as a new reason!');
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

function editBudget(data) {
  var sql = "UPDATE reasons SET budget = "+data.budget+"WHERE reason = "+data.reason;
  con.query(sql, function (err, result) {
    if ( !err ) {
      console.log(data.reason + 'with budget £'+data.budget+' has been updated!');
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
