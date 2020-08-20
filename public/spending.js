var spendinghistory = [];
// data ~ {reason : price}
var reasonbreakdown = [];

function addTransaction() {
  var reason = document.getElementById('options').value;
  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;
  console.log('hey');
  console.log(reason);
  console.log(date);
  console.log(amount);
  socket.emit('new-transaction',{reason,date,amount});
}

function showTransactions() {
  var div = document.getElementById('transactions');
  div.innerHTML = "";
  for(var reason in sortedByReason) {
    div.innerHTML += "<p>"+reason+" £"+sortedByReason[reason]+"</p>";
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
      console.log(reasonsbd[r]);
    } else {
      reasonsbd[r] = s;
    }
  }
}
