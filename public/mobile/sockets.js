var socket = io(); //.connect('http://134.122.109.226');
console.log('connected to socket');

socket.emit('request-data', userid);

socket.on('reasons-data', function (data) {
  reasons = data;
  updateReasons();
});

socket.on('spending-data', function (data) {
  spendinghistory = data;
  sortByReason();
  sortByDate();
  sortByPeriod(moment().format('YYYY-MM-DD'));

  updateReasons();
  showTransactions();
  drawCharts();

  //check if user has any reasons defined
  if (reasons.length == 0) {
    // the user has no defined reasons
    //give them the option to add default ones
    createNoReasonsHTML();
  }
});