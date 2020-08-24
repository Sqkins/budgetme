var socket = io.connect('http://134.122.109.226');

socket.on('reasons-data',function(data) {
  console.log(data);
  reasons = data;
  updateReasons();
});

socket.on('spending-data',function(data) {
  console.log(data);
  spendinghistory = data;
  sortByReason();
  sortByDate();
  showTransactions();
  thisWeekSort();
});
