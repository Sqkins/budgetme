var socket = io.connect('http://134.122.109.226');

socket.on('reasons-data',function(data) {
  reasons = data;
  updateReasons();
});

socket.on('spending-data',function(data) {
  spendinghistory = data;
  sortByReason();
  sortByDate();
  thisWeekSort();


  showTransactions();
});
