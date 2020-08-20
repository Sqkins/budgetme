var spendinghistory = [];

function addTransaction() {
  var form = document.getElementById("form");
  function handleForm(event) { event.preventDefault(); }
  form.addEventListener('submit', handleForm);
  var reason = document.getElementById('options').value;
  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;
  console.log('hey');
  console.log(reason);
  console.log(date);
  console.log(amount);
  socket.emit('new-transaction',{reason,date,amount});
}
