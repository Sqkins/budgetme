var spendinghistory = [];

function addTransaction() {
  var reason = document.getElementById('options').value;
  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;

  socket.emit('new-transaction',reason,date,amount);
}
