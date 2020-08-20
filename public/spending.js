var spendinghistory = [];
// data ~ {reason : price}
var reasonbreakdown = [];
// data ~ {date : price}
var datebreakdown = [];

function addTransaction() {
  var reason = document.getElementById('options').value;
  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;
  socket.emit('new-transaction',{reason,date,amount});
}

function showTransactions() {
  var div = document.getElementById('transactions');
  div.innerHTML = "";
  for(var reason in reasonbreakdown) {
    div.innerHTML += "<p>"+reason+" £"+reasonbreakdown[reason]+"</p>";
  }
  for(var date in datebreakdown) {
    div.innerHTML += "<p>"+date+" £"+datebreakdown[date]+"</p>";
  }
}

function sortByReason() {
  var reasonsbd = [];
  for(var x in spendinghistory) {
    var r = spendinghistory[x].reason; //reason at transaction x
    var s = spendinghistory[x].amount; //spend at transaction x
    if (reasonsbd.hasOwnProperty(r)) {
      var totals = reasonsbd[r]; //total spend for reason so far
      totals+= s;
      reasonsbd[r] = totals;
    } else {
      reasonsbd[r] = s;
    }
  }
  reasonsbreakdown = reasonsbd;
}

function sortByDate() {
  var datesbd = [];
  for(var x in spendinghistory) {
    var d = spendinghistory[x].date; //date at transaction x
    var s = spendinghistory[x].amount; //spend at transaction x
    if (datesbd.hasOwnProperty(d)) {
      var totals = datesbd[d]; //total spend for reason so far
      totals+= s;
      datesbd[d] = totals;
      console.log(datesbd[d]);
    } else {
      datesbd[d] = s;
    }
  }
  datebreakdown = datesbd;
}
