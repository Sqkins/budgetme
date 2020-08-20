var spendinghistory = [];

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
  for(var x in spendinghistory) {
    div.innerHTML += "<p>"+spendinghistory[x].reason+" "+spendinghistory[x].amount+" "+spendinghistory[x].date+"</p>";
  }
}
