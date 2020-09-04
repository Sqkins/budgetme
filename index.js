var express = require('express');
var socket = require('socket.io');
var mysql = require('mysql');
var path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
//Setup App
var app = express();
var server = app.listen(80, function() {
  console.log('Listening on port 80');
});


// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


app.use(express.static('public'));
app.use(express.static('public/main'));
app.use(express.static('public/mobile'));
app.use(express.static('icon'));
app.get('/legacy', function(req, res) {
  var ua = req.header('user-agent');
  // Check the user-agent string to identyfy the device.
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(ua)) {
    res.redirect("http://134.122.109.226/mobile/");
  } else {
    res.sendFile(path.join(__dirname + '/public/main/main.html'));
  }

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
  insecureAuth: true
});

con.connect(function(err) {
  if (!err) {
    console.log("Connected to MySQL");
  } else if (err) {
    console.log(err);
  }
  var sql = "SELECT * FROM reasons";
  con.query(sql, function(err, result) {
    if (!err) {
      reasons = result;
      console.log(reasons);
    } else if (err) {
      console.log(err);
    }
  });
  var sql = "SELECT * FROM transactions";
  con.query(sql, function(err, result) {
    if (!err) {
      spendinghistory = result;
    } else if (err) {
      console.log(err);
    }
  });
});

//variables

var reasons = [];
var spendinghistory = [];

//socket paths:
//sending reason data from database ~ reasons-data
//adding a reason ~ add-reason (data = 'userid','reason',budget)
//sending clients spendinghistory ~ spending-data (data = 'userid','reason','amount','date')
//sending a new transaction ~ new-transaction (data = 'userid','reason','amount','date')
//updating a reasons budget per week ~ edit-budget (data = 'userid','reason','budget')
var io = socket(server);
io.on('connection', function(socket) {
  console.log('Made socket connection.');
  console.log(socket.id);
  socket.on('request-data', function(userid) {
    console.log(userid);
    console.log(getUserReasons(userid));
    var userreasons = getUserReasons(userid);
    var userspending = getUserSpending(userid);
    socket.emit('reasons-data',userreasons);
    socket.emit('spending-data', userspending);
  });


  socket.on('add-reason', function(data) {
    newReason(data);
  });
  socket.on('new-transaction', function(data) {
    addTransaction(data);
  });
  socket.on('edit-budget', function(data) {
    editBudget(data);
  });
});

function getUserSpending(userid) {
  var r = [];
  spendinghistory.forEach(element => {
    if(element.userid === userid) {
      r.push(element);
    }
  });
  return r;
}
function getUserReasons(userid) {
  var r;
  reasons.forEach(element => {
    if(element.userid === userid) {
      r.push(element);
    }
  });
  return r;
}

function addTransaction(data) {
  var sql = "INSERT INTO transactions (reason,date,amount,userid) VALUES (\"" + data.reason + "\",\"" + data.date + "\",\"" + data.amount + "\",\"" + data.userid + "\")";
  con.query(sql, function(err, result) {
    if (!err) {
      var sql = "SELECT * FROM transactions";
      con.query(sql, function(err, result) {
        if (!err) {
          spendinghistory = result;
        } else if (err) {
          console.log(err);
        }
      });
      io.emit('spending-data', spendinghistory);
    } else if (err) {
      console.log(err);
    }
  });
}


function newReason(data) {
  console.log(data);
  var sql = "INSERT INTO reasons (reason,budget,userid) VALUES (\"" + data.input + "\"," + data.budget + ",\"" + data.userid + "\")";
  con.query(sql, function(err, result) {
    if (!err) {
      console.log(data.reason + 'with budget £' + data.budget + ' has been added as a new reason!');
      var sql = "SELECT * FROM reasons";
      con.query(sql, function(err, result) {
        if (!err) {
          reasons = result;
        } else if (err) {
          console.log(err);
        }
      });
      io.emit('reasons-data', reasons);
    } else if (err) {
      console.log(err);
    }
  });
}

function editBudget(data) {
  var sql = "UPDATE reasons SET budget = " + data.budget + " WHERE reason = \"" + data.reason + "\" AND userid = \"" + data.userid + "\"";
  con.query(sql, function(err, result) {
    if (!err) {
      console.log(data.reason + 'with budget £' + data.budget + ' has been updated!');
      var sql = "SELECT * FROM reasons";
      con.query(sql, function(err, result) {
        if (!err) {
          reasons = result;
        } else if (err) {
          console.log(err);
        }
      });
      io.emit('reasons-data', reasons);
    } else if (err) {
      console.log(err);
    }
  });
}
