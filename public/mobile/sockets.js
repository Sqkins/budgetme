var socket = io();//.connect('http://134.122.109.226');
console.log('connected to socket');
var b = false;
while (!b) {
  if(!(typeof userid === 'undefined')) {
    console.log(userid);
    socket.emit('request-data',userid);
    b = true;
  }
}


socket.on('reasons-data',function(data) {
  reasons = data;
  updateReasons();
});

socket.on('spending-data',function(data) {
  spendinghistory = data;
  sortByReason();
  sortByDate();
  sortByWeek(moment().format('YYYY-MM-DD'));

  updateReasons();
  showTransactions();
  drawCharts();
});
